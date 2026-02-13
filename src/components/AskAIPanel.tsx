import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Bot, Send, Loader2, Trash2, Settings, AlertCircle, X } from 'lucide-react'
import { chatCompletionStream, isAIAvailable, ConcurrencyLimitError } from '@/services/ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AskAIPanelProps {
  isOpen: boolean
  onClose: () => void
  docTitle: string
  docContent: string
  onScrollToHeading?: (headingId: string) => void
}

// 生成标题的 slug（与 DocsPage 中保持一致）
function generateHeadingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function AskAIPanel({ isOpen, onClose, docTitle, docContent, onScrollToHeading }: AskAIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  const navigate = useNavigate()
  const darkMode = useAppStore(state => state.darkMode)
  const isDark = darkMode

  const isAIConfigured = useMemo(() => isAIAvailable('chat'), [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setMessages([])
    setError(null)
    setIsLoading(false)
  }, [docTitle])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading || !isAIConfigured) return

    const userMessage = input.trim()
    setInput('')
    setError(null)
    
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    abortControllerRef.current = new AbortController()

    try {
      const systemPrompt = `你是一个 Minecraft 服务器文档助手。用户正在阅读以下文档，请根据文档内容回答用户的问题。

文档标题：${docTitle}

文档内容：
${docContent}

请用简洁、准确的语言回答问题。如果问题与文档内容无关，请礼貌地告知用户。
如果回答中需要引用文档中的某个章节，可以使用 Markdown 标题格式（如 ## 标题名称）来引用，用户可以点击跳转到对应位置。`

      const chatMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...newMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
      ]

      setMessages([...newMessages, { role: 'assistant', content: '' }])

      let fullResponse = ''
      const stream = chatCompletionStream('chat', chatMessages, { signal: abortControllerRef.current.signal })
      
      for await (const chunk of stream) {
        fullResponse += chunk
        setMessages([...newMessages, { role: 'assistant', content: fullResponse }])
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      
      if (err instanceof ConcurrencyLimitError) {
        setError(`AI 服务繁忙（并发限制：${err.maxConcurrency}），请稍后再试`)
      } else {
        setError(err instanceof Error ? err.message : '发生未知错误')
      }
      setMessages(newMessages)
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleClear = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setMessages([])
    setError(null)
    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleHeadingClick = (headingText: string) => {
    if (onScrollToHeading) {
      const slug = generateHeadingSlug(headingText)
      onScrollToHeading(slug)
    }
  }

  const markdownComponents = useMemo(() => ({
    code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
      const match = /language-(\w+)/.exec(className || '')
      const codeString = String(children).replace(/\n$/, '')
      
      if (!inline && match) {
        return (
          <SyntaxHighlighter
            style={isDark ? oneDark : oneLight}
            language={match[1]}
            PreTag="div"
            customStyle={{ margin: '0.5rem 0', borderRadius: '0.375rem', fontSize: '0.75rem' }}
          >
            {codeString}
          </SyntaxHighlighter>
        )
      }
      
      return (
        <code className={`${className || ''} px-1 py-0.5 rounded text-xs ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`} {...props}>
          {children}
        </code>
      )
    },
    h1({ children }: { children?: React.ReactNode }) {
      const text = String(children)
      return (
        <h1 onClick={() => handleHeadingClick(text)} className="text-lg font-bold mt-3 mb-2 cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors flex items-center gap-1">
          <span className="text-xs">🔗</span>
          {children}
        </h1>
      )
    },
    h2({ children }: { children?: React.ReactNode }) {
      const text = String(children)
      return (
        <h2 onClick={() => handleHeadingClick(text)} className="text-base font-bold mt-2 mb-1 cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors flex items-center gap-1">
          <span className="text-xs">🔗</span>
          {children}
        </h2>
      )
    },
    h3({ children }: { children?: React.ReactNode }) {
      const text = String(children)
      return (
        <h3 onClick={() => handleHeadingClick(text)} className="text-sm font-bold mt-2 mb-1 cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors flex items-center gap-1">
          <span className="text-xs">🔗</span>
          {children}
        </h3>
      )
    },
    p({ children }: { children?: React.ReactNode }) {
      return <p className="my-1 text-sm leading-relaxed">{children}</p>
    },
    ul({ children }: { children?: React.ReactNode }) {
      return <ul className="my-1 ml-4 list-disc text-sm">{children}</ul>
    },
    ol({ children }: { children?: React.ReactNode }) {
      return <ol className="my-1 ml-4 list-decimal text-sm">{children}</ol>
    },
    li({ children }: { children?: React.ReactNode }) {
      return <li className="my-0.5">{children}</li>
    },
    a({ href, children }: { href?: string; children?: React.ReactNode }) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
          {children}
        </a>
      )
    },
    blockquote({ children }: { children?: React.ReactNode }) {
      return (
        <blockquote className={`my-2 pl-3 border-l-2 ${isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'} text-sm italic`}>
          {children}
        </blockquote>
      )
    },
  }), [isDark, handleHeadingClick])

  // 不渲染时返回 null（但保持组件挂载以便动画）
  if (!isOpen) return null

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-card border-l border-mc-border dark:border-dark-border">
      {/* 头部 */}
      <div className="flex-shrink-0 p-3 border-b border-mc-border dark:border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-emerald-600" />
          <span className="font-medium text-gray-800 dark:text-dark-text">AI 助手</span>
          <span className="text-xs text-gray-500 dark:text-dark-text-secondary">- {docTitle}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-dark-text-secondary dark:hover:text-dark-text rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border/50 transition-colors"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-dark-text-secondary dark:hover:text-dark-text rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border/50 transition-colors"
            title="AI 设置"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-dark-text-secondary dark:hover:text-dark-text rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border/50 transition-colors"
            title="关闭面板"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI 未配置提示 */}
      {!isAIConfigured && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
            <p className="text-gray-600 dark:text-dark-text-secondary mb-3">AI 功能需要先配置</p>
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
            >
              前往设置
            </button>
          </div>
        </div>
      )}

      {/* 消息列表 */}
      {isAIConfigured && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-dark-text-secondary py-8">
              <Bot className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">有什么关于这篇文档的问题吗？</p>
              <p className="text-xs mt-1 opacity-70">我可以帮你解答</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-dark-border text-gray-800 dark:text-dark-text'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {msg.content || '思考中...'}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-dark-border rounded-lg px-3 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg px-3 py-2 text-sm">
                {error}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* 输入区域 */}
      {isAIConfigured && (
        <div className="flex-shrink-0 p-3 border-t border-mc-border dark:border-dark-border">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题..."
              className="flex-1 resize-none rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm text-gray-800 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="self-end p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
