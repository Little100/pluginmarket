import { useNavigate } from 'react-router-dom'
import { Star, Download, Heart, MoreVertical, ExternalLink } from 'lucide-react'
import type { PluginBase } from '@/types'
import { useAppStore } from '@/store'
import { formatDownloads, getPlatformName } from '@/services/search'
import { PlatformIcon } from '@/components/PlatformIcons'
import { useState } from 'react'

interface Props {
  plugin: PluginBase
}

const platformColors: Record<string, string> = {
  spigot: 'text-spigot',
  hangar: 'text-hangar',
  modrinth: 'text-modrinth',
}

const platformBgColors: Record<string, string> = {
  spigot: 'bg-spigot/10 dark:bg-spigot/20',
  hangar: 'bg-hangar/10 dark:bg-hangar/20',
  modrinth: 'bg-modrinth/10 dark:bg-modrinth/20',
}

export default function PluginCard({ plugin }: Props) {
  const { isFavorite, addFavorite, removeFavorite } = useAppStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const fav = isFavorite(plugin.id)

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (fav) removeFavorite(plugin.id)
    else addFavorite(plugin)
  }

  const stars = plugin.rating ? Math.round(plugin.rating) : 0

  return (
    <div
      className="bg-white dark:bg-dark-card rounded-xl border border-mc-border dark:border-dark-border card-hover cursor-pointer group relative overflow-hidden h-[180px] flex flex-col"
      onClick={() => navigate(`/plugin/${plugin.platform}/${plugin.platformId}`)}
    >
      {/* Menu button */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-dark-card/80 hover:bg-gray-100 dark:hover:bg-dark-border"
        >
          <MoreVertical className="w-4 h-4 text-gray-500 dark:text-dark-text-secondary" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 bg-white dark:bg-dark-card border border-mc-border dark:border-dark-border rounded-lg shadow-lg py-1 min-w-[120px] animate-fade-in">
            <button
              onClick={toggleFav}
              className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-dark-border text-gray-700 dark:text-dark-text"
            >
              <Heart className={`w-3 h-3 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
              {fav ? '取消收藏' : '收藏'}
            </button>
            {plugin.sourceUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(plugin.sourceUrl, '_blank')
                }}
                className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-dark-border text-gray-700 dark:text-dark-text"
              >
                <ExternalLink className="w-3 h-3" />
                原始页面
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-start gap-3 mb-2 flex-shrink-0">
          {plugin.icon ? (
            <img src={plugin.icon} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-mc-green/10 dark:bg-mc-green/20 flex items-center justify-center flex-shrink-0">
              <PlatformIcon platform={plugin.platform} size={20} className={platformColors[plugin.platform]} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-minecraft text-sm font-medium text-gray-800 dark:text-dark-text truncate">{plugin.name}</h3>
            {plugin.author && (
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary truncate">by {plugin.author}</p>
            )}
          </div>
        </div>

        {/* Description - 固定高度，超出显示省略号 */}
        <p className="text-xs text-gray-600 dark:text-dark-text-secondary line-clamp-2 mb-2 flex-shrink-0 h-8 overflow-hidden">
          {plugin.tag || '\u00A0'}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Stats - 固定在底部 */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-dark-text-secondary">
              <Download className="w-3 h-3" />
              {formatDownloads(plugin.downloads)}
            </div>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${platformBgColors[plugin.platform]} ${platformColors[plugin.platform]}`}>
            <PlatformIcon platform={plugin.platform} size={12} className={platformColors[plugin.platform]} />
            {getPlatformName(plugin.platform)}
          </span>
        </div>

        {/* Categories 或 Stars（没有有效 categories 时显示星星） */}
        {plugin.categories && plugin.categories.filter(c => c && c.trim()).length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-2 flex-shrink-0 h-5 overflow-hidden">
            {plugin.categories.filter(c => c && c.trim()).slice(0, 3).map((cat, i) => (
              <span key={`${cat}-${i}`} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-dark-border text-gray-500 dark:text-dark-text-secondary rounded">
                {cat}
              </span>
            ))}
          </div>
        ) : stars > 0 ? (
          <div className="flex items-center gap-0.5 mt-2 flex-shrink-0 h-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
