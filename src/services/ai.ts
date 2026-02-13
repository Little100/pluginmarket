import { useAppStore } from '@/store'
import type { AIModelConfig, AIRole, ChatMessage } from '@/types'

// 并发限制错误
export class ConcurrencyLimitError extends Error {
  constructor(public maxConcurrency: number) {
    super(`由于并发数量限制为 ${maxConcurrency}，并且存在其他对话，当前无法继续会话`)
    this.name = 'ConcurrencyLimitError'
  }
}

// 跨标签页并发控制器
class ConcurrencyLimiter {
  private queue: (() => void)[] = []
  private running = 0
  private localSlots = 0 // 当前标签页持有的槽位数
  private channel: BroadcastChannel
  private storageKey: string
  private tabId: string

  constructor(private modelId: string, private maxConcurrency: number) {
    this.storageKey = `ai-concurrency-${modelId}`
    this.tabId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    this.channel = new BroadcastChannel('ai-concurrency')
    
    // 监听其他标签页的消息
    this.channel.onmessage = (event) => {
      if (event.data.type === 'sync' && event.data.modelId === this.modelId) {
        // 其他标签页请求同步，不需要特别处理
      }
    }
    
    // 页面关闭时清理
    window.addEventListener('beforeunload', () => {
      this.cleanup()
    })
  }

  private getGlobalCount(): number {
    try {
      const value = localStorage.getItem(this.storageKey)
      return value ? parseInt(value, 10) : 0
    } catch {
      return 0
    }
  }

  private setGlobalCount(count: number): void {
    try {
      if (count <= 0) {
        localStorage.removeItem(this.storageKey)
      } else {
        localStorage.setItem(this.storageKey, count.toString())
      }
      // 通知其他标签页
      this.channel.postMessage({ type: 'sync', modelId: this.modelId, count })
    } catch {
      // 忽略 localStorage 错误
    }
  }

  async acquire(): Promise<void> {
    // 先检查全局并发数
    const globalCount = this.getGlobalCount()
    
    // 如果全局已达上限，且不是本标签页的请求在排队，则抛出错误
    if (globalCount >= this.maxConcurrency && this.running >= this.maxConcurrency) {
      throw new ConcurrencyLimitError(this.maxConcurrency)
    }
    
    // 本地并发控制
    if (this.running < this.maxConcurrency) {
      // 再次检查全局计数（可能有竞态）
      const currentGlobal = this.getGlobalCount()
      if (currentGlobal >= this.maxConcurrency) {
        throw new ConcurrencyLimitError(this.maxConcurrency)
      }
      
      this.running++
      this.localSlots++
      this.setGlobalCount(currentGlobal + 1)
      return
    }
    
    // 需要排队等待
    return new Promise<void>((resolve, reject) => {
      this.queue.push(() => {
        // 排队后再次检查全局计数
        const currentGlobal = this.getGlobalCount()
        if (currentGlobal >= this.maxConcurrency) {
          reject(new ConcurrencyLimitError(this.maxConcurrency))
          return
        }
        
        this.running++
        this.localSlots++
        this.setGlobalCount(currentGlobal + 1)
        resolve()
      })
    })
  }

  release(): void {
    this.running--
    this.localSlots--
    
    // 更新全局计数
    const currentGlobal = this.getGlobalCount()
    this.setGlobalCount(Math.max(0, currentGlobal - 1))
    
    // 处理本地队列
    const next = this.queue.shift()
    if (next) next()
  }

  // 清理当前标签页持有的所有槽位
  cleanup(): void {
    if (this.localSlots > 0) {
      const currentGlobal = this.getGlobalCount()
      this.setGlobalCount(Math.max(0, currentGlobal - this.localSlots))
      this.localSlots = 0
      this.running = 0
      this.queue = []
    }
    this.channel.close()
  }
}

const limiters = new Map<string, ConcurrencyLimiter>()

function getLimiter(model: AIModelConfig): ConcurrencyLimiter {
  if (!limiters.has(model.id)) {
    limiters.set(model.id, new ConcurrencyLimiter(model.id, model.maxConcurrency))
  }
  return limiters.get(model.id)!
}

// 获取指定角色的模型配置
export function getModelForRole(role: AIRole): AIModelConfig | undefined {
  return useAppStore.getState().getModelForRole(role)
}

// 检查 AI 是否可用
export function isAIAvailable(role: AIRole): boolean {
  const model = getModelForRole(role)
  return !!(model?.apiKey && model.enabled)
}

// 构建请求 URL
function buildUrl(model: AIModelConfig): string {
  const base = model.baseUrl.replace(/\/$/, '')
  return `${base}/chat/completions`
}
// 非流式调用
export async function chatCompletion(
  role: AIRole,
  messages: ChatMessage[],
  options?: { temperature?: number }
): Promise<string> {
  const model = getModelForRole(role)
  if (!model) throw new Error(`未配置 ${role} 角色的模型`)
  if (!model.apiKey) throw new Error(`模型 ${model.name} 未设置 API Key`)

  const limiter = getLimiter(model)
  await limiter.acquire()

  try {
    const res = await fetch(buildUrl(model), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${model.apiKey}`,
      },
      body: JSON.stringify({
        model: model.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        stream: false,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`AI 调用失败: ${res.status} ${err}`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content || ''
  } finally {
    limiter.release()
  }
}

// Tool 定义类型
export interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, {
        type: string
        description?: string
        enum?: string[]
        items?: { type: string }
      }>
      required?: string[]
    }
  }
}

// Tool call 结果类型
export interface ToolCallResult {
  id: string // tool_call_id
  name: string
  arguments: Record<string, unknown>
}

// Tool choice 类型
export type ToolChoice = 'auto' | 'none' | { type: 'function'; function: { name: string } }

// 带 tool call 的非流式调用
export async function chatCompletionWithTools(
  role: AIRole,
  messages: ChatMessage[],
  tools: ToolDefinition[],
  options?: { temperature?: number; toolChoice?: ToolChoice }
): Promise<{ content?: string; toolCalls?: ToolCallResult[] }> {
  const model = getModelForRole(role)
  if (!model) throw new Error(`未配置 ${role} 角色的模型`)
  if (!model.apiKey) throw new Error(`模型 ${model.name} 未设置 API Key`)

  const limiter = getLimiter(model)
  await limiter.acquire()

  try {
    const res = await fetch(buildUrl(model), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${model.apiKey}`,
      },
      body: JSON.stringify({
        model: model.model,
        messages,
        tools,
        tool_choice: options?.toolChoice ?? 'auto',
        temperature: options?.temperature ?? 0.7,
        stream: false,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`AI 调用失败: ${res.status} ${err}`)
    }

    const data = await res.json()
    const message = data.choices?.[0]?.message
    if (message?.tool_calls && message.tool_calls.length > 0) {
      const toolCalls: ToolCallResult[] = message.tool_calls.map((tc: { id: string; function: { name: string; arguments: string } }) => ({
        id: tc.id,
        name: tc.function.name,
        arguments: JSON.parse(tc.function.arguments),
      }))
      return { content: message?.content || undefined, toolCalls }
    }
    
    return { content: message?.content || '' }
  } finally {
    limiter.release()
  }
}

// 流式调用
export async function* chatCompletionStream(
  role: AIRole,
  messages: ChatMessage[],
  options?: { temperature?: number; signal?: AbortSignal }
): AsyncGenerator<string> {
  const model = getModelForRole(role)
  if (!model) throw new Error(`未配置 ${role} 角色的模型`)
  if (!model.apiKey) throw new Error(`模型 ${model.name} 未设置 API Key`)

  const limiter = getLimiter(model)
  await limiter.acquire()

  try {
    const res = await fetch(buildUrl(model), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${model.apiKey}`,
      },
      body: JSON.stringify({
        model: model.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        stream: true,
      }),
      signal: options?.signal,
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`AI 调用失败: ${res.status} ${err}`)
    }

    const reader = res.body?.getReader()
    if (!reader) throw new Error('无法读取响应流')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const data = trimmed.slice(6)
        if (data === '[DONE]') return

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) yield content
        } catch {
          // 忽略解析错误
        }
      }
    }
  } finally {
    limiter.release()
  }
}

// 使用指定模型直接调用（不通过角色）
export async function chatWithModel(
  model: AIModelConfig,
  messages: ChatMessage[],
  options?: { temperature?: number }
): Promise<string> {
  if (!model.apiKey) throw new Error(`模型 ${model.name} 未设置 API Key`)

  const limiter = getLimiter(model)
  await limiter.acquire()

  try {
    const res = await fetch(buildUrl(model), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${model.apiKey}`,
      },
      body: JSON.stringify({
        model: model.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        stream: false,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`AI 调用失败: ${res.status} ${err}`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content || ''
  } finally {
    limiter.release()
  }
}

// 并发翻译多行文本（高并发优化版）
export async function translateLines(lines: string[]): Promise<string[]> {
  const model = getModelForRole('translate')
  if (!model) throw new Error('未配置翻译模型')

  const results: string[] = new Array(lines.length).fill('')
  
  // 过滤出需要翻译的行（跳过空行、纯 HTML 标签、图片等）
  const translateTasks: { index: number; text: string }[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // 跳过空行
    if (!line) {
      results[i] = lines[i]
      continue
    }
    
    // 跳过纯 HTML 标签行（如 <div>, </div>, <br>, <hr> 等）
    if (/^<\/?[a-z][^>]*>$/i.test(line)) {
      results[i] = lines[i]
      continue
    }
    
    // 跳过图片标签
    if (/^<img\s/i.test(line) || /!\[.*\]\(.*\)/.test(line)) {
      results[i] = lines[i]
      continue
    }
    
    // 跳过 SVG 相关内容
    if (/<svg|<\/svg|<path|<circle|<rect|<polygon/i.test(line)) {
      results[i] = lines[i]
      continue
    }
    
    // 跳过纯链接行
    if (/^\[.*\]\(.*\)$/.test(line) || /^<a\s.*<\/a>$/i.test(line)) {
      results[i] = lines[i]
      continue
    }
    
    // 跳过代码块标记
    if (/^```/.test(line)) {
      results[i] = lines[i]
      continue
    }
    
    // 提取纯文本内容进行翻译
    translateTasks.push({ index: i, text: line })
  }
  
  if (translateTasks.length === 0) {
    return results
  }
  
  // 使用模型的最大并发数
  const maxConcurrency = model.maxConcurrency
  const limiter = getLimiter(model)
  
  // 并发执行所有翻译任务
  const promises = translateTasks.map(async (task) => {
    await limiter.acquire()
    try {
      // 提取文本内容（去除 HTML 标签）
      const textOnly = task.text
        .replace(/<[^>]+>/g, ' ')  // 移除 HTML 标签
        .replace(/\s+/g, ' ')      // 合并空格
        .trim()
      
      // 如果提取后没有实际文本，保留原内容
      if (!textOnly || textOnly.length < 2) {
        results[task.index] = lines[task.index]
        return
      }
      
      const translated = await chatWithModel(model, [
        { 
          role: 'system', 
          content: '你是 Minecraft 插件翻译助手。将英文翻译成简体中文。只输出翻译后的文本，不要输出任何 HTML 标签、代码或解释。如果输入已经是中文或无法翻译，直接输出原文。' 
        },
        { role: 'user', content: textOnly },
      ], { temperature: 0.2 })
      
      // 如果原文有 Markdown 格式，尝试保留
      let finalResult = translated.trim()
      
      // 保留标题格式
      const headingMatch = task.text.match(/^(#{1,6})\s/)
      if (headingMatch) {
        finalResult = `${headingMatch[1]} ${finalResult}`
      }
      
      // 保留列表格式
      const listMatch = task.text.match(/^(\s*[-*+]\s|\s*\d+\.\s)/)
      if (listMatch) {
        finalResult = `${listMatch[1]}${finalResult}`
      }
      
      // 保留粗体/斜体
      if (task.text.includes('**') && !finalResult.includes('**')) {
        // 简单处理：如果原文有粗体，给翻译结果也加上
        const boldMatch = task.text.match(/\*\*([^*]+)\*\*/)
        if (boldMatch) {
          finalResult = `**${finalResult}**`
        }
      }
      
      results[task.index] = finalResult
    } catch (err) {
      // 翻译失败时保留原文
      results[task.index] = lines[task.index]
    } finally {
      limiter.release()
    }
  })
  
  await Promise.all(promises)
  return results
}

// 视觉模型描述图片
export async function describeImage(imageUrl: string): Promise<string> {
  const model = getModelForRole('vision')
  if (!model) throw new Error('未配置视觉模型')

  return chatWithModel(model, [
    {
      role: 'user',
      content: [
        { type: 'text', text: '请详细描述这张 Minecraft 插件相关的图片内容，包括界面截图中的功能、配置项等信息。用中文回答。' },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
    },
  ], { temperature: 0.3 })
}

// 并发描述多张图片
export async function describeImages(imageUrls: string[]): Promise<string[]> {
  const model = getModelForRole('vision')
  if (!model) return imageUrls.map(() => '')

  const limiter = getLimiter(model)
  const results: string[] = []

  for (const url of imageUrls) {
    await limiter.acquire()
    try {
      const desc = await chatWithModel(model, [
        {
          role: 'user',
          content: [
            { type: 'text', text: '简要描述这张图片的内容。用中文回答，50字以内。' },
            { type: 'image_url', image_url: { url } },
          ],
        },
      ], { temperature: 0.3 })
      results.push(desc)
    } catch {
      results.push('')
    } finally {
      limiter.release()
    }
  }

  return results
}

// 翻译插件信息（名称和简介）
export interface PluginTranslation {
  id: string
  translatedName: string  // 中文名
  translatedTag: string   // 中文简介
}

export async function translatePluginInfos(
  plugins: { id: string; name: string; tag: string }[]
): Promise<Map<string, PluginTranslation>> {
  const model = getModelForRole('translate')
  if (!model) throw new Error('未配置翻译模型')

  const results = new Map<string, PluginTranslation>()
  const limiter = getLimiter(model)

  // 并发翻译所有插件
  const promises = plugins.map(async (plugin) => {
    await limiter.acquire()
    try {
      // 组合名称和简介一起翻译，减少 API 调用
      const prompt = `将以下 Minecraft 插件信息翻译成简体中文。
插件名: ${plugin.name}
简介: ${plugin.tag}

请按以下格式输出（只输出翻译结果，不要其他内容）：
名称: [中文名称]
简介: [中文简介]`

      const response = await chatWithModel(model, [
        { role: 'system', content: '你是 Minecraft 插件翻译助手。将插件名称和简介翻译成简体中文。名称翻译要简洁准确，简介翻译要通顺易懂。' },
        { role: 'user', content: prompt },
      ], { temperature: 0.2 })

      // 解析响应
      const nameMatch = response.match(/名称[:：]\s*(.+)/i)
      const tagMatch = response.match(/简介[:：]\s*(.+)/i)

      results.set(plugin.id, {
        id: plugin.id,
        translatedName: nameMatch?.[1]?.trim() || plugin.name,
        translatedTag: tagMatch?.[1]?.trim() || plugin.tag,
      })
    } catch {
      // 翻译失败时保留原文
      results.set(plugin.id, {
        id: plugin.id,
        translatedName: plugin.name,
        translatedTag: plugin.tag,
      })
    } finally {
      limiter.release()
    }
  })

  await Promise.all(promises)
  return results
}

// 文本段落信息
interface TextSegment {
  index: number       // 在原始内容中的位置
  text: string        // 纯文本内容
  original: string    // 原始内容（可能包含 HTML）
  isTranslatable: boolean  // 是否需要翻译
}

// 从 HTML/Markdown 内容中提取可翻译的文本段落
function extractTextSegments(content: string): TextSegment[] {
  const segments: TextSegment[] = []
  
  // 按行分割
  const lines = content.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    
    // 判断是否需要翻译
    let isTranslatable = true
    let textContent = trimmed
    
    // 跳过空行
    if (!trimmed) {
      isTranslatable = false
    }
    // 跳过纯 HTML 标签行
    else if (/^<\/?[a-z][^>]*>$/i.test(trimmed)) {
      isTranslatable = false
    }
    // 跳过图片
    else if (/^<img\s/i.test(trimmed) || /^!\[.*\]\(.*\)$/.test(trimmed)) {
      isTranslatable = false
    }
    // 跳过 SVG 相关
    else if (/<svg|<\/svg|<path|<circle|<rect|<polygon/i.test(trimmed)) {
      isTranslatable = false
    }
    // 跳过代码块
    else if (/^```/.test(trimmed)) {
      isTranslatable = false
    }
    // 跳过纯链接
    else if (/^\[.*\]\(.*\)$/.test(trimmed) || /^<a\s.*<\/a>$/i.test(trimmed)) {
      isTranslatable = false
    }
    // 提取 HTML 中的文本
    else if (/<[^>]+>/.test(trimmed)) {
      textContent = trimmed.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      if (!textContent || textContent.length < 2) {
        isTranslatable = false
      }
    }
    
    segments.push({
      index: i,
      text: textContent,
      original: line,
      isTranslatable,
    })
  }
  
  return segments
}

// 流式翻译文档（使用用户提供的优化提示词）
export async function* translateDocumentStream(
  content: string,
  onProgress?: (progress: number) => void
): AsyncGenerator<{ index: number; translated: string }, void, unknown> {
  const model = getModelForRole('translate')
  if (!model) throw new Error('未配置翻译模型')
  
  const segments = extractTextSegments(content)
  const translatableSegments = segments.filter(s => s.isTranslatable)
  
  if (translatableSegments.length === 0) {
    return
  }
  
  const limiter = getLimiter(model)
  let completed = 0
  const total = translatableSegments.length
  
  // 系统提示词（使用用户提供的优化版本）
  const systemPrompt = `You are a professional 简体中文 native translator who needs to fluently translate text into 简体中文.

## Translation Rules
1. Output only the translated content, without explanations or additional content (such as "Here's the translation:" or "Translation as follows:")
2. The returned translation must maintain exactly the same number of paragraphs and format as the original text
3. If the text contains HTML tags, consider where the tags should be placed in the translation while maintaining fluency
4. For content that should not be translated (such as proper nouns, code, etc.), keep the original text.
5. If input contains %%, use %% in your output, if input has no %%, don't use %% in your output

## OUTPUT FORMAT:
- **Single paragraph input** → Output translation directly (no separators, no extra text)
- **Multi-paragraph input** → Use %% as paragraph separator between translations

## Examples
### Multi-paragraph Input:
Paragraph A
%%
Paragraph B
%%
Paragraph C

### Multi-paragraph Output:
Translation A
%%
Translation B
%%
Translation C

### Single paragraph Input:
Single paragraph content

### Single paragraph Output:
Direct translation without separators`

  // 批量翻译（每批最多 10 个段落，利用 %% 分隔符）
  const batchSize = 10
  
  for (let i = 0; i < translatableSegments.length; i += batchSize) {
    const batch = translatableSegments.slice(i, i + batchSize)
    
    // 组合批次文本
    const batchText = batch.map(s => s.text).join('\n%%\n')
    
    await limiter.acquire()
    try {
      const response = await chatWithModel(model, [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Translate to 简体中文 (output translation only):\n\n${batchText}` },
      ], { temperature: 0.2 })
      
      // 解析响应
      const translations = response.split(/\n?%%\n?/)
      
      // 逐个返回翻译结果
      for (let j = 0; j < batch.length; j++) {
        const segment = batch[j]
        const translated = translations[j]?.trim() || segment.text
        
        // 如果原始内容有 HTML 结构，尝试保留
        let finalTranslated = translated
        if (/<[^>]+>/.test(segment.original)) {
          // 简单替换：用翻译后的文本替换原始 HTML 中的文本内容
          // 这里采用简化策略：如果原始是纯 HTML 包裹的文本，保留 HTML 结构
          const htmlMatch = segment.original.match(/^(\s*<[^>]+>)(.*)(<\/[^>]+>\s*)$/i)
          if (htmlMatch) {
            finalTranslated = `${htmlMatch[1]}${translated}${htmlMatch[3]}`
          }
        }
        
        // 保留 Markdown 格式
        const headingMatch = segment.original.match(/^(#{1,6})\s/)
        if (headingMatch) {
          finalTranslated = `${headingMatch[1]} ${finalTranslated}`
        }
        
        const listMatch = segment.original.match(/^(\s*[-*+]\s|\s*\d+\.\s)/)
        if (listMatch) {
          finalTranslated = `${listMatch[1]}${finalTranslated}`
        }
        
        yield { index: segment.index, translated: finalTranslated }
        
        completed++
        onProgress?.(Math.round((completed / total) * 100))
      }
    } catch (err) {
      // 翻译失败时返回原文
      for (const segment of batch) {
        yield { index: segment.index, translated: segment.original }
        completed++
        onProgress?.(Math.round((completed / total) * 100))
      }
    } finally {
      limiter.release()
    }
  }
}

// 完整翻译文档（返回翻译后的完整内容）
export async function translateDocument(
  content: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const segments = extractTextSegments(content)
  const results = [...segments.map(s => s.original)]
  
  for await (const { index, translated } of translateDocumentStream(content, onProgress)) {
    results[index] = translated
  }
  
  return results.join('\n')
}
