import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Heart, ExternalLink, Download, Star, User, MessageSquare, Languages, Loader2, Send, Sparkles, AlertCircle, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import type { PluginBase, Platform, ChatMessage } from '@/types'
import { useAppStore } from '@/store'
import { getSpigetResource, getSpigetResourceDescription } from '@/services/spiget'
import { getHangarProject, getHangarProjectDescription } from '@/services/hangar'
import { getModrinthProject, getModrinthProjectDescription } from '@/services/modrinth'
import { formatDownloads, getPlatformName } from '@/services/search'
import { isAIAvailable, chatCompletionStream, translateDocumentStream, describeImages } from '@/services/ai'
import { PlatformIcon } from '@/components/PlatformIcons'

function ApiKeyWarning({ feature }: { feature: string }) {
  return (
    <div className="p-6 text-center">
      <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
      <h3 className="font-minecraft text-sm text-gray-800 dark:text-dark-text mb-2">需要配置 API Key</h3>
      <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-3">
        {feature}功能需要先在设置中配置 AI 模型的 API Key。
      </p>
      <div className="flex gap-2 justify-center">
        <Link
          to="/settings"
          className="px-4 py-2 bg-mc-green text-white text-xs rounded-lg hover:bg-mc-green-dark transition-colors"
        >
          前往设置
        </Link>
        <a
          href="https://open.bigmodel.cn/"
          target="_blank"
          rel="noopener"
          className="px-4 py-2 border border-mc-border dark:border-dark-border text-xs rounded-lg text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
        >
          获取 API Key
        </a>
      </div>
    </div>
  )
}

export default function PluginDetailPage() {
  const { platform, id, subId } = useParams<{ platform: string; id: string; subId?: string }>()
  const navigate = useNavigate()
  const { isFavorite, addFavorite, removeFavorite, cachePlugin, getCachedPlugin } = useAppStore()

  const [plugin, setPlugin] = useState<PluginBase | null>(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'description' | 'chat' | 'translate'>('description')

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // AI Translate state
  const [translatedDesc, setTranslatedDesc] = useState('')
  const [translating, setTranslating] = useState(false)
  const [translateProgress, setTranslateProgress] = useState(0)

  const fav = plugin ? isFavorite(plugin.id) : false
  const fullId = subId ? `${id}/${subId}` : id

  useEffect(() => {
    if (platform && id) loadPlugin()
  }, [platform, id, subId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  async function loadPlugin() {
    setLoading(true)
    try {
      const cacheId = `${platform}-${fullId}`
      const cached = getCachedPlugin(cacheId)

      let pluginData: PluginBase
      let desc = ''

      if (platform === 'spigot') {
        pluginData = cached || await getSpigetResource(fullId!)
        desc = await getSpigetResourceDescription(fullId!)
      } else if (platform === 'hangar') {
        const owner = id!
        const slug = subId || ''
        pluginData = cached || await getHangarProject(owner, slug)
        desc = await getHangarProjectDescription(owner, slug)
      } else {
        pluginData = cached || await getModrinthProject(fullId!)
        desc = await getModrinthProjectDescription(fullId!)
      }

      setPlugin(pluginData)
      setDescription(desc)
      cachePlugin(pluginData)
    } catch (err) {
      console.error('加载插件详情失败:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleChat() {
    if (!chatInput.trim() || chatLoading || !plugin) return

    const userMsg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setChatLoading(true)

    try {
      const systemContent = `你是一个 Minecraft 插件助手。当前用户正在查看插件「${plugin.name}」。
插件信息：
- 平台: ${getPlatformName(plugin.platform)}
- 作者: ${plugin.author}
- 下载量: ${formatDownloads(plugin.downloads)}
- 分类: ${plugin.categories?.join(', ') || '未知'}

插件描述（部分）：
${description.substring(0, 3000)}

请用中文回答用户关于这个插件的问题。如果用户的问题不够清晰，可以向用户追问。`

      let imageContext = ''
      if (plugin.images && plugin.images.length > 0 && isAIAvailable('vision')) {
        try {
          const descs = await describeImages(plugin.images.slice(0, 3))
          imageContext = '\n\n插件截图描述：\n' + descs.filter(Boolean).map((d, i) => `图${i + 1}: ${d}`).join('\n')
        } catch { /* ignore */ }
      }

      const messages: ChatMessage[] = [
        { role: 'system', content: systemContent + imageContext },
        ...chatMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        { role: 'user', content: userMsg },
      ]

      let fullResponse = ''
      setChatMessages(prev => [...prev, { role: 'assistant', content: '' }])

      for await (const chunk of chatCompletionStream('chat', messages)) {
        fullResponse += chunk
        setChatMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: fullResponse }
          return updated
        })
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: `❌ 错误: ${err.message}` }])
    } finally {
      setChatLoading(false)
    }
  }

  async function handleTranslate() {
    if (translating || !description) return
    setTranslating(true)
    setTranslateProgress(0)
    
    // 初始化翻译结果为原始内容（按行分割）
    const lines = description.split('\n')
    setTranslatedDesc(description)

    try {
      // 使用流式翻译，边翻译边更新显示
      for await (const { index, translated } of translateDocumentStream(description, setTranslateProgress)) {
        // 更新对应行的翻译
        lines[index] = translated
        setTranslatedDesc(lines.join('\n'))
      }
      setTranslateProgress(100)
    } catch (err: any) {
      setTranslatedDesc(`❌ 翻译失败: ${err.message}`)
    } finally {
      setTranslating(false)
      setTranslateProgress(100)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-mc-green" />
        <span className="ml-2 text-gray-500 dark:text-dark-text-secondary">加载中...</span>
      </div>
    )
  }

  if (!plugin) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 dark:text-dark-text-secondary mb-4">插件未找到</p>
        <button onClick={() => navigate(-1)} className="text-mc-green hover:underline">返回</button>
      </div>
    )
  }

  const stars = plugin.rating ? Math.round(plugin.rating) : 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text mb-4">
        <ArrowLeft className="w-4 h-4" /> 返回
      </button>

      {/* Plugin header */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-mc-border dark:border-dark-border p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-dark-border flex items-center justify-center overflow-hidden shrink-0">
            {plugin.icon ? (
              <img src={plugin.icon} alt={plugin.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            ) : (
              <PlatformIcon platform={plugin.platform} size={32} className="text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-minecraft text-xl text-gray-900 dark:text-dark-text mb-1">{plugin.name}</h1>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary mb-2">{plugin.tag}</p>
            <div className="flex items-center gap-4 flex-wrap text-sm">
              {plugin.rating !== undefined && plugin.rating > 0 && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                  ))}
                  <span className="text-gray-500 dark:text-dark-text-secondary ml-1">{plugin.rating.toFixed(1)}</span>
                </div>
              )}
              <span className="flex items-center gap-1 text-gray-500 dark:text-dark-text-secondary">
                <Download className="w-4 h-4" /> {formatDownloads(plugin.downloads)}
              </span>
              <Link
                to={`/author/${plugin.platform}/${plugin.authorId || plugin.author}`}
                className="flex items-center gap-1 text-mc-green hover:underline"
              >
                <User className="w-4 h-4" /> {plugin.author}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fav ? removeFavorite(plugin.id) : addFavorite(plugin)}
              className={`p-2 rounded-lg border transition-colors ${
                fav
                  ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-500'
                  : 'border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border text-gray-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${fav ? 'fill-red-500' : ''}`} />
            </button>
            {plugin.sourceUrl && (
              <a
                href={plugin.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border transition-colors flex items-center gap-1 text-sm text-gray-600 dark:text-dark-text-secondary"
                title="前往下载页面"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
        
        {/* Download button */}
        {plugin.sourceUrl && (
          <div className="mt-4 pt-4 border-t border-mc-border dark:border-dark-border">
            <a
              href={plugin.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-mc-green text-white rounded-lg hover:bg-mc-green-dark transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              前往 {getPlatformName(plugin.platform)} 下载
            </a>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 bg-white dark:bg-dark-card rounded-xl border border-mc-border dark:border-dark-border p-1">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${
            activeTab === 'description' ? 'bg-mc-green/10 dark:bg-mc-green/20 text-mc-green font-medium' : 'text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border/50'
          }`}
        >
          <FileText className="w-4 h-4" /> 描述
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${
            activeTab === 'chat' ? 'bg-mc-green/10 dark:bg-mc-green/20 text-mc-green font-medium' : 'text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border/50'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> AI 对话
        </button>
        <button
          onClick={() => setActiveTab('translate')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${
            activeTab === 'translate' ? 'bg-mc-green/10 dark:bg-mc-green/20 text-mc-green font-medium' : 'text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border/50'
          }`}
        >
          <Languages className="w-4 h-4" /> AI 翻译
        </button>
      </div>

      {/* Tab content */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-mc-border dark:border-dark-border p-6">
        {activeTab === 'description' && (
          <div className="markdown-body dark:text-dark-text prose prose-sm max-w-none dark:prose-invert">
            {/* Spigot 返回的是 HTML，需要直接渲染；其他平台是 Markdown */}
            {platform === 'spigot' ? (
              <div 
                className="spigot-html-content"
                dangerouslySetInnerHTML={{ __html: description || '<p>暂无描述</p>' }} 
              />
            ) : (
              <ReactMarkdown 
                rehypePlugins={[rehypeRaw]} 
                remarkPlugins={[remarkGfm]}
                components={{
                  // 自定义列表渲染
                  ul: ({children}) => <ul className="list-disc pl-5 my-2">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-5 my-2">{children}</ol>,
                  li: ({children}) => <li className="my-1">{children}</li>,
                  // 自定义图片渲染
                  img: ({src, alt}) => (
                    <img src={src} alt={alt || ''} className="max-w-full rounded-lg my-2" loading="lazy" />
                  ),
                  // 自定义链接
                  a: ({href, children}) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-mc-green hover:underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {description || '暂无描述'}
              </ReactMarkdown>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          !isAIAvailable('chat') ? (
            <ApiKeyWarning feature="AI 对话" />
          ) : (
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2">
                {chatMessages.length === 0 && (
                  <div className="text-center py-10 text-gray-400 dark:text-dark-text-secondary">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-mc-green/50" />
                    <p className="text-sm">向 AI 询问关于这个插件的任何问题</p>
                    <p className="text-xs mt-1">例如：这个插件怎么安装？有哪些配置选项？</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-mc-green text-white rounded-br-sm'
                        : 'bg-gray-100 dark:bg-dark-border text-gray-800 dark:text-dark-text rounded-bl-sm'
                    }`}>
                      {msg.content ? (
                        msg.role === 'assistant' ? (
                          <div className="markdown-body prose prose-sm max-w-none dark:prose-invert chat-markdown">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          msg.content
                        )
                      ) : (
                        <span className="flex gap-1">
                          <span className="typing-dot w-2 h-2 bg-current rounded-full"></span>
                          <span className="typing-dot w-2 h-2 bg-current rounded-full"></span>
                          <span className="typing-dot w-2 h-2 bg-current rounded-full"></span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="输入你的问题..."
                  className="flex-1 px-3 py-2 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                  disabled={chatLoading}
                />
                <button
                  onClick={handleChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-4 py-2 bg-mc-green text-white rounded-lg hover:bg-mc-green-dark transition-colors disabled:opacity-50"
                >
                  {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'translate' && (
          !isAIAvailable('translate') ? (
            <ApiKeyWarning feature="AI 翻译" />
          ) : (
            <div>
              {!translatedDesc && !translating && (
                <div className="text-center py-10">
                  <Languages className="w-10 h-10 mx-auto mb-3 text-mc-green/50" />
                  <p className="text-sm text-gray-500 dark:text-dark-text-secondary mb-4">将插件描述翻译成中文</p>
                  <button
                    onClick={handleTranslate}
                    className="px-4 py-2 bg-mc-green text-white rounded-lg hover:bg-mc-green-dark transition-colors text-sm"
                  >
                    开始翻译
                  </button>
                </div>
              )}
              {/* 翻译中或翻译完成后显示内容 */}
              {(translating || translatedDesc) && (
                <div>
                  {/* 进度条 */}
                  {translating && (
                    <div className="mb-4 flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-mc-green" />
                      <span className="text-sm text-gray-500 dark:text-dark-text-secondary">翻译中... {translateProgress}%</span>
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                        <div className="h-full bg-mc-green transition-all" style={{ width: `${translateProgress}%` }} />
                      </div>
                    </div>
                  )}
                  {/* 翻译内容 - 根据平台选择渲染方式 */}
                  <div className="markdown-body dark:text-dark-text prose prose-sm max-w-none dark:prose-invert">
                    {platform === 'spigot' ? (
                      <div 
                        className="spigot-html-content"
                        dangerouslySetInnerHTML={{ __html: translatedDesc || description || '' }} 
                      />
                    ) : (
                      <ReactMarkdown 
                        rehypePlugins={[rehypeRaw]} 
                        remarkPlugins={[remarkGfm]}
                      >
                        {translatedDesc || description || ''}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}
