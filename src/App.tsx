import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import MainPage from '@/pages/MainPage'
import PluginDetailPage from '@/pages/PluginDetailPage'
import FavoritesPage from '@/pages/FavoritesPage'
import AuthorPage from '@/pages/AuthorPage'
import SettingsPage from '@/pages/SettingsPage'
import DocsPage from '@/pages/DocsPage'
import GuidePage from '@/pages/GuidePage'
import { useAppStore } from '@/store'

// 页面过渡包装组件
function AnimatedRoutes() {
  const location = useLocation()
  
  // 主页和浏览页合并为 MainPage，不需要页面切换动画
  const isMainPage = location.pathname === '/' || location.pathname === '/browse'
  
  return (
    <div className={isMainPage ? '' : 'animate-fade-in'} key={isMainPage ? 'main' : location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<MainPage />} />
        <Route path="/browse" element={<MainPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/plugin/:platform/:id" element={<PluginDetailPage />} />
        <Route path="/plugin/:platform/:id/:subId" element={<PluginDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/author/:platform/:authorId" element={<AuthorPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  const darkMode = useAppStore(s => s.darkMode)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <footer className="text-center py-4 text-xs text-gray-400 dark:text-gray-600 border-t border-mc-border dark:border-dark-border bg-white/50 dark:bg-dark-card/50">
          MC 插件市场 — Spigot · Hangar · Modrinth - Little_100
        </footer>
      </div>
    </HashRouter>
  )
}
