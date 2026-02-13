import { apiFetch } from './api-base'
import type { PluginBase, HangarProject, HangarSearchResult } from '@/types'

function toPluginBase(p: HangarProject): PluginBase {
  return {
    id: `hangar-${p.namespace.owner}-${p.namespace.slug}`,
    platformId: `${p.namespace.owner}/${p.namespace.slug}`,
    platform: 'hangar',
    name: p.name,
    tag: p.description,
    author: p.namespace.owner,
    authorId: p.namespace.owner,
    icon: p.avatarUrl,
    rating: undefined, // Hangar 用 stars 代替
    downloads: p.stats.downloads,
    categories: [p.category, ...(p.settings?.tags || [])],
    lastUpdate: new Date(p.lastUpdated).getTime(),
    sourceUrl: `https://hangar.papermc.io/${p.namespace.owner}/${p.namespace.slug}`,
  }
}

export async function searchHangar(query: string, page = 0, size = 10): Promise<PluginBase[]> {
  const result = await apiFetch<HangarSearchResult>(
    'hangar',
    `/projects?q=${encodeURIComponent(query)}&limit=${size}&offset=${page * size}&sort=-downloads`
  )
  return result.result.map(toPluginBase)
}

export async function getHangarProject(owner: string, slug: string): Promise<PluginBase> {
  const p = await apiFetch<HangarProject>('hangar', `/projects/${owner}/${slug}`)
  return toPluginBase(p)
}

export async function getHangarProjectDescription(owner: string, slug: string): Promise<string> {
  // Hangar 的项目描述在 pages 端点
  // 尝试多种可能的页面路径
  const pagePaths = ['', 'main', 'home', 'Home', 'Main']
  
  for (const path of pagePaths) {
    try {
      const endpoint = path 
        ? `/projects/${owner}/${slug}/pages/${path}`
        : `/projects/${owner}/${slug}/pages`
      const pages = await apiFetch<{ content: string } | { content: string }[]>('hangar', endpoint)
      
      // 如果返回数组，取第一个
      if (Array.isArray(pages)) {
        if (pages.length > 0 && pages[0].content) {
          return pages[0].content
        }
      } else if (pages.content) {
        return pages.content
      }
    } catch {
      // 继续尝试下一个路径
    }
  }
  
  // 如果都失败了，尝试从项目详情获取描述
  try {
    const project = await apiFetch<HangarProject>('hangar', `/projects/${owner}/${slug}`)
    return project.description || ''
  } catch {
    return ''
  }
}

export async function getHangarPopular(page = 0, size = 10): Promise<PluginBase[]> {
  const result = await apiFetch<HangarSearchResult>(
    'hangar',
    `/projects?limit=${size}&offset=${page * size}&sort=-downloads`
  )
  return result.result.map(toPluginBase)
}

export async function getHangarAuthorProjects(author: string, page = 0, size = 10): Promise<PluginBase[]> {
  const result = await apiFetch<HangarSearchResult>(
    'hangar',
    `/projects?owner=${encodeURIComponent(author)}&limit=${size}&offset=${page * size}&sort=-downloads`
  )
  return result.result.map(toPluginBase)
}
