import { create } from 'zustand'
import type { PluginBase, Platform, Favorite, AppSettings, AIModelConfig, AIRoleAssignment, AIRole } from '@/types'

const STORAGE_KEY = 'mc-plugin-market'

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${key}`)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, value: unknown) {
  localStorage.setItem(`${STORAGE_KEY}-${key}`, JSON.stringify(value))
}

// 默认模型配置
const defaultModels: AIModelConfig[] = [
  {
    id: 'glm-4.7-flash',
    name: 'GLM-4.7-Flash (决策/对话)',
    provider: 'zhipu',
    model: 'glm-4.7-flash',
    apiKey: '',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    maxConcurrency: 1,
    maxContext: 200000,
    enabled: true,
  },
  {
    id: 'glm-4.5-flash',
    name: 'GLM-4.5-Flash (搜索筛选)',
    provider: 'zhipu',
    model: 'GLM-4.5-Flash',
    apiKey: '',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    maxConcurrency: 2,
    maxContext: 128000,
    enabled: true,
  },
  {
    id: 'glm-4-flash',
    name: 'GLM-4-Flash (翻译/对话)',
    provider: 'zhipu',
    model: 'GLM-4-Flash',
    apiKey: '',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    maxConcurrency: 200,
    maxContext: 8000,
    enabled: true,
  },
  {
    id: 'glm-4.6v-flash',
    name: 'GLM-4.6V-Flash (视觉)',
    provider: 'zhipu',
    model: 'glm-4.6v-flash',
    apiKey: '',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    maxConcurrency: 1,
    maxContext: 128000,
    enabled: true,
  },
  {
    id: 'glm-4v-flash',
    name: 'GLM-4V-Flash (视觉)',
    provider: 'zhipu',
    model: 'GLM-4V-Flash',
    apiKey: '',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    maxConcurrency: 10,
    maxContext: 8000,
    enabled: true,
  },
]

const defaultRoleAssignments: AIRoleAssignment[] = [
  { role: 'decision', modelId: 'glm-4.7-flash' },
  { role: 'search', modelId: 'glm-4.5-flash' },
  { role: 'chat', modelId: 'glm-4.7-flash' },
  { role: 'translate', modelId: 'glm-4-flash' },
  { role: 'vision', modelId: 'glm-4v-flash' },
]

interface AppState {
  // 主题
  darkMode: boolean
  toggleDarkMode: () => void

  // 平台开关
  enabledPlatforms: Platform[]
  togglePlatform: (p: Platform) => void

  // 收藏
  favorites: Favorite[]
  addFavorite: (plugin: PluginBase) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean

  // AI 设置
  models: AIModelConfig[]
  roleAssignments: AIRoleAssignment[]
  updateModel: (id: string, updates: Partial<AIModelConfig>) => void
  addModel: (model: AIModelConfig) => void
  removeModel: (id: string) => void
  setRoleAssignment: (role: AIRole, modelId: string) => void
  getModelForRole: (role: AIRole) => AIModelConfig | undefined

  // CORS 代理
  corsProxy: string
  setCorsProxy: (url: string) => void

  // 缓存
  pluginCache: Record<string, { data: PluginBase; timestamp: number }>
  cachePlugin: (plugin: PluginBase) => void
  getCachedPlugin: (id: string) => PluginBase | undefined

  // 搜索历史
  searchHistory: string[]
  addSearchHistory: (query: string) => void
  clearSearchHistory: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  darkMode: loadFromStorage<boolean>('darkMode', true),
  toggleDarkMode: () => {
    const next = !get().darkMode
    set({ darkMode: next })
    saveToStorage('darkMode', next)
    if (next) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },

  enabledPlatforms: loadFromStorage<Platform[]>('platforms', ['spigot', 'hangar', 'modrinth']),
  togglePlatform: (p) => {
    const current = get().enabledPlatforms
    const next = current.includes(p) ? current.filter(x => x !== p) : [...current, p]
    set({ enabledPlatforms: next })
    saveToStorage('platforms', next)
  },

  favorites: loadFromStorage<Favorite[]>('favorites', []),
  addFavorite: (plugin) => {
    const fav: Favorite = { plugin, addedAt: Date.now() }
    const next = [...get().favorites, fav]
    set({ favorites: next })
    saveToStorage('favorites', next)
  },
  removeFavorite: (id) => {
    const next = get().favorites.filter(f => f.plugin.id !== id)
    set({ favorites: next })
    saveToStorage('favorites', next)
  },
  isFavorite: (id) => get().favorites.some(f => f.plugin.id === id),

  models: loadFromStorage<AIModelConfig[]>('models', defaultModels),
  roleAssignments: loadFromStorage<AIRoleAssignment[]>('roleAssignments', defaultRoleAssignments),
  updateModel: (id, updates) => {
    const next = get().models.map(m => m.id === id ? { ...m, ...updates } : m)
    set({ models: next })
    saveToStorage('models', next)
  },
  addModel: (model) => {
    const next = [...get().models, model]
    set({ models: next })
    saveToStorage('models', next)
  },
  removeModel: (id) => {
    const next = get().models.filter(m => m.id !== id)
    set({ models: next })
    saveToStorage('models', next)
  },
  setRoleAssignment: (role, modelId) => {
    const current = get().roleAssignments
    const idx = current.findIndex(r => r.role === role)
    const next = idx >= 0
      ? current.map((r, i) => i === idx ? { ...r, modelId } : r)
      : [...current, { role, modelId }]
    set({ roleAssignments: next })
    saveToStorage('roleAssignments', next)
  },
  getModelForRole: (role) => {
    const assignment = get().roleAssignments.find(r => r.role === role)
    if (!assignment) return undefined
    return get().models.find(m => m.id === assignment.modelId)
  },

  corsProxy: loadFromStorage<string>('corsProxy', 'https://api.allorigins.win/raw?url='),
  setCorsProxy: (url) => {
    set({ corsProxy: url })
    saveToStorage('corsProxy', url)
  },

  pluginCache: loadFromStorage<Record<string, { data: PluginBase; timestamp: number }>>('pluginCache', {}),
  cachePlugin: (plugin) => {
    const cache = { ...get().pluginCache, [plugin.id]: { data: plugin, timestamp: Date.now() } }
    set({ pluginCache: cache })
    saveToStorage('pluginCache', cache)
  },
  getCachedPlugin: (id) => {
    const entry = get().pluginCache[id]
    if (!entry) return undefined
    // 缓存1小时
    if (Date.now() - entry.timestamp > 3600000) return undefined
    return entry.data
  },

  searchHistory: loadFromStorage<string[]>('searchHistory', []),
  addSearchHistory: (query) => {
    const current = get().searchHistory.filter(q => q !== query)
    const next = [query, ...current].slice(0, 20)
    set({ searchHistory: next })
    saveToStorage('searchHistory', next)
  },
  clearSearchHistory: () => {
    set({ searchHistory: [] })
    saveToStorage('searchHistory', [])
  },
}))
