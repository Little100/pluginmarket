import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { ArrowLeft, Upload, Download, FileText, Check, X, Loader2, AlertTriangle, Send, FolderOpen, Image as ImageIcon, Edit2, Gamepad2, Rocket, Bot, Search, Clock, XCircle, CheckCircle, Construction, RefreshCw } from 'lucide-react'
import { chatCompletion, chatCompletionWithTools, chatCompletionStream, ConcurrencyLimitError, type ToolDefinition } from '@/services/ai'
import { useAppStore } from '@/store'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

// 检测 Tauri 环境
const isTauri = '__TAURI__' in window || '__TAURI_INTERNALS__' in window

// 预设类型
type PresetType = 'translate' | 'simple' | 'agent' | null

// 文件状态
interface FileItem {
  file: File
  name: string
  size: number
  status: 'waiting' | 'translating' | 'completed' | 'failed'
  progress: number
  originalContent: string
  translatedContent: string
  error?: string
}

// 预设卡片数据
const presets = [
  {
    id: 'translate' as const,
    icon: FileText,
    title: '汉化配置文件',
    description: '上传服务器配置文件，AI 自动翻译注释为中文。使用 200 并发加速翻译。',
    disabled: false,
  },
  {
    id: 'simple' as const,
    icon: Rocket,
    title: '简单开服',
    description: 'AI 助手引导你从零开始搭建 Minecraft 服务器，自动阅读相关文档。',
    disabled: false,
  },
  {
    id: 'agent' as const,
    icon: Bot,
    title: 'Agent 模式',
    description: 'AI 读取你的服务器本地文件，智能诊断和指导。仅 Tauri 桌面端可用。',
    disabled: !isTauri,
  },
]

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function GuidePage() {
  const [activePreset, setActivePreset] = useState<PresetType>(null)

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-mc-bg to-white dark:from-dark-bg dark:to-dark-card">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activePreset === null ? (
          <PresetSelector onSelect={setActivePreset} />
        ) : (
          <PresetContent preset={activePreset} onBack={() => setActivePreset(null)} />
        )}
      </div>
    </div>
  )
}

// 预设选择界面
function PresetSelector({ onSelect }: { onSelect: (preset: PresetType) => void }) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center justify-center gap-3">
          <Gamepad2 className="w-8 h-8 text-mc-gold" />
          指导开服
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          选择一个预设模式，让 AI 助手帮助你完成 Minecraft 服务器相关任务
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => !preset.disabled && onSelect(preset.id)}
            disabled={preset.disabled}
            className={`
              group relative p-6 rounded-xl border-2 text-left transition-all duration-300
              ${preset.disabled
                ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-60'
                : 'border-mc-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-mc-gold dark:hover:border-mc-gold hover:shadow-lg hover:shadow-mc-gold/10 hover:-translate-y-1 cursor-pointer'
              }
            `}
          >
            <div className="mb-4 text-mc-gold">
              <preset.icon className="w-10 h-10" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${preset.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100 group-hover:text-mc-gold'}`}>
              {preset.title}
            </h3>
            <p className={`text-sm ${preset.disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`}>
              {preset.description}
            </p>
            {preset.disabled && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-500 dark:text-gray-400">
                不可用
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// 预设内容区域
function PresetContent({ preset, onBack }: { preset: PresetType; onBack: () => void }) {
  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-mc-gold dark:hover:text-mc-gold transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回预设选择
      </button>

      {preset === 'translate' && <TranslatePreset />}
      {preset === 'simple' && <SimpleServerPreset />}
      {preset === 'agent' && <AgentPreset />}
    </div>
  )
}

// 占位预设（开发中）
function PlaceholderPreset({ title }: { title: string }) {
  return (
    <div className="text-center py-20">
      <div className="mb-6 flex justify-center">
        <Construction className="w-16 h-16 text-mc-gold" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400">功能开发中...</p>
    </div>
  )
}

// 汉化配置文件预设
function TranslatePreset() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const getModelForRole = useAppStore(s => s.getModelForRole)

  // 处理文件选择
  const handleFiles = useCallback(async (fileList: FileList) => {
    const newFiles: FileItem[] = []
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const content = await file.text()
      newFiles.push({
        file,
        name: file.name,
        size: file.size,
        status: 'waiting',
        progress: 0,
        originalContent: content,
        translatedContent: '',
      })
    }
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  // 拖拽处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  // 移除文件
  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    if (selectedFileIndex === index) {
      setSelectedFileIndex(null)
    } else if (selectedFileIndex !== null && selectedFileIndex > index) {
      setSelectedFileIndex(selectedFileIndex - 1)
    }
  }, [selectedFileIndex])

  // 并发翻译实现
  const translateWithConcurrency = useCallback(async (
    chunks: string[],
    fileIndex: number,
    maxConcurrency: number = 200
  ): Promise<string[]> => {
    const results: string[] = new Array(chunks.length).fill('')
    let completed = 0

    const semaphore = {
      count: 0,
      queue: [] as (() => void)[],
      async acquire() {
        if (this.count < maxConcurrency) {
          this.count++
          return
        }
        await new Promise<void>(resolve => this.queue.push(resolve))
        this.count++
      },
      release() {
        this.count--
        const next = this.queue.shift()
        if (next) next()
      }
    }

    const translateChunk = async (chunk: string): Promise<string> => {
      if (!chunk.trim()) return chunk
      
      // 检查翻译模型是否已配置（在开始翻译前检查，避免无意义的重试）
      const translateModel = getModelForRole('translate')
      if (!translateModel) {
        throw new Error('未配置翻译模型，请在设置中为"翻译"角色分配一个模型')
      }
      if (!translateModel.apiKey) {
        throw new Error(`翻译模型 ${translateModel.name} 未设置 API Key，请在设置中配置`)
      }
      
      try {
        const content = await chatCompletion('translate', [
          {
            role: 'system',
            content: '你是一个专业的 Minecraft 服务器配置文件翻译助手。将配置文件中的英文注释翻译为中文，保持配置项的键值不变，只翻译注释和描述部分。保持原始格式不变，包括缩进和空行。'
          },
          {
            role: 'user',
            content: `将以下 Minecraft 服务器配置文件内容中的英文注释翻译为中文：\n\n${chunk}`
          }
        ], { temperature: 0.3 })
        return content
      } catch (error) {
        console.error('翻译块失败:', error)
        return chunk // API 调用失败时返回原文，不中断整个翻译任务
      }
    }

    await Promise.all(chunks.map(async (chunk, index) => {
      await semaphore.acquire()
      try {
        results[index] = await translateChunk(chunk)
        completed++
        const progress = Math.round((completed / chunks.length) * 100)
        setFiles(prev => prev.map((f, i) => 
          i === fileIndex ? { ...f, progress } : f
        ))
      } finally {
        semaphore.release()
      }
    }))

    return results
  }, [getModelForRole])

  // 将内容分割成块
  const splitIntoChunks = useCallback((content: string, linesPerChunk: number = 15): string[] => {
    const lines = content.split('\n')
    const chunks: string[] = []
    for (let i = 0; i < lines.length; i += linesPerChunk) {
      chunks.push(lines.slice(i, i + linesPerChunk).join('\n'))
    }
    return chunks
  }, [])

  // 开始翻译
  const startTranslation = useCallback(async () => {
    if (files.length === 0 || isTranslating) return
    
    setIsTranslating(true)
    setOverallProgress(0)

    let completedFiles = 0
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.status === 'completed') {
        completedFiles++
        continue
      }

      setFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, status: 'translating', progress: 0 } : f
      ))

      try {
        const chunks = splitIntoChunks(file.originalContent)
        const translatedChunks = await translateWithConcurrency(chunks, i)
        const translatedContent = translatedChunks.join('\n')

        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'completed', progress: 100, translatedContent } : f
        ))
        completedFiles++
      } catch (error) {
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'failed', error: String(error) } : f
        ))
      }

      setOverallProgress(Math.round((completedFiles / files.length) * 100))
    }

    setIsTranslating(false)
  }, [files, isTranslating, splitIntoChunks, translateWithConcurrency])

  // 下载单个文件
  const downloadFile = useCallback((fileItem: FileItem) => {
    const blob = new Blob([fileItem.translatedContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileItem.name.replace(/(\.[^.]+)$/, '_zh$1')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  // 下载全部
  const downloadAll = useCallback(() => {
    files.filter(f => f.status === 'completed').forEach(downloadFile)
  }, [files, downloadFile])

  const completedCount = files.filter(f => f.status === 'completed').length

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center justify-center gap-2">
          <FileText className="w-6 h-6 text-mc-gold" />
          汉化配置文件
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          上传 Minecraft 服务器配置文件，AI 自动将英文注释翻译为中文
        </p>
      </div>

      {/* 文件上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragging
            ? 'border-mc-gold bg-mc-gold/10 dark:bg-mc-gold/5'
            : 'border-gray-300 dark:border-gray-600 hover:border-mc-gold dark:hover:border-mc-gold hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".properties,.yml,.yaml,.json,.toml,.conf,.cfg,.txt"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-mc-gold' : 'text-gray-400'}`} />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          拖拽文件到此处，或点击选择文件
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          支持 .properties, .yml, .yaml, .json, .toml, .conf, .cfg, .txt
        </p>
      </div>

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-mc-border dark:border-dark-border overflow-hidden">
          <div className="p-4 border-b border-mc-border dark:border-dark-border flex items-center justify-between">
            <span className="font-medium text-gray-800 dark:text-gray-100">
              文件列表 ({files.length} 个文件)
            </span>
            <div className="flex items-center gap-3">
              {completedCount > 0 && (
                <button
                  onClick={downloadAll}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下载全部 ({completedCount})
                </button>
              )}
              <button
                onClick={startTranslation}
                disabled={isTranslating || files.every(f => f.status === 'completed')}
                className={`
                  flex items-center gap-2 px-4 py-1.5 text-sm rounded-lg transition-colors
                  ${isTranslating || files.every(f => f.status === 'completed')
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-mc-gold hover:bg-mc-gold-dark text-white'
                  }
                `}
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    翻译中... {overallProgress}%
                  </>
                ) : (
                  '开始翻译'
                )}
              </button>
            </div>
          </div>

          {/* 总进度条 */}
          {isTranslating && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-mc-gold transition-all duration-300 ease-out"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="divide-y divide-mc-border dark:divide-dark-border">
            {files.map((file, index) => (
              <div
                key={index}
                onClick={() => file.status === 'completed' && setSelectedFileIndex(index)}
                className={`
                  flex items-center gap-4 p-4 transition-colors
                  ${file.status === 'completed' ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
                  ${selectedFileIndex === index ? 'bg-mc-gold/10 dark:bg-mc-gold/5' : ''}
                `}
              >
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-gray-100 truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  {file.status === 'translating' && (
                    <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-mc-gold transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  {file.status === 'failed' && file.error && (
                    <p className="text-xs text-red-500 mt-1 truncate">{file.error}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {file.status === 'waiting' && (
                    <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      等待中
                    </span>
                  )}
                  {file.status === 'translating' && (
                    <Loader2 className="w-5 h-5 text-mc-gold animate-spin" />
                  )}
                  {file.status === 'completed' && (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadFile(file) }}
                        className="p-1.5 text-gray-400 hover:text-mc-gold transition-colors"
                        title="下载"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {file.status === 'failed' && (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                  {!isTranslating && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(index) }}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="移除"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 翻译结果预览 */}
      {selectedFileIndex !== null && files[selectedFileIndex]?.status === 'completed' && (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-mc-border dark:border-dark-border overflow-hidden">
          <div className="p-4 border-b border-mc-border dark:border-dark-border flex items-center justify-between">
            <span className="font-medium text-gray-800 dark:text-gray-100">
              翻译结果预览: {files[selectedFileIndex].name}
            </span>
            <button
              onClick={() => setSelectedFileIndex(null)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 max-h-96 overflow-auto">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
              {files[selectedFileIndex].translatedContent}
            </pre>
          </div>
        </div>
      )}

      {/* 免责声明 */}
      {files.some(f => f.status === 'completed') && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            AI 翻译由于模型能力的不同，不保证翻译质量。建议翻译后人工校验。
          </p>
        </div>
      )}
    </div>
  )
}

// 预加载所有文档的 raw 内容 - 使用相对路径
const docModules = import.meta.glob('../assets/docs/**/*.md', { query: '?raw', import: 'default', eager: false })

// 加载文档内容
async function loadDoc(path: string): Promise<string> {
  // 遍历所有模块查找匹配的路径
  for (const [key, loader] of Object.entries(docModules)) {
    if (key.endsWith(path) || key.includes(`/${path}`)) {
      return await loader() as string
    }
  }
  
  return `文档 ${path} 未找到`
}

// 文档索引（提供给 AI 的系统提示中）
const DOC_INDEX = `可用文档列表：
- java/Java环境配置.md — Java 环境安装配置
- java/JVM启动参数.md — JVM 参数优化、Aikar's Flags
- core/服务端选择指南.md — 各类服务端对比选择
- core/paper.md — Paper 服务端
- core/spigot.md — Spigot 服务端
- core/purpur.md — Purpur 服务端
- core/folia.md — Folia 多线程服务端
- core/pufferfish.md — Pufferfish 服务端
- core/leaves.md — Leaves 服务端
- core/forge.md — Forge 模组端
- core/neoforge.md — NeoForge 模组端
- core/fabric.md — Fabric 模组端
- core/quilt.md — Quilt 模组端
- core/mohist.md — Mohist 混合端
- core/catserver.md — CatServer 混合端
- core/arclight.md — Arclight 混合端
- core/banner.md — Banner 混合端
- core/bungeecord.md — BungeeCord 代理端
- core/velocity.md — Velocity 代理端
- core/geyser.md — Geyser 跨平台
- config/权限管理.md — 权限系统配置
- config/世界管理.md — 世界管理
- config/性能优化.md — 性能优化
- network/01-概述与前置知识.md — 网络基础
- network/02-IPv4公网开服.md — IPv4 公网开服
- network/03-IPv6公网开服.md — IPv6 公网开服
- network/04-云服务器开服.md — 云服务器开服
- network/05-域名绑定与安全.md — 域名与安全
- network/FRP内网穿透.md — FRP 内网穿透
- network/P2P联机.md — P2P 联机
- ops/Linux运维.md — Linux 运维
- ops/Windows运维.md — Windows 运维
- ops/备份与恢复.md — 备份恢复
- ops/安全防护.md — 安全防护
- plugins/插件推荐.md — 插件推荐
- plugins/反作弊.md — 反作弊
- mods/模组推荐.md — 模组推荐
- faq/常见问题.md — 常见问题`

// 系统提示
const SYSTEM_PROMPT = `你是一个 Minecraft 开服助手。你的任务是帮助用户从零开始搭建 Minecraft 服务器。

你可以使用 read_docs 工具来阅读开服手册中的文档，获取最新的配置指南和教程。

${DOC_INDEX}

工作流程：
1. 了解用户需求（服务器类型、人数、系统等）
2. 根据需求阅读相关文档
3. 基于文档内容给出详细的步骤指导
4. 回答用户的后续问题

注意：
- 始终基于文档内容回答，不要编造信息
- 给出的步骤要具体、可操作
- 如果用户的问题涉及多个方面，分步骤阅读相关文档
- 使用中文回答`

// Tool 定义
const TOOLS: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'read_docs',
      description: '阅读开服手册中的文档以获取相关信息',
      parameters: {
        type: 'object',
        properties: {
          doc_paths: {
            type: 'array',
            items: { type: 'string' },
            description: '要阅读的文档路径列表'
          }
        },
        required: ['doc_paths']
      }
    }
  }
]

// 聊天消息类型
interface ChatMessageItem {
  id: string
  role: 'user' | 'assistant'
  content: string
  readingDocs?: string[] // AI 正在阅读的文档
  isStreaming?: boolean
}

// 简单开服预设
function SimpleServerPreset() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const darkMode = useAppStore(s => s.darkMode)

  // 自定义代码块渲染组件
  const markdownComponents = useMemo(() => ({
    code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
      const match = /language-(\w+)/.exec(className || '')
      const codeString = String(children).replace(/\n$/, '')
      
      if (!inline && match) {
        return (
          <SyntaxHighlighter
            style={darkMode ? oneDark : oneLight}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: '1em 0',
              borderRadius: '8px',
              fontSize: '0.875em',
            }}
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        )
      }
      
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
  }), [darkMode])

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // 初始化欢迎消息
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是开服助手，我会帮你从零开始搭建 Minecraft 服务器。请告诉我你的需求，比如：想开什么类型的服（插件服/模组服/混合服）？大概多少人？在什么系统上运行？'
    }])
  }, [])

  // 自动调整输入框高度
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px'
    }
  }, [])

  // 处理发送消息
  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessageItem = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // 重置输入框高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // 构建对话历史
    const chatHistory = [...messages, userMessage].map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))

    try {
      // 第一步：调用带 tools 的 AI
      const response = await chatCompletionWithTools(
        'decision',
        [
          { role: 'system', content: SYSTEM_PROMPT },
          ...chatHistory
        ],
        TOOLS
      )

      if (response.toolCalls && response.toolCalls.length > 0) {
        // AI 请求阅读文档
        const toolCall = response.toolCalls[0]
        if (toolCall.name === 'read_docs') {
          const docPaths = toolCall.arguments.doc_paths as string[]
          
          // 添加 AI 消息，显示正在阅读文档
          const aiMessageId = Date.now().toString() + '-ai'
          setMessages(prev => [...prev, {
            id: aiMessageId,
            role: 'assistant',
            content: '',
            readingDocs: docPaths,
            isStreaming: true
          }])

          // 加载文档内容
          const docContents = await Promise.all(
            docPaths.map(async (path) => {
              const content = await loadDoc(path)
              return `=== ${path} ===\n${content}`
            })
          )

          // 构建包含文档内容的消息（将文档内容作为系统消息的一部分）
          const systemWithDocs = `${SYSTEM_PROMPT}\n\n--- 以下是你阅读的文档内容 ---\n\n${docContents.join('\n\n')}`
          const messagesWithDocs = [
            { role: 'system' as const, content: systemWithDocs },
            ...chatHistory
          ]

          // 流式输出最终回答
          let fullContent = ''
          for await (const chunk of chatCompletionStream('decision', messagesWithDocs as { role: 'user' | 'assistant' | 'system'; content: string }[])) {
            fullContent += chunk
            setMessages(prev => prev.map(m =>
              m.id === aiMessageId
                ? { ...m, content: fullContent }
                : m
            ))
          }

          // 完成流式输出
          setMessages(prev => prev.map(m =>
            m.id === aiMessageId
              ? { ...m, isStreaming: false, readingDocs: undefined }
              : m
          ))
        }
      } else {
        // AI 直接回答，使用流式输出
        const aiMessageId = Date.now().toString() + '-ai'
        setMessages(prev => [...prev, {
          id: aiMessageId,
          role: 'assistant',
          content: '',
          isStreaming: true
        }])

        let fullContent = ''
        for await (const chunk of chatCompletionStream('decision', [
          { role: 'system', content: SYSTEM_PROMPT },
          ...chatHistory
        ])) {
          fullContent += chunk
          setMessages(prev => prev.map(m =>
            m.id === aiMessageId
              ? { ...m, content: fullContent }
              : m
          ))
        }

        // 完成流式输出
        setMessages(prev => prev.map(m =>
          m.id === aiMessageId
            ? { ...m, isStreaming: false }
            : m
        ))
      }
    } catch (error) {
      console.error('AI 调用失败:', error)
      const errorMessage = error instanceof ConcurrencyLimitError
        ? error.message
        : `出错了：${error instanceof Error ? error.message : '未知错误'}`
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: errorMessage
      }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])

  // 处理键盘事件
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-dark-card rounded-2xl shadow-lg overflow-hidden">
      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
              }`}
            >
              {/* 文档阅读状态 */}
              {message.readingDocs && message.readingDocs.length > 0 && (
                <div className="mb-3 space-y-1">
                  {message.readingDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span><Search className="w-4 h-4 inline mr-1" />AI 正在阅读《{doc.split('/').pop()?.replace('.md', '')}》文档...</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 消息内容 */}
              {message.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {message.content || (message.isStreaming ? '...' : '')}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              
              {/* 流式输出指示器 */}
              {message.isStreaming && message.content && (
                <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题... (Enter 发送, Shift+Enter 换行)"
            className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mc-gold focus:border-transparent"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-mc-gold hover:bg-mc-gold-dark disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== Agent 模式 ====================

// Tauri API 辅助函数 - 使用 shell 插件执行命令
async function readServerFile(serverPath: string, filePath: string): Promise<string> {
  if (!isTauri) {
    return '错误: 此功能仅在 Tauri 桌面端可用'
  }
  
  const fullPath = `${serverPath}/${filePath}`.replace(/\//g, '\\')
  
  try {
    // 使用 Tauri shell 插件执行 type 命令读取文件
    const { Command } = await import('@tauri-apps/plugin-shell')
    const command = Command.create('cmd', ['/c', 'type', fullPath])
    const output = await command.execute()
    
    if (output.code === 0) {
      return output.stdout
    } else {
      return `无法读取文件: ${filePath} - ${output.stderr || '文件不存在或无法访问'}`
    }
  } catch (e) {
    return `无法读取文件: ${filePath} - ${e}`
  }
}

async function listServerFiles(serverPath: string, dirPath: string): Promise<string[]> {
  if (!isTauri) {
    return ['错误: 此功能仅在 Tauri 桌面端可用']
  }
  
  const fullPath = (dirPath === '.' ? serverPath : `${serverPath}/${dirPath}`).replace(/\//g, '\\')
  
  try {
    // 使用 Tauri shell 插件执行 dir 命令列出目录
    const { Command } = await import('@tauri-apps/plugin-shell')
    const command = Command.create('cmd', ['/c', 'dir', '/b', fullPath])
    const output = await command.execute()
    
    if (output.code === 0) {
      // 解析 dir /b 输出，每行一个文件名
      const files = output.stdout.split('\n').map(f => f.trim()).filter(f => f.length > 0)
      return files.length > 0 ? files : ['(空目录)']
    } else {
      return [`无法列出目录: ${output.stderr || '目录不存在或无法访问'}`]
    }
  } catch (e) {
    return [`无法列出目录: ${e}`]
  }
}

async function selectDirectory(): Promise<string | null> {
  if (!isTauri) {
    // Web 环境下无法选择目录，返回 null 让用户手动输入
    return null
  }
  
  try {
    // 使用 Tauri 2.x plugin-dialog 的正确方式
    const { open } = await import('@tauri-apps/plugin-dialog')
    const result = await open({
      directory: true,
      multiple: false,
      title: '选择 Minecraft 服务器根目录'
    })
    return result as string | null
  } catch (error) {
    console.error('Failed to open directory dialog:', error)
    return null
  }
}

// Agent 系统提示
const AGENT_SYSTEM_PROMPT = `你是一个 Minecraft 服务器运维 Agent。你可以：
1. 阅读开服手册文档获取配置指南
2. 读取用户服务器目录下的配置文件和日志
3. 列出服务器目录结构
4. 分析用户上传的截图

工作流程：
1. 先了解用户的问题
2. 使用 list_server_files 查看服务器目录结构
3. 使用 read_server_file 读取相关配置文件或日志
4. 使用 read_docs 查阅开服手册获取正确配置方法
5. 基于以上信息给出诊断和解决方案

注意：
- 读取文件前先列出目录确认文件存在
- 日志文件可能很大，关注最近的错误信息
- 给出的修改建议要具体到配置项和值
- 使用中文回答

${DOC_INDEX}`

// Agent Tools 定义
const AGENT_TOOLS: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'read_docs',
      description: '阅读开服手册中的文档',
      parameters: {
        type: 'object',
        properties: {
          doc_paths: {
            type: 'array',
            items: { type: 'string' },
            description: '文档路径列表'
          }
        },
        required: ['doc_paths']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_server_file',
      description: '读取用户服务器目录下的文件',
      parameters: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: '相对于服务器根目录的文件路径，如 server.properties、bukkit.yml、logs/latest.log'
          }
        },
        required: ['file_path']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_server_files',
      description: '列出服务器目录下的文件和文件夹',
      parameters: {
        type: 'object',
        properties: {
          dir_path: {
            type: 'string',
            description: "相对于服务器根目录的目录路径，如 '.' 表示根目录，'plugins' 表示插件目录"
          }
        },
        required: ['dir_path']
      }
    }
  }
]

// Tool 操作记录类型
interface ToolOperation {
  type: 'read_docs' | 'read_server_file' | 'list_server_files' | 'analyze_image'
  target: string
  status: 'pending' | 'completed' | 'failed'
}

// 重试数据类型
interface RetryData {
  userMessage: AgentMessageItem
  chatHistory: { role: 'user' | 'assistant' | 'system'; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }[]
}

// Agent 消息类型
interface AgentMessageItem {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: string[] // base64 图片
  readingDocs?: string[]
  readingFiles?: string[]
  listingDir?: string
  analyzingImage?: boolean
  isStreaming?: boolean
  // 新增字段
  error?: string // 错误信息
  retryData?: RetryData // 重试所需数据
  completedOps?: ToolOperation[] // 已完成的操作
}

// Agent 模式预设
function AgentPreset() {
  const [serverPath, setServerPath] = useState('')
  const [isPathConfirmed, setIsPathConfirmed] = useState(false)
  const [pathInput, setPathInput] = useState('')
  const [messages, setMessages] = useState<AgentMessageItem[]>([])
  const [input, setInput] = useState('')
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const darkMode = useAppStore(s => s.darkMode)

  // 自定义代码块渲染组件
  const markdownComponents = useMemo(() => ({
    code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
      const match = /language-(\w+)/.exec(className || '')
      const codeString = String(children).replace(/\n$/, '')
      
      if (!inline && match) {
        return (
          <SyntaxHighlighter
            style={darkMode ? oneDark : oneLight}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: '1em 0',
              borderRadius: '8px',
              fontSize: '0.875em',
            }}
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        )
      }
      
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
  }), [darkMode])

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // 根目录内容缓存（用于注入系统提示）
  const [rootDirContent, setRootDirContent] = useState<string>('')

  // 初始化欢迎消息并获取根目录内容
  useEffect(() => {
    if (isPathConfirmed && messages.length === 0) {
      // 异步获取根目录内容
      const initAgent = async () => {
        let dirContent = ''
        try {
          const files = await listServerFiles(serverPath, '.')
          // 限制最多 30 个条目
          const limitedFiles = files.slice(0, 30)
          
          // 分类文件和文件夹
          const folders: string[] = []
          const regularFiles: string[] = []
          
          for (const file of limitedFiles) {
            // 简单判断：如果没有扩展名或以常见文件夹名结尾，认为是文件夹
            if (!file.includes('.') || file.endsWith('/')) {
              folders.push(file.replace(/\/$/, '') + '/')
            } else {
              regularFiles.push(file)
            }
          }
          
          if (folders.length > 0 || regularFiles.length > 0) {
            dirContent = '服务器根目录内容：\n'
            if (folders.length > 0) {
              dirContent += `文件夹: ${folders.join(', ')}\n`
            }
            if (regularFiles.length > 0) {
              dirContent += `文件: ${regularFiles.join(', ')}`
            }
            if (files.length > 30) {
              dirContent += `\n（共 ${files.length} 个条目，仅显示前 30 个）`
            }
          }
        } catch (e) {
          console.error('获取根目录内容失败:', e)
        }
        
        setRootDirContent(dirContent)
        
        // 构建欢迎消息
        let welcomeContent = `你好！我是服务器运维 Agent。我已连接到你的服务器目录：\n\n\`${serverPath}\`\n\n`
        if (dirContent) {
          welcomeContent += `${dirContent}\n\n`
        }
        welcomeContent += `我可以帮你：\n- 查看服务器文件结构\n- 读取配置文件和日志\n- 查阅开服手册\n- 分析错误截图\n\n请告诉我你遇到了什么问题？`
        
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: welcomeContent
        }])
      }
      
      initAgent()
    }
  }, [isPathConfirmed, serverPath, messages.length])

  // 自动调整输入框高度
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px'
    }
  }, [])

  // 选择目录
  const handleSelectDirectory = useCallback(async () => {
    const dir = await selectDirectory()
    if (dir) {
      setPathInput(dir)
    }
  }, [])

  // 确认路径
  const handleConfirmPath = useCallback(() => {
    if (pathInput.trim()) {
      setServerPath(pathInput.trim())
      setIsPathConfirmed(true)
    }
  }, [pathInput])

  // 修改路径
  const handleEditPath = useCallback(() => {
    setIsPathConfirmed(false)
    setMessages([])
  }, [])

  // 处理图片上传
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        setPendingImages(prev => [...prev, base64])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }, [])

  // 移除待发送图片
  const removePendingImage = useCallback((index: number) => {
    setPendingImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  // 执行 tool call（带状态记录）
  const executeToolCall = useCallback(async (
    toolName: string,
    args: Record<string, unknown>,
    aiMessageId: string
  ): Promise<{ result: string; operation: ToolOperation }> => {
    if (toolName === 'read_docs') {
      const docPaths = args.doc_paths as string[]
      const target = docPaths.map(p => p.split('/').pop()?.replace('.md', '')).join(', ')
      
      // 显示正在读取状态
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId ? { ...m, readingDocs: docPaths } : m
      ))
      
      const contents = await Promise.all(
        docPaths.map(async (path) => {
          const content = await loadDoc(path)
          return `=== ${path} ===\n${content}`
        })
      )
      
      // 记录已完成的操作
      const operation: ToolOperation = { type: 'read_docs', target, status: 'completed' }
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId ? {
          ...m,
          readingDocs: undefined,
          completedOps: [...(m.completedOps || []), operation]
        } : m
      ))
      
      return { result: contents.join('\n\n'), operation }
    }
    
    if (toolName === 'read_server_file') {
      const filePath = args.file_path as string
      
      // 显示正在读取状态
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId ? { ...m, readingFiles: [filePath] } : m
      ))
      
      const content = await readServerFile(serverPath, filePath)
      
      // 记录已完成的操作
      const operation: ToolOperation = { type: 'read_server_file', target: filePath, status: 'completed' }
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId ? {
          ...m,
          readingFiles: undefined,
          completedOps: [...(m.completedOps || []), operation]
        } : m
      ))
      
      // 限制文件内容长度
      if (content.length > 10000) {
        return { result: `=== ${filePath} (截取最后 10000 字符) ===\n${content.slice(-10000)}`, operation }
      }
      return { result: `=== ${filePath} ===\n${content}`, operation }
    }
    
    if (toolName === 'list_server_files') {
      const dirPath = args.dir_path as string
      
      // 显示正在列出状态
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId ? { ...m, listingDir: dirPath } : m
      ))
      
      const files = await listServerFiles(serverPath, dirPath)
      
      // 记录已完成的操作
      const operation: ToolOperation = { type: 'list_server_files', target: dirPath, status: 'completed' }
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId ? {
          ...m,
          listingDir: undefined,
          completedOps: [...(m.completedOps || []), operation]
        } : m
      ))
      
      return { result: `=== 目录 ${dirPath} ===\n${files.join('\n')}`, operation }
    }
    
    return { result: '未知工具', operation: { type: 'read_docs', target: '未知', status: 'failed' } }
  }, [serverPath])

  // 构建消息历史（支持 vision 格式）
  const buildMessageContent = useCallback((msg: AgentMessageItem) => {
    if (msg.images && msg.images.length > 0) {
      const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = []
      if (msg.content) {
        content.push({ type: 'text', text: msg.content })
      }
      msg.images.forEach(img => {
        content.push({ type: 'image_url', image_url: { url: img } })
      })
      return content
    }
    return msg.content
  }, [])

  // 压缩状态
  const [isCompressing, setIsCompressing] = useState(false)

  // 计算消息上下文大小（字符数）
  const calculateContextSize = useCallback((msgs: AgentMessageItem[]): number => {
    return msgs.reduce((total, msg) => {
      let size = msg.content?.length || 0
      // 图片 base64 也计入大小
      if (msg.images) {
        size += msg.images.reduce((sum, img) => sum + img.length, 0)
      }
      return total + size
    }, 0)
  }, [])

  // 压缩对话历史（内部函数，不直接操作 state）
  const compressConversationInternal = useCallback(async (
    currentMessages: AgentMessageItem[]
  ): Promise<{ compressed: AgentMessageItem[]; summary: string }> => {
    // 构建要压缩的对话内容（排除最后 5 条消息）
    const messagesToCompress = currentMessages.slice(0, -5)
    const recentMessages = currentMessages.slice(-5)

    // 构建压缩请求的对话内容
    const conversationText = messagesToCompress.map(m => {
      const role = m.role === 'user' ? '用户' : '助手'
      return `${role}: ${m.content}`
    }).join('\n\n')

    const compressionPrompt = `请将以下对话历史压缩为一个简洁的摘要，保留所有关键信息：
- 用户的服务器路径和配置
- 已经执行过的操作和结果
- 当前正在讨论的问题
- 重要的技术细节和决策

对话历史：
${conversationText}

请直接输出摘要内容，不要添加额外的说明。`

    // 使用决策模型进行压缩
    const summary = await chatCompletion('decision', [
      { role: 'user', content: compressionPrompt }
    ], { temperature: 0.3 })

    // 构建压缩后的消息列表
    const compressedMessages: AgentMessageItem[] = [
      {
        id: Date.now().toString() + '-summary',
        role: 'assistant',
        content: `📋 **对话摘要**\n\n${summary}`
      },
      ...recentMessages
    ]

    return { compressed: compressedMessages, summary }
  }, [])

  // 执行 AI 调用的核心逻辑（支持重试和工具调用循环）
  const executeAICall = useCallback(async (
    userMessage: AgentMessageItem,
    chatHistory: { role: 'user' | 'assistant'; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }[],
    aiMessageId: string,
    systemPromptOverride?: string // 可选的系统提示覆盖（用于注入根目录内容）
  ) => {
    const hasImages = userMessage.images && userMessage.images.length > 0
    const systemPrompt = systemPromptOverride || AGENT_SYSTEM_PROMPT

    // 构建完整的消息历史（用于工具调用循环）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fullMessages: any[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory
    ]

    // 工具调用循环：最多循环 10 次防止无限循环
    const MAX_TOOL_ITERATIONS = 10
    let iteration = 0

    while (iteration < MAX_TOOL_ITERATIONS) {
      iteration++

      // 调用带 tools 的 AI
      const response = await chatCompletionWithTools(
        'decision',
        fullMessages as { role: 'user' | 'assistant' | 'system'; content: string }[],
        AGENT_TOOLS
      )

      if (response.toolCalls && response.toolCalls.length > 0) {
        // AI 请求使用工具
        setMessages(prev => {
          const existing = prev.find(m => m.id === aiMessageId)
          if (existing) {
            return prev.map(m => m.id === aiMessageId ? { ...m, analyzingImage: hasImages, isStreaming: true } : m)
          }
          return [...prev, {
            id: aiMessageId,
            role: 'assistant' as const,
            content: '',
            analyzingImage: hasImages,
            isStreaming: true,
            completedOps: []
          }]
        })

        // 执行所有 tool calls 并收集结果
        const toolResultMessages: { role: 'tool'; tool_call_id: string; content: string }[] = []
        
        // 先添加 assistant 消息（包含 tool_calls，使用 API 返回的真实 id）
        const assistantMessage = {
          role: 'assistant' as const,
          content: response.content || null,
          tool_calls: response.toolCalls.map((tc) => ({
            id: tc.id,
            type: 'function' as const,
            function: {
              name: tc.name,
              arguments: JSON.stringify(tc.arguments)
            }
          }))
        }
        fullMessages.push(assistantMessage)

        // 执行每个工具调用并收集结果
        for (const toolCall of response.toolCalls) {
          const { result } = await executeToolCall(toolCall.name, toolCall.arguments, aiMessageId)
          
          toolResultMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: result
          })
        }

        // 将工具结果添加到消息历史
        fullMessages = [...fullMessages, ...toolResultMessages]

        // 清除进行中的状态提示（保留已完成的操作）
        setMessages(prev => prev.map(m =>
          m.id === aiMessageId
            ? { ...m, readingDocs: undefined, readingFiles: undefined, listingDir: undefined, analyzingImage: undefined }
            : m
        ))

        // 继续循环，让 AI 处理工具结果
        continue
      } else {
        // AI 不再调用工具，准备输出最终回答
        // 使用流式输出最终回答
        setMessages(prev => {
          const existing = prev.find(m => m.id === aiMessageId)
          if (existing) {
            return prev.map(m => m.id === aiMessageId ? { ...m, analyzingImage: hasImages, isStreaming: true } : m)
          }
          return [...prev, {
            id: aiMessageId,
            role: 'assistant' as const,
            content: '',
            analyzingImage: hasImages,
            isStreaming: true
          }]
        })

        let fullContent = ''
        for await (const chunk of chatCompletionStream('decision', fullMessages as { role: 'user' | 'assistant' | 'system'; content: string }[])) {
          fullContent += chunk
          setMessages(prev => prev.map(m =>
            m.id === aiMessageId ? { ...m, content: fullContent } : m
          ))
        }

        setMessages(prev => prev.map(m =>
          m.id === aiMessageId ? { ...m, isStreaming: false, analyzingImage: undefined } : m
        ))

        // 退出循环
        break
      }
    }

    if (iteration >= MAX_TOOL_ITERATIONS) {
      console.warn('Agent 工具调用循环达到最大次数限制')
    }
  }, [executeToolCall])

  // 处理重试
  const handleRetry = useCallback(async (errorMessageId: string, retryData: RetryData) => {
    // 移除错误消息
    setMessages(prev => prev.filter(m => m.id !== errorMessageId))
    setIsLoading(true)

    const aiMessageId = Date.now().toString() + '-ai-retry'

    // 构建带根目录内容的系统提示
    const systemPromptWithContext = rootDirContent
      ? `${AGENT_SYSTEM_PROMPT}\n\n--- 服务器根目录信息 ---\n${rootDirContent}`
      : AGENT_SYSTEM_PROMPT

    try {
      await executeAICall(retryData.userMessage, retryData.chatHistory as { role: 'user' | 'assistant'; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }[], aiMessageId, systemPromptWithContext)
    } catch (error) {
      console.error('AI 调用失败:', error)
      const errorText = error instanceof ConcurrencyLimitError
        ? error.message
        : `出错了：${error instanceof Error ? error.message : '未知错误'}`
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: '',
        error: errorText,
        retryData
      }])
    } finally {
      setIsLoading(false)
    }
  }, [executeAICall, rootDirContent])

  // 处理发送消息
  const handleSend = useCallback(async () => {
    if ((!input.trim() && pendingImages.length === 0) || isLoading || isCompressing) return

    const userMessage: AgentMessageItem = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      images: pendingImages.length > 0 ? [...pendingImages] : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setPendingImages([])
    setIsLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // 检查上下文大小，必要时压缩
    let currentMessages = [...messages, userMessage]
    const contextSize = calculateContextSize(currentMessages)
    
    if (contextSize > 150000) {
      // 需要压缩 - 显示压缩中提示
      setIsCompressing(true)
      const compressingMsgId = Date.now().toString() + '-compressing'
      setMessages(prev => [...prev, {
        id: compressingMsgId,
        role: 'assistant',
        content: '⚙️ 对话上下文较长，正在自动压缩...'
      }])

      try {
        const { compressed } = await compressConversationInternal(currentMessages)
        // 更新消息列表：压缩后的消息 + 压缩完成提示 + 用户消息
        const compressedCompleteMsgId = Date.now().toString() + '-compressed'
        setMessages([
          ...compressed,
          {
            id: compressedCompleteMsgId,
            role: 'assistant',
            content: '✅ 对话已压缩，继续对话'
          },
          userMessage
        ])
        currentMessages = [...compressed, userMessage]
      } catch (error) {
        console.error('压缩对话失败:', error)
        // 压缩失败时移除压缩提示，继续使用原消息
        setMessages(prev => prev.filter(m => m.id !== compressingMsgId))
      } finally {
        setIsCompressing(false)
      }
    }

    const chatHistory = currentMessages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: buildMessageContent(m)
    }))

    const aiMessageId = Date.now().toString() + '-ai'

    // 构建带根目录内容的系统提示
    const systemPromptWithContext = rootDirContent
      ? `${AGENT_SYSTEM_PROMPT}\n\n--- 服务器根目录信息 ---\n${rootDirContent}`
      : AGENT_SYSTEM_PROMPT

    try {
      await executeAICall(userMessage, chatHistory, aiMessageId, systemPromptWithContext)
    } catch (error) {
      console.error('AI 调用失败:', error)
      const errorText = error instanceof ConcurrencyLimitError
        ? error.message
        : `出错了：${error instanceof Error ? error.message : '未知错误'}`
      
      // 保存重试数据
      const retryData: RetryData = { userMessage, chatHistory }
      
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: '',
        error: errorText,
        retryData
      }])
    } finally {
      setIsLoading(false)
    }
  }, [input, pendingImages, isLoading, isCompressing, messages, buildMessageContent, executeAICall, rootDirContent, calculateContextSize, compressConversationInternal])

  // 处理键盘事件
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  // 路径输入界面
  if (!isPathConfirmed) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <Bot className="w-12 h-12 text-mc-gold" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Agent 模式</h2>
            <p className="text-gray-600 dark:text-gray-400">
              请提供你的 Minecraft 服务器根目录路径，AI 将能够读取其中的配置文件和日志来帮助你诊断问题。
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                服务器根目录
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pathInput}
                  onChange={(e) => setPathInput(e.target.value)}
                  placeholder="例如: C:\mc-server 或 /home/mc/server"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mc-gold focus:border-transparent"
                />
                <button
                  onClick={handleSelectDirectory}
                  className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2"
                >
                  <FolderOpen className="w-5 h-5" />
                  浏览
                </button>
              </div>
            </div>

            <button
              onClick={handleConfirmPath}
              disabled={!pathInput.trim()}
              className="w-full py-3 rounded-xl bg-mc-gold hover:bg-mc-gold-dark disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              确认并开始
            </button>
          </div>

          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-1">安全提示</p>
                <p>AI 只能读取你指定目录下的文件，不会修改任何内容。请确保路径正确。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 聊天界面
  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-dark-card rounded-2xl shadow-lg overflow-hidden">
      {/* 路径显示栏 */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <FolderOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">服务器目录:</span>
          <code className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 text-xs">
            {serverPath}
          </code>
        </div>
        <button
          onClick={handleEditPath}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-mc-gold dark:hover:text-mc-gold transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          修改
        </button>
      </div>

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
              }`}
            >
              {/* 已完成的操作 */}
              {message.completedOps && message.completedOps.length > 0 && (
                <div className="mb-3 space-y-1">
                  {message.completedOps.map((op, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {op.type === 'read_docs' && <>已阅读《{op.target}》文档</>}
                        {op.type === 'read_server_file' && <>已读取 {op.target}</>}
                        {op.type === 'list_server_files' && <>已列出 {op.target} 目录</>}
                        {op.type === 'analyze_image' && <>已分析图片</>}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 进行中的状态提示 */}
              {message.readingDocs && message.readingDocs.length > 0 && (
                <div className="mb-3 space-y-1">
                  {message.readingDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span><Search className="w-4 h-4 inline mr-1" />AI 正在阅读《{doc.split('/').pop()?.replace('.md', '')}》文档...</span>
                    </div>
                  ))}
                </div>
              )}
              {message.readingFiles && message.readingFiles.length > 0 && (
                <div className="mb-3 space-y-1">
                  {message.readingFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span><FolderOpen className="w-4 h-4 inline mr-1" />AI 正在读取 {file}...</span>
                    </div>
                  ))}
                </div>
              )}
              {message.listingDir && (
                <div className="mb-3 flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span><FolderOpen className="w-4 h-4 inline mr-1" />AI 正在列出 {message.listingDir} 目录...</span>
                </div>
              )}
              {message.analyzingImage && (
                <div className="mb-3 flex items-center gap-2 text-sm text-pink-600 dark:text-pink-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span><ImageIcon className="w-4 h-4 inline mr-1" />AI 正在分析图片...</span>
                </div>
              )}

              {/* 错误信息和重试按钮 */}
              {message.error && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-700 dark:text-red-300">{message.error}</p>
                      {message.retryData && (
                        <button
                          onClick={() => handleRetry(message.id, message.retryData!)}
                          disabled={isLoading}
                          className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                          重试
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 用户上传的图片 */}
              {message.images && message.images.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {message.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`上传图片 ${idx + 1}`}
                      className="max-w-[200px] max-h-[150px] rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
              
              {/* 消息内容 */}
              {message.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {message.content || (message.isStreaming ? '...' : '')}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              
              {/* 流式输出指示器 */}
              {message.isStreaming && message.content && (
                <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 待发送图片预览 */}
      {pendingImages.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-wrap gap-2">
            {pendingImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt={`待发送图片 ${idx + 1}`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <button
                  onClick={() => removePendingImage(idx)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end gap-3">
          {/* 图片上传按钮 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors"
            title="上传图片"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={handleKeyDown}
            placeholder="描述你的问题... (Enter 发送, Shift+Enter 换行)"
            className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mc-gold focus:border-transparent"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && pendingImages.length === 0) || isLoading}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-mc-gold hover:bg-mc-gold-dark disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
