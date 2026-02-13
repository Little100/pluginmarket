import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, Settings, Menu, X, Sun, Moon, Github, BookOpen } from 'lucide-react'
import { MinecraftBlockIcon } from '@/components/PlatformIcons'
import { useAppStore } from '@/store'

// AI 文字 SVG 图标组件
const AIIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <text x="2" y="17" fontSize="14" fontWeight="bold" fill="currentColor" stroke="none">AI</text>
  </svg>
)

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/browse', label: '浏览', icon: Search },
  { path: '/docs', label: '开服手册', icon: BookOpen },
  { path: '/guide', label: '指导开服', icon: AIIcon },
  { path: '/favorites', label: '收藏', icon: Heart },
  { path: '/settings', label: '设置', icon: Settings },
]

export default function Header() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useAppStore()

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-mc-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-minecraft text-lg text-gray-800 dark:text-dark-text hover:text-mc-green transition-colors group">
          <div className="logo-animate">
            <MinecraftBlockIcon size={28} />
          </div>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">MC 插件市场</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 btn-press ${
                  active
                    ? 'text-mc-green bg-mc-green/10 dark:bg-mc-green/20'
                    : 'text-gray-600 dark:text-dark-text-secondary hover:text-mc-green hover:bg-gray-100 dark:hover:bg-dark-border/50'
                }`}
              >
                <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                {item.label}
              </Link>
            )
          })}
          <a
            href="https://github.com/Little100/pluginmarket"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-2 rounded-lg text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-border/50 transition-all duration-200 btn-press hover:scale-110"
            title="GitHub 仓库"
          >
            <Github className="w-4 h-4" />
          </a>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-border/50 transition-all duration-200 btn-press hover:scale-110"
            title={darkMode ? '切换亮色' : '切换暗色'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="https://github.com/Little100/pluginmarket"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-600 dark:text-dark-text-secondary"
          >
            <Github className="w-4 h-4" />
          </a>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-dark-text-secondary"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-600 dark:text-dark-text-secondary">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-mc-border dark:border-dark-border bg-white dark:bg-dark-card dropdown-animate">
          {navItems.map((item, index) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 text-sm stagger-item transition-colors ${
                  active ? 'text-mc-green bg-mc-green/10 dark:bg-mc-green/20' : 'text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border/50'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
