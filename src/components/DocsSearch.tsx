import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Search, Sparkles, X, Loader2, FileText, ChevronRight } from 'lucide-react'
import { chatCompletionWithTools, isAIAvailable, type ToolDefinition } from '@/services/ai'
import ReactMarkdown from 'react-markdown'

// 生成标题的 slug（与 DocsPage 中保持一致）
function generateHeadingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// 清理 Markdown 标记符号，只保留纯文本
function stripMarkdown(text: string): string {
  return text
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    // 移除行内代码
    .replace(/`([^`]+)`/g, '$1')
    // 移除图片 ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // 移除链接 [text](url)，保留 text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 移除标题标记 #
    .replace(/^#{1,6}\s+/gm, '')
    // 移除粗体 **text** 或 __text__
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    // 移除斜体 *text* 或 _text_
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // 移除删除线 ~~text~~
    .replace(/~~([^~]+)~~/g, '$1')
    // 移除引用标记 >
    .replace(/^>\s*/gm, '')
    // 移除无序列表标记 - 或 *
    .replace(/^[\s]*[-*+]\s+/gm, '')
    // 移除有序列表标记 1.
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // 移除表格分隔符行 |---|---|
    .replace(/^\|[-:\s|]+\|$/gm, '')
    // 移除表格单元格的 | 符号，保留内容
    .replace(/\|/g, ' ')
    // 移除 HTML 标签
    .replace(/<[^>]+>/g, '')
    // 移除多余空白
    .replace(/\s+/g, ' ')
    .trim()
}

// 文档索引映射：主题关键词 → 文档路径
const DOC_INDEX: Record<string, string> = {
  // Java 环境
  'java环境配置': 'java/Java环境配置.md',
  'jdk安装': 'java/Java环境配置.md',
  '环境变量': 'java/Java环境配置.md',
  'jvm参数': 'java/JVM启动参数.md',
  "aikar's flags": 'java/JVM启动参数.md',
  'zgc': 'java/JVM启动参数.md',
  '内存分配': 'java/JVM启动参数.md',
  // 服务端核心
  '服务端选择': 'core/服务端选择指南.md',
  '服务端对比': 'core/服务端选择指南.md',
  'paper': 'core/paper.md',
  '插件端': 'core/paper.md',
  'spigot': 'core/spigot.md',
  'purpur': 'core/purpur.md',
  'folia': 'core/folia.md',
  '多线程': 'core/folia.md',
  'pufferfish': 'core/pufferfish.md',
  'leaves': 'core/leaves.md',
  'forge': 'core/forge.md',
  '模组端': 'core/forge.md',
  'neoforge': 'core/neoforge.md',
  'fabric': 'core/fabric.md',
  'quilt': 'core/quilt.md',
  'mohist': 'core/mohist.md',
  '混合端': 'core/mohist.md',
  'catserver': 'core/catserver.md',
  'arclight': 'core/arclight.md',
  'banner': 'core/banner.md',
  'bungeecord': 'core/bungeecord.md',
  '群组服': 'core/bungeecord.md',
  'velocity': 'core/velocity.md',
  '代理': 'core/velocity.md',
  'geyser': 'core/geyser.md',
  '基岩版': 'core/geyser.md',
  '跨平台': 'core/geyser.md',
  // 配置文件
  'server.properties': 'core/config/server-properties/概述.md',
  'bukkit.yml': 'core/config/bukkit-yml/概述.md',
  'spigot.yml': 'core/config/spigot-yml/概述.md',
  'paper配置': 'core/config/paper-yml/概述.md',
  'purpur.yml': 'core/config/purpur-yml/概述.md',
  '权限': 'config/权限管理.md',
  'luckperms': 'config/权限管理.md',
  '世界管理': 'config/世界管理.md',
  'multiverse': 'config/世界管理.md',
  '性能优化': 'config/性能优化.md',
  'tps': 'config/性能优化.md',
  // 网络
  '联机': 'network/01-概述与前置知识.md',
  '公网': 'network/01-概述与前置知识.md',
  '端口映射': 'network/01-概述与前置知识.md',
  'ipv4': 'network/02-IPv4公网开服.md',
  '公网ip': 'network/02-IPv4公网开服.md',
  'ipv6': 'network/03-IPv6公网开服.md',
  '云服务器': 'network/04-云服务器开服.md',
  '面板服': 'network/04-云服务器开服.md',
  '域名': 'network/05-域名绑定与安全.md',
  'srv': 'network/05-域名绑定与安全.md',
  'frp': 'network/FRP内网穿透.md',
  '内网穿透': 'network/FRP内网穿透.md',
  'sakura': 'network/FRP内网穿透.md',
  'chmlfrp': 'network/FRP内网穿透.md',
  'p2p': 'network/P2P联机.md',
  'opl': 'network/P2P联机.md',
  'openp2p': 'network/P2P联机.md',
  // 运维
  'linux': 'ops/Linux运维.md',
  '运维': 'ops/Linux运维.md',
  'systemd': 'ops/Linux运维.md',
  'windows': 'ops/Windows运维.md',
  'bat': 'ops/Windows运维.md',
  '备份': 'ops/备份与恢复.md',
  '恢复': 'ops/备份与恢复.md',
  '安全': 'ops/安全防护.md',
  '防护': 'ops/安全防护.md',
  'ddos': 'ops/安全防护.md',
  // 插件/模组
  '插件推荐': 'plugins/插件推荐.md',
  'essentialsx': 'plugins/插件推荐.md',
  '反作弊': 'plugins/反作弊.md',
  'anticheat': 'plugins/反作弊.md',
  '模组推荐': 'mods/模组推荐.md',
  // FAQ
  '常见问题': 'faq/常见问题.md',
  'faq': 'faq/常见问题.md',
  '报错': 'faq/常见问题.md',
}

// 生成文档索引描述（供 AI 参考）
const DOC_INDEX_DESC = `可用文档索引（关键词 → 文档路径）：
- Java环境配置、JDK安装、环境变量 → java/Java环境配置.md
- JVM参数、Aikar's Flags、ZGC、内存分配 → java/JVM启动参数.md
- 服务端选择、对比 → core/服务端选择指南.md
- Paper、插件端 → core/paper.md
- Spigot → core/spigot.md
- Purpur → core/purpur.md
- Folia、多线程 → core/folia.md
- Pufferfish → core/pufferfish.md
- Leaves → core/leaves.md
- Forge、模组端 → core/forge.md
- NeoForge → core/neoforge.md
- Fabric → core/fabric.md
- Quilt → core/quilt.md
- Mohist、混合端 → core/mohist.md
- CatServer → core/catserver.md
- Arclight → core/arclight.md
- Banner → core/banner.md
- BungeeCord、群组服 → core/bungeecord.md
- Velocity、代理 → core/velocity.md
- Geyser、基岩版、跨平台 → core/geyser.md
- server.properties → core/config/server-properties/概述.md
- bukkit.yml → core/config/bukkit-yml/概述.md
- spigot.yml → core/config/spigot-yml/概述.md
- paper配置 → core/config/paper-yml/概述.md
- purpur.yml → core/config/purpur-yml/概述.md
- 权限、LuckPerms → config/权限管理.md
- 世界管理、Multiverse → config/世界管理.md
- 性能优化、TPS → config/性能优化.md
- 联机、公网、端口映射 → network/01-概述与前置知识.md
- IPv4、公网IP → network/02-IPv4公网开服.md
- IPv6 → network/03-IPv6公网开服.md
- 云服务器、面板服 → network/04-云服务器开服.md
- 域名、SRV、安全 → network/05-域名绑定与安全.md
- FRP、内网穿透、Sakura、ChmlFRP → network/FRP内网穿透.md
- P2P、OPL、OpenP2P、联机 → network/P2P联机.md
- Linux、运维、systemd → ops/Linux运维.md
- Windows、运维、bat → ops/Windows运维.md
- 备份、恢复 → ops/备份与恢复.md
- 安全、防护、DDoS → ops/安全防护.md
- 插件推荐、EssentialsX → plugins/插件推荐.md
- 反作弊、AntiCheat → plugins/反作弊.md
- 模组推荐 → mods/模组推荐.md
- 常见问题、FAQ、报错 → faq/常见问题.md`

// search_docs 工具定义
const SEARCH_DOCS_TOOL: ToolDefinition = {
  type: 'function',
  function: {
    name: 'search_docs',
    description: '根据用户问题搜索相关文档',
    parameters: {
      type: 'object',
      properties: {
        results: {
          type: 'array',
          description: '相关文档列表，按相关度排序，最多5个',
          items: {
            type: 'object',
            properties: {
              doc_path: { type: 'string', description: '文档路径，如 core/paper.md' },
              relevance: { type: 'string', description: '相关原因简述' }
            }
          }
        },
        summary: {
          type: 'string',
          description: '对用户问题的简短回答（1-2句话）'
        }
      },
      required: ['results', 'summary']
    }
  }
}

// 搜索结果接口
interface SearchResult {
  id: string
  title: string
  path: string[]
  snippet: string
  score: number
}

// AI 搜索结果接口
interface AISearchResult {
  answer: string
  recommendedDocs: { id: string; title: string; reason: string }[]
}

interface DocsSearchProps {
  onSelectDoc: (docId: string) => void
  getAllDocs: () => { id: string; title: string; content: string; path: string[] }[]
  onScrollToHeading?: (headingId: string) => void
}

// 防抖 hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function DocsSearch({ onSelectDoc, getAllDocs, onScrollToHeading }: DocsSearchProps) {
  const [query, setQuery] = useState('')
  const [isAIMode, setIsAIMode] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [aiResult, setAIResult] = useState<AISearchResult | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const debouncedQuery = useDebounce(query, 300)

  // 检查 AI 是否已配置（使用 'search' 角色）
  const isAIConfigured = useMemo(() => {
    return isAIAvailable('search')
  }, [])

  // 普通搜索逻辑
  const performNormalSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const allDocs = getAllDocs()
    const queryLower = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    for (const doc of allDocs) {
      const titleMatch = doc.title.toLowerCase().includes(queryLower)
      const contentLower = doc.content.toLowerCase()
      const contentMatch = contentLower.includes(queryLower)

      if (titleMatch || contentMatch) {
        let snippet = ''
        let score = 0

        if (titleMatch) {
          score += 10
        }

        if (contentMatch) {
          const index = contentLower.indexOf(queryLower)
          const start = Math.max(0, index - 50)
          const end = Math.min(doc.content.length, index + queryLower.length + 100)
          const rawSnippet = doc.content.slice(start, end).replace(/\n/g, ' ')
          snippet = (start > 0 ? '...' : '') +
                   stripMarkdown(rawSnippet) +
                   (end < doc.content.length ? '...' : '')
          score += 5
          
          // 计算匹配次数
          const matches = (contentLower.match(new RegExp(queryLower, 'g')) || []).length
          score += matches
        }

        results.push({
          id: doc.id,
          title: doc.title,
          path: doc.path,
          snippet,
          score
        })
      }
    }

    // 按分数排序
    results.sort((a, b) => b.score - a.score)
    setSearchResults(results.slice(0, 10))
  }, [getAllDocs])

  // AI 搜索逻辑（使用 tool_call）
  const performAISearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || !isAIConfigured) return

    setIsSearching(true)
    setError(null)
    setAIResult(null)

    try {
      const allDocs = getAllDocs()
      
      // 使用精简的文档索引，而不是完整文档列表
      const prompt = `你是一个 Minecraft 服务器文档助手。用户正在搜索相关文档。

${DOC_INDEX_DESC}

用户问题：${searchQuery}

请调用 search_docs 工具，返回最相关的文档（最多5个）和简短回答。`

      const result = await chatCompletionWithTools(
        'search',
        [{ role: 'user', content: prompt }],
        [SEARCH_DOCS_TOOL],
        { toolChoice: { type: 'function', function: { name: 'search_docs' } } }
      )

      // 解析 tool_call 结果
      if (result.toolCalls && result.toolCalls.length > 0) {
        const toolResult = result.toolCalls[0].arguments as {
          results?: { doc_path: string; relevance: string }[]
          summary?: string
        }
        
        // 匹配文档 ID
        const recommendedDocs = (toolResult.results || []).map(rec => {
          // 通过路径匹配文档
          const doc = allDocs.find(d => {
            const docPath = d.path.join('/') + '/' + d.title
            return docPath.toLowerCase().includes(rec.doc_path.toLowerCase().replace('.md', '')) ||
                   rec.doc_path.toLowerCase().includes(d.title.toLowerCase())
          })
          // 也尝试通过索引映射匹配
          if (!doc) {
            const indexPath = Object.entries(DOC_INDEX).find(([, path]) =>
              path.toLowerCase() === rec.doc_path.toLowerCase()
            )
            if (indexPath) {
              const matchedDoc = allDocs.find(d =>
                d.id.toLowerCase().includes(indexPath[0]) ||
                d.title.toLowerCase().includes(indexPath[0])
              )
              if (matchedDoc) {
                return {
                  id: matchedDoc.id,
                  title: matchedDoc.title,
                  reason: rec.relevance
                }
              }
            }
          }
          return {
            id: doc?.id || '',
            title: doc?.title || rec.doc_path,
            reason: rec.relevance
          }
        }).filter(r => r.id)

        setAIResult({
          answer: toolResult.summary || '请查看推荐的文档',
          recommendedDocs
        })
      } else {
        setError('AI 未返回有效结果')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 搜索失败')
    } finally {
      setIsSearching(false)
    }
  }, [getAllDocs, isAIConfigured])

  // 监听防抖后的查询变化（普通搜索）
  useEffect(() => {
    if (!isAIMode && debouncedQuery) {
      performNormalSearch(debouncedQuery)
      setShowResults(true)
    } else if (!debouncedQuery) {
      setSearchResults([])
      setShowResults(false)
    }
  }, [debouncedQuery, isAIMode, performNormalSearch])

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isAIMode && query.trim()) {
      performAISearch(query)
      setShowResults(true)
    }
    if (e.key === 'Escape') {
      setShowResults(false)
      inputRef.current?.blur()
    }
  }

  // 点击外部关闭结果
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 选择搜索结果
  const handleSelectResult = (docId: string) => {
    onSelectDoc(docId)
    setShowResults(false)
    setQuery('')
  }

  // 清空搜索
  const handleClear = () => {
    setQuery('')
    setSearchResults([])
    setAIResult(null)
    setShowResults(false)
    setError(null)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto mb-6">
      {/* 搜索框 */}
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-700 focus-within:border-blue-500 transition-colors">
        <div className="flex items-center pl-3">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowResults(true)}
          placeholder={isAIMode ? "输入问题后按回车进行 AI 搜索..." : "搜索文档..."}
          className="flex-1 bg-transparent py-3 text-gray-900 dark:text-white placeholder-gray-500 outline-none"
        />

        {query && (
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* AI 模式切换按钮 */}
        <button
          onClick={() => {
            setIsAIMode(!isAIMode)
            setSearchResults([])
            setAIResult(null)
            setError(null)
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 mr-2 rounded-md text-sm font-medium transition-all ${
            isAIMode
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          title={isAIConfigured ? '切换 AI 搜索' : 'AI 未配置，请先在设置中配置'}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI</span>
        </button>
      </div>

      {/* AI 未配置提示 */}
      {isAIMode && !isAIConfigured && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-400 dark:border-yellow-700 rounded-lg text-yellow-800 dark:text-yellow-200 text-sm">
          ⚠️ AI 功能需要先配置。请前往设置页面配置 AI 服务。
        </div>
      )}

      {/* 搜索结果 */}
      {showResults && (searchResults.length > 0 || aiResult || error) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto dropdown-animate">
          {/* 错误提示 */}
          {error && (
            <div className="p-4 text-red-600 dark:text-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          {/* AI 搜索结果 */}
          {aiResult && (
            <div className="p-4">
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg border border-purple-300 dark:border-purple-700/50">
                <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-300 text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  AI 回答
                </div>
                <div className="text-gray-800 dark:text-gray-200 prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => {
                        const text = String(children)
                        return (
                          <h1
                            onClick={() => onScrollToHeading?.(generateHeadingSlug(text))}
                            className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors flex items-center gap-1"
                          >
                            <span className="text-xs">🔗</span>
                            {children}
                          </h1>
                        )
                      },
                      h2: ({ children }) => {
                        const text = String(children)
                        return (
                          <h2
                            onClick={() => onScrollToHeading?.(generateHeadingSlug(text))}
                            className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors flex items-center gap-1"
                          >
                            <span className="text-xs">🔗</span>
                            {children}
                          </h2>
                        )
                      },
                      h3: ({ children }) => {
                        const text = String(children)
                        return (
                          <h3
                            onClick={() => onScrollToHeading?.(generateHeadingSlug(text))}
                            className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors flex items-center gap-1"
                          >
                            <span className="text-xs">🔗</span>
                            {children}
                          </h3>
                        )
                      },
                    }}
                  >
                    {aiResult.answer}
                  </ReactMarkdown>
                </div>
              </div>

              {aiResult.recommendedDocs.length > 0 && (
                <div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">推荐文档：</div>
                  {aiResult.recommendedDocs.map((doc, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectResult(doc.id)}
                      className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors mb-1"
                    >
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                        <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        {doc.title}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 pl-6">
                        {doc.reason}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 普通搜索结果 */}
          {!isAIMode && searchResults.length > 0 && (
            <div className="py-2">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result.id)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors search-result-item"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white font-medium">{result.title}</span>
                  </div>
                  {result.path.length > 0 && (
                    <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs mt-1 pl-6">
                      {result.path.map((p, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {i > 0 && <ChevronRight className="w-3 h-3" />}
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                  {result.snippet && (
                    <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 pl-6 line-clamp-2">
                      {result.snippet}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 无结果提示 */}
          {!isAIMode && searchResults.length === 0 && query && !isSearching && (
            <div className="p-4 text-gray-500 dark:text-gray-400 text-center">
              未找到匹配的文档
            </div>
          )}
        </div>
      )}
    </div>
  )
}
