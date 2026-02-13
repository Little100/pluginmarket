import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Loader2 } from 'lucide-react'
import type { PluginBase, Platform } from '@/types'
import PluginCard from '@/components/PluginCard'
import { getSpigetAuthorResources } from '@/services/spiget'
import { getHangarAuthorProjects } from '@/services/hangar'
import { getModrinthUserProjects } from '@/services/modrinth'

export default function AuthorPage() {
  const { platform, authorId } = useParams<{ platform: Platform; authorId: string }>()
  const navigate = useNavigate()
  const [plugins, setPlugins] = useState<PluginBase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (platform && authorId) loadAuthorPlugins()
  }, [platform, authorId])

  async function loadAuthorPlugins() {
    setLoading(true)
    try {
      let results: PluginBase[] = []
      if (platform === 'spigot') {
        results = await getSpigetAuthorResources(authorId!, 1, 20)
      } else if (platform === 'hangar') {
        results = await getHangarAuthorProjects(authorId!, 0, 20)
      } else if (platform === 'modrinth') {
        results = await getModrinthUserProjects(authorId!)
      }
      setPlugins(results)
    } catch (err) {
      console.error('加载作者作品失败:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text mb-4">
        <ArrowLeft className="w-4 h-4" /> 返回
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-mc-green/10 dark:bg-mc-green/20 flex items-center justify-center">
          <User className="w-6 h-6 text-mc-green" />
        </div>
        <div>
          <h1 className="font-minecraft text-xl text-gray-800 dark:text-dark-text">{authorId}</h1>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
            {platform === 'spigot' ? 'Spigot' : platform === 'hangar' ? 'Hangar' : 'Modrinth'} 开发者
          </p>
        </div>
      </div>

      <h2 className="font-minecraft text-sm text-gray-600 dark:text-dark-text-secondary mb-4">作品列表 ({plugins.length})</h2>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-mc-green" />
        </div>
      ) : plugins.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-dark-text-secondary">暂无作品</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plugins.map(p => (
            <PluginCard key={p.id} plugin={p} />
          ))}
        </div>
      )}
    </div>
  )
}
