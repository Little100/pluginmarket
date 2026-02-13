import type { PluginBase, Platform } from '@/types'
import { useAppStore } from '@/store'
import { searchSpiget } from './spiget'
import { searchHangar } from './hangar'
import { searchModrinth } from './modrinth'

// 统一搜索：并发查询所有启用的平台
export async function searchAll(query: string, page = 1, size = 10): Promise<PluginBase[]> {
  const platforms = useAppStore.getState().enabledPlatforms
  const results: PluginBase[] = []

  const promises: Promise<PluginBase[]>[] = []

  if (platforms.includes('spigot')) {
    promises.push(searchSpiget(query, page, size).catch(() => []))
  }
  if (platforms.includes('hangar')) {
    promises.push(searchHangar(query, page - 1, size).catch(() => []))
  }
  if (platforms.includes('modrinth')) {
    promises.push(searchModrinth(query, (page - 1) * size, size).catch(() => []))
  }

  const allResults = await Promise.all(promises)
  for (const r of allResults) {
    results.push(...r)
  }

  // 按下载量排序
  results.sort((a, b) => b.downloads - a.downloads)

  return results
}

// 格式化下载量
export function formatDownloads(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

// 格式化评分为星星
export function formatRating(rating?: number): number {
  if (!rating) return 0
  return Math.round(rating * 10) / 10
}

// 获取平台颜色
export function getPlatformColor(platform: Platform): string {
  switch (platform) {
    case 'spigot': return 'bg-spigot'
    case 'hangar': return 'bg-hangar'
    case 'modrinth': return 'bg-modrinth'
  }
}

// 获取平台名称
export function getPlatformName(platform: Platform): string {
  switch (platform) {
    case 'spigot': return 'Spigot'
    case 'hangar': return 'Hangar'
    case 'modrinth': return 'Modrinth'
  }
}
