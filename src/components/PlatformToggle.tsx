import { useAppStore } from '@/store'
import { PlatformIcon } from '@/components/PlatformIcons'
import { Check } from 'lucide-react'
import type { Platform } from '@/types'

const platforms: { id: Platform; label: string; color: string; bgColor: string }[] = [
  { id: 'spigot', label: 'Spigot', color: 'text-spigot', bgColor: 'bg-spigot/10 dark:bg-spigot/20 border-spigot/30' },
  { id: 'hangar', label: 'Hangar', color: 'text-hangar', bgColor: 'bg-hangar/10 dark:bg-hangar/20 border-hangar/30' },
  { id: 'modrinth', label: 'Modrinth', color: 'text-modrinth', bgColor: 'bg-modrinth/10 dark:bg-modrinth/20 border-modrinth/30' },
]

export default function PlatformToggle() {
  const { enabledPlatforms, togglePlatform } = useAppStore()

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {platforms.map(p => {
        const active = enabledPlatforms.includes(p.id)
        return (
          <button
            key={p.id}
            onClick={() => togglePlatform(p.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${
              active
                ? `${p.bgColor} ${p.color} border-current`
                : 'bg-white dark:bg-dark-card border-mc-border dark:border-dark-border text-gray-400 dark:text-dark-text-secondary opacity-60 hover:opacity-80'
            }`}
          >
            <PlatformIcon platform={p.id} size={18} className={active ? p.color : 'text-gray-400 dark:text-gray-600'} />
            <span className="font-minecraft">{p.label}</span>
            {active && <Check className="w-3.5 h-3.5" />}
          </button>
        )
      })}
    </div>
  )
}
