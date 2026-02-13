import { useAppStore } from '@/store'
import PluginCard from '@/components/PluginCard'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  const { favorites } = useAppStore()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        <h1 className="font-minecraft text-xl text-gray-800 dark:text-dark-text">我的收藏</h1>
        <span className="text-sm text-gray-400 dark:text-dark-text-secondary">({favorites.length})</span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-dark-text-secondary">
          <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p>还没有收藏任何插件</p>
          <p className="text-sm mt-1">浏览插件时点击 ❤️ 即可收藏</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map(f => (
            <PluginCard key={f.plugin.id} plugin={f.plugin} />
          ))}
        </div>
      )}
    </div>
  )
}
