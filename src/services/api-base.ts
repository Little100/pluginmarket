import { useAppStore } from '@/store'
import type { Platform } from '@/types'

// 检测是否在 Tauri 环境
export function isTauri(): boolean {
  return !!(window as any).__TAURI__
}

// 获取 API 基础 URL
function getBaseUrl(platform: Platform): string {
  const store = useAppStore.getState()
  const proxy = store.corsProxy

  if (isTauri()) {
    // Tauri 环境直接调用
    switch (platform) {
      case 'spigot': return 'https://api.spiget.org/v2'
      case 'hangar': return 'https://hangar.papermc.io/api/v1'
      case 'modrinth': return 'https://api.modrinth.com/v2'
    }
  }

  // 开发环境用 Vite 代理
  if (import.meta.env.DEV) {
    switch (platform) {
      case 'spigot': return '/api/spiget'
      case 'hangar': return '/api/hangar'
      case 'modrinth': return '/api/modrinth'
    }
  }

  // 生产环境用 CORS 代理
  switch (platform) {
    case 'spigot': return `${proxy}${encodeURIComponent('https://api.spiget.org/v2')}`
    case 'hangar': return `${proxy}${encodeURIComponent('https://hangar.papermc.io/api/v1')}`
    case 'modrinth': return `${proxy}${encodeURIComponent('https://api.modrinth.com/v2')}`
  }
}

// 通用 fetch 封装
async function apiFetch<T>(platform: Platform, path: string, init?: RequestInit): Promise<T> {
  const base = getBaseUrl(platform)
  let url: string

  if (import.meta.env.DEV || isTauri()) {
    url = `${base}${path}`
  } else {
    // 生产环境 CORS 代理模式：需要把完整 URL 编码
    const store = useAppStore.getState()
    const proxy = store.corsProxy
    const directUrls: Record<Platform, string> = {
      spigot: 'https://api.spiget.org/v2',
      hangar: 'https://hangar.papermc.io/api/v1',
      modrinth: 'https://api.modrinth.com/v2',
    }
    url = `${proxy}${encodeURIComponent(directUrls[platform] + path)}`
  }

  const res = await fetch(url, {
    ...init,
    headers: {
      'Accept': 'application/json',
      ...init?.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export { apiFetch, getBaseUrl }
