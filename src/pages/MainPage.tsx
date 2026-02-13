import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, TrendingUp, Sparkles, ChevronDown, ChevronRight, Filter, RefreshCw, Languages, AlertCircle } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import PlatformToggle from '@/components/PlatformToggle'
import PluginCard from '@/components/PluginCard'
import { useAppStore } from '@/store'
import { searchAll } from '@/services/search'
import { getSpigetPopularResources } from '@/services/spiget'
import { getHangarPopular } from '@/services/hangar'
import { getModrinthPopular } from '@/services/modrinth'
import { isAIAvailable, translatePluginInfos, type PluginTranslation } from '@/services/ai'
import type { PluginBase } from '@/types'

// 中文分类
const categories = [
  { id: 'all', label: '全部' },
  { id: 'gameplay', label: '游戏玩法' },
  { id: 'admin', label: '管理工具' },
  { id: 'chat', label: '聊天社交' },
  { id: 'economy', label: '经济系统' },
  { id: 'protection', label: '领地保护' },
  { id: 'world', label: '世界生成' },
  { id: 'teleport', label: '传送系统' },
  { id: 'pvp', label: 'PvP 战斗' },
  { id: 'minigame', label: '小游戏' },
  { id: 'utility', label: '实用工具' },
  { id: 'api', label: 'API/库' },
  { id: 'cosmetic', label: '装饰美化' },
  { id: 'npc', label: 'NPC 系统' },
  { id: 'quest', label: '任务系统' },
  { id: 'skill', label: '技能/职业' },
]

// 服务端类型
const serverTypes = [
  { id: 'all', label: '全部服务端' },
  { id: 'paper', label: 'Paper' },
  { id: 'spigot', label: 'Spigot' },
  { id: 'bukkit', label: 'Bukkit' },
  { id: 'folia', label: 'Folia' },
  { id: 'velocity', label: 'Velocity' },
  { id: 'bungeecord', label: 'BungeeCord' },
  { id: 'waterfall', label: 'Waterfall' },
  { id: 'fabric', label: 'Fabric' },
  { id: 'forge', label: 'Forge' },
  { id: 'sponge', label: 'Sponge' },
]

// 排序方式
const sortOptions = [
  { id: 'popular', label: '最热门' },
  { id: 'newest', label: '最新发布' },
  { id: 'updated', label: '最近更新' },
  { id: 'downloads', label: '下载量' },
  { id: 'rating', label: '评分最高' },
]

// 下载量筛选
const downloadFilters = [
  { id: 'all', label: '不限' },
  { id: '1000', label: '1,000+' },
  { id: '10000', label: '10,000+' },
  { id: '50000', label: '50,000+' },
  { id: '100000', label: '100,000+' },
]

export default function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { enabledPlatforms } = useAppStore()
  
  // 搜索模式：false = 首页热门，true = 搜索结果
  const [isSearchMode, setIsSearchMode] = useState(!!query)
  const [plugins, setPlugins] = useState<PluginBase[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  
  // 筛选状态
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedServer, setSelectedServer] = useState('all')
  const [selectedSort, setSelectedSort] = useState('popular')
  const [selectedDownloads, setSelectedDownloads] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // 折叠状态
  const [serverCollapsed, setServerCollapsed] = useState(true)
  const [downloadsCollapsed, setDownloadsCollapsed] = useState(false)
  const [sortCollapsed, setSortCollapsed] = useState(true)
  
  // AI 翻译
  const [translations, setTranslations] = useState<Map<string, PluginTranslation>>(new Map())
  const [translating, setTranslating] = useState(false)
  const [translateEnabled, setTranslateEnabled] = useState(false)
  
  // 随机刷新
  const [randomPage, setRandomPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)

  // 加载热门插件
  const loadPopular = useCallback(async () => {
    setLoading(true)
    try {
      const results: PluginBase[] = []
      const promises: Promise<void>[] = []
      const p = randomPage

      if (enabledPlatforms.includes('spigot')) {
        promises.push(getSpigetPopularResources(p, 10).then(r => results.push(...r)).catch(() => {}))
      }
      if (enabledPlatforms.includes('hangar')) {
        promises.push(getHangarPopular((p - 1) * 10, 10).then(r => results.push(...r)).catch(() => {}))
      }
      if (enabledPlatforms.includes('modrinth')) {
        promises.push(getModrinthPopular((p - 1) * 10, 10).then(r => results.push(...r)).catch(() => {}))
      }

      await Promise.all(promises)
      results.sort((a, b) => b.downloads - a.downloads)
      setPlugins(results)
      
      if (translateEnabled && isAIAvailable('translate')) {
        translatePlugins(results)
      }
    } catch (err) {
      console.error('加载热门插件失败:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [enabledPlatforms, randomPage, translateEnabled])

  // 搜索插件
  async function doSearch(q: string, p = 1) {
    setLoading(true)
    try {
      const results = await searchAll(q, p, 12)
      if (p === 1) setPlugins(results)
      else setPlugins(prev => [...prev, ...results])
      setPage(p)
    } catch (err) {
      console.error('搜索失败:', err)
    } finally {
      setLoading(false)
    }
  }

  // 处理搜索
  const handleSearch = (q: string) => {
    if (!q.trim()) {
      setSearchParams({})
      setIsSearchMode(false)
      return
    }
    setSearchParams({ q })
    setIsSearchMode(true)
    setPlugins([])
    doSearch(q, 1)
  }

  // 随机刷新
  function handleRandomRefresh() {
    setRefreshing(true)
    setRandomPage(Math.floor(Math.random() * 10) + 1)
  }

  // 翻译插件
  async function translatePlugins(pluginsToTranslate: PluginBase[]) {
    if (!isAIAvailable('translate') || translating) return
    setTranslating(true)
    try {
      const pluginInfos = pluginsToTranslate.map(p => ({ id: p.id, name: p.name, tag: p.tag }))
      const newTranslations = await translatePluginInfos(pluginInfos)
      setTranslations(prev => {
        const merged = new Map(prev)
        newTranslations.forEach((v, k) => merged.set(k, v))
        return merged
      })
    } catch (err) {
      console.error('翻译失败:', err)
    } finally {
      setTranslating(false)
    }
  }

  function toggleTranslate() {
    if (!translateEnabled) {
      setTranslateEnabled(true)
      if (plugins.length > 0 && isAIAvailable('translate')) {
        translatePlugins(plugins)
      }
    } else {
      setTranslateEnabled(false)
    }
  }

  function getDisplayInfo(plugin: PluginBase) {
    if (translateEnabled && translations.has(plugin.id)) {
      const t = translations.get(plugin.id)!
      return { displayName: `${plugin.name} — ${t.translatedName}`, displayTag: t.translatedTag }
    }
    return { displayName: plugin.name, displayTag: plugin.tag }
  }

  // 过滤插件
  const filteredPlugins = plugins.filter(p => {
    if (selectedDownloads !== 'all' && p.downloads < parseInt(selectedDownloads)) return false
    return true
  })

  // 初始化和监听
  useEffect(() => {
    if (query) {
      setIsSearchMode(true)
      doSearch(query)
    } else {
      setIsSearchMode(false)
      loadPopular()
    }
  }, [query])

  useEffect(() => {
    if (!isSearchMode) {
      loadPopular()
    }
  }, [enabledPlatforms, randomPage])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero 区域 - 搜索模式时收起，使用 grid 实现平滑高度动画 */}
      <div
        className={`grid transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isSearchMode ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
        }`}
      >
        <div className="overflow-hidden">
          <div className={`text-center pb-8 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isSearchMode ? '-translate-y-4' : 'translate-y-0'
          }`}>
            <h1 className="font-minecraft text-3xl md:text-4xl text-gray-800 dark:text-dark-text mb-3">
              MC 插件市场
            </h1>
            <p className="text-gray-500 dark:text-dark-text-secondary text-sm">
              聚合 Spigot · Hangar · Modrinth 三大平台，一站搜索 Minecraft 插件
            </p>
          </div>
        </div>
      </div>

      {/* 搜索框区域 - 平滑位置和宽度过渡 */}
      <div
        className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] relative z-20 ${
          isSearchMode
            ? 'max-w-full mb-6 transform-gpu'
            : 'max-w-2xl mx-auto mb-4 transform-gpu'
        }`}
        style={{
          transitionProperty: 'max-width, margin, margin-bottom, transform',
        }}
      >
        <SearchBar onSearch={handleSearch} initialQuery={query} />
      </div>

      {/* 平台切换 - 平滑过渡 */}
      <div
        className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isSearchMode ? 'mb-4' : 'flex justify-center mb-8'
        }`}
      >
        <PlatformToggle />
      </div>

      {/* 移动端筛选按钮 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 bg-white dark:bg-dark-card border border-mc-border dark:border-dark-border rounded-lg text-sm text-gray-700 dark:text-dark-text"
      >
        <Filter className="w-4 h-4" />
        筛选条件
        <ChevronDown className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className="flex gap-6">
        {/* 侧边栏 - 平滑滑入 */}
        <aside
          className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-56 flex-shrink-0 transition-all duration-500 ${
            isSearchMode ? 'opacity-100 translate-x-0' : 'md:opacity-0 md:-translate-x-4 md:pointer-events-none md:absolute'
          }`}
          style={{ transitionDelay: isSearchMode ? '200ms' : '0ms' }}
        >
          <div className="bg-white dark:bg-dark-card rounded-xl border border-mc-border dark:border-dark-border p-4 sticky top-20 space-y-5 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <h3 className="font-minecraft text-sm font-medium flex items-center gap-1 text-gray-800 dark:text-dark-text">
              <Filter className="w-4 h-4" />
              筛选
            </h3>

            {/* 分类 */}
            <div>
              <h4 className="font-minecraft text-xs text-gray-500 dark:text-dark-text-secondary mb-2 uppercase tracking-wider">分类</h4>
              <div className="space-y-0.5">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-mc-green/10 dark:bg-mc-green/20 text-mc-green font-medium'
                        : 'text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 服务端 - 可折叠 */}
            <div>
              <button
                onClick={() => setServerCollapsed(!serverCollapsed)}
                className="w-full flex items-center justify-between font-minecraft text-xs text-gray-500 dark:text-dark-text-secondary mb-2 uppercase tracking-wider hover:text-gray-700 dark:hover:text-dark-text transition-colors"
              >
                <span>服务端</span>
                <ChevronRight className={`w-3.5 h-3.5 collapse-arrow ${!serverCollapsed ? 'expanded' : ''}`} />
              </button>
              <div className={`collapsible-content ${!serverCollapsed ? 'expanded' : ''}`}>
                <div>
                  <div className="space-y-0.5">
                    {serverTypes.map(st => (
                      <button
                        key={st.id}
                        onClick={() => setSelectedServer(st.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                          selectedServer === st.id
                            ? 'bg-mc-green/10 dark:bg-mc-green/20 text-mc-green font-medium'
                            : 'text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border/50'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 下载量 - 可折叠 */}
            <div>
              <button
                onClick={() => setDownloadsCollapsed(!downloadsCollapsed)}
                className="w-full flex items-center justify-between font-minecraft text-xs text-gray-500 dark:text-dark-text-secondary mb-2 uppercase tracking-wider hover:text-gray-700 dark:hover:text-dark-text transition-colors"
              >
                <span>最低下载量</span>
                <ChevronRight className={`w-3.5 h-3.5 collapse-arrow ${!downloadsCollapsed ? 'expanded' : ''}`} />
              </button>
              <div className={`collapsible-content ${!downloadsCollapsed ? 'expanded' : ''}`}>
                <div>
                  <div className="space-y-0.5">
                    {downloadFilters.map(df => (
                      <button
                        key={df.id}
                        onClick={() => setSelectedDownloads(df.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                          selectedDownloads === df.id
                            ? 'bg-mc-green/10 dark:bg-mc-green/20 text-mc-green font-medium'
                            : 'text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border/50'
                        }`}
                      >
                        {df.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 排序 - 可折叠 */}
            <div>
              <button
                onClick={() => setSortCollapsed(!sortCollapsed)}
                className="w-full flex items-center justify-between font-minecraft text-xs text-gray-500 dark:text-dark-text-secondary mb-2 uppercase tracking-wider hover:text-gray-700 dark:hover:text-dark-text transition-colors"
              >
                <span>排序方式</span>
                <ChevronRight className={`w-3.5 h-3.5 collapse-arrow ${!sortCollapsed ? 'expanded' : ''}`} />
              </button>
              <div className={`collapsible-content ${!sortCollapsed ? 'expanded' : ''}`}>
                <div>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md text-xs border border-mc-border dark:border-dark-border bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                  >
                    {sortOptions.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* 主内容区域 */}
        <div
          className={`flex-1 min-w-0 transition-all duration-500 ease-out ${
            isSearchMode ? '' : 'md:w-full'
          }`}
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-mc-green" />
              <h2 className="font-minecraft text-lg text-gray-800 dark:text-dark-text">
                {isSearchMode ? `搜索 "${query}" 的结果` : '热门插件'}
              </h2>
              <span className="text-xs text-gray-400 dark:text-dark-text-secondary">
                {filteredPlugins.length} 个结果
              </span>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex items-center gap-2">
              {isAIAvailable('translate') ? (
                <button
                  onClick={toggleTranslate}
                  disabled={translating}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors btn-press ${
                    translateEnabled
                      ? 'bg-mc-green text-white'
                      : 'bg-white dark:bg-dark-card border border-mc-border dark:border-dark-border text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border'
                  }`}
                >
                  {translating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
                  AI 翻译
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-dark-border text-gray-400 dark:text-dark-text-secondary cursor-not-allowed"
                  title="需要配置 API Key"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  AI 翻译
                </button>
              )}
              
              {!isSearchMode && (
                <button
                  onClick={handleRandomRefresh}
                  disabled={refreshing || loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-dark-card border border-mc-border dark:border-dark-border text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border transition-colors disabled:opacity-50 btn-press"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                  换一批
                </button>
              )}
            </div>
          </div>

          {/* 插件列表 */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-mc-green loading-pulse" />
              <span className="ml-3 text-gray-500 dark:text-dark-text-secondary">
                {isSearchMode ? '搜索中...' : '加载中...'}
              </span>
            </div>
          ) : filteredPlugins.length === 0 ? (
            <div className="text-center py-20 text-gray-400 dark:text-dark-text-secondary">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{isSearchMode ? '未找到相关插件，试试其他关键词' : '暂无插件数据'}</p>
              <p className="text-xs mt-1">{isSearchMode ? '' : '请检查平台开关或网络连接'}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlugins.map((plugin, index) => {
                  const { displayName, displayTag } = getDisplayInfo(plugin)
                  return (
                    <div
                      key={plugin.id}
                      className="stagger-item"
                      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
                    >
                      <PluginCard
                        plugin={{
                          ...plugin,
                          name: displayName,
                          tag: displayTag,
                        }}
                      />
                    </div>
                  )
                })}
              </div>

              {/* 加载更多按钮 - 仅搜索模式 */}
              {isSearchMode && plugins.length >= page * 12 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => doSearch(query, page + 1)}
                    disabled={loading}
                    className="px-6 py-2 bg-white dark:bg-dark-card border border-mc-border dark:border-dark-border rounded-lg text-sm text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-colors disabled:opacity-50 btn-press"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : null}
                    加载更多
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
