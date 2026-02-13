import { useState } from 'react'
import { useAppStore } from '@/store'
import type { AIModelConfig, AIRole, AIProvider } from '@/types'
import { Settings, Plus, Trash2, Eye, EyeOff, RotateCcw, Globe, Bot, Languages, Search, MessageSquare, Sparkles, AlertCircle, Key, X } from 'lucide-react'

const roleLabels: Record<AIRole, { label: string; desc: string; icon: typeof Bot }> = {
  decision: { label: '决策/提示词', desc: '最聪明的模型，用于分析和决策', icon: Sparkles },
  search: { label: 'AI 搜索', desc: '搜索时的初次筛选', icon: Search },
  chat: { label: 'AI 对话', desc: '插件详情页的对话功能', icon: MessageSquare },
  translate: { label: 'AI 翻译', desc: '翻译插件描述', icon: Languages },
  vision: { label: '视觉识别', desc: '描述插件截图内容', icon: Eye },
}

export default function SettingsPage() {
  const { models, roleAssignments, updateModel, addModel, removeModel, setRoleAssignment, corsProxy, setCorsProxy } = useAppStore()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [newModelOpen, setNewModelOpen] = useState(false)
  const [newModel, setNewModel] = useState<Partial<AIModelConfig>>({
    provider: 'openai-compatible',
    model: '',
    name: '',
    apiKey: '',
    baseUrl: '',
    maxConcurrency: 5,
    maxContext: 8000,
    enabled: true,
  })

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAddModel = () => {
    if (!newModel.name || !newModel.model) return
    const id = `custom-${Date.now()}`
    addModel({
      id,
      name: newModel.name!,
      provider: newModel.provider as AIProvider,
      model: newModel.model!,
      apiKey: newModel.apiKey || '',
      baseUrl: newModel.baseUrl || '',
      maxConcurrency: newModel.maxConcurrency || 5,
      maxContext: newModel.maxContext || 8000,
      enabled: true,
    })
    setNewModelOpen(false)
    setNewModel({ provider: 'openai-compatible', model: '', name: '', apiKey: '', baseUrl: '', maxConcurrency: 5, maxContext: 8000, enabled: true })
  }

  const resetDefaults = () => {
    if (confirm('确定要重置所有设置为默认值吗？')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-mc-green" />
        <h1 className="font-minecraft text-xl text-gray-800 dark:text-dark-text">设置</h1>
      </div>

      {/* CORS Proxy */}
      <section className="bg-white dark:bg-dark-card rounded-xl border border-mc-border dark:border-dark-border p-5 mb-6">
        <h2 className="font-minecraft text-sm font-medium mb-3 flex items-center gap-2 text-gray-800 dark:text-dark-text">
          <Globe className="w-4 h-4 text-mc-green" />
          CORS 代理设置
        </h2>
        <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-3">
          在线版需要 CORS 代理来访问插件 API。桌面版不需要代理。
        </p>
        <input
          type="text"
          value={corsProxy}
          onChange={(e) => setCorsProxy(e.target.value)}
          placeholder="https://api.allorigins.win/raw?url="
          className="w-full px-3 py-2 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
        />
      </section>

      {/* AI Models */}
      <section className="bg-white dark:bg-dark-card rounded-xl border border-mc-border dark:border-dark-border p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-minecraft text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-dark-text">
            <Bot className="w-4 h-4 text-mc-green" />
            AI 模型配置
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setNewModelOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-mc-green text-white text-xs rounded-lg hover:bg-mc-green-dark transition-colors"
            >
              <Plus className="w-3 h-3" /> 添加模型
            </button>
            <button
              onClick={resetDefaults}
              className="flex items-center gap-1 px-3 py-1.5 border border-mc-border dark:border-dark-border text-xs rounded-lg text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> 重置
            </button>
          </div>
        </div>

        {/* New model dialog - AT THE TOP */}
        {newModelOpen && (
          <div className="mb-4 p-4 bg-mc-green/5 dark:bg-mc-green/10 border border-mc-green/20 dark:border-mc-green/30 rounded-xl animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-minecraft text-xs text-mc-green">添加新模型</h3>
              <button onClick={() => setNewModelOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">模型名称</label>
                <input
                  type="text"
                  value={newModel.name || ''}
                  onChange={(e) => setNewModel(p => ({ ...p, name: e.target.value }))}
                  placeholder="例: GPT-4o"
                  className="w-full px-3 py-1.5 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">模型标识</label>
                <input
                  type="text"
                  value={newModel.model || ''}
                  onChange={(e) => setNewModel(p => ({ ...p, model: e.target.value }))}
                  placeholder="例: gpt-4o"
                  className="w-full px-3 py-1.5 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">API Key</label>
                <input
                  type="password"
                  value={newModel.apiKey || ''}
                  onChange={(e) => setNewModel(p => ({ ...p, apiKey: e.target.value }))}
                  placeholder="输入 API Key..."
                  className="w-full px-3 py-1.5 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">API 地址</label>
                <input
                  type="text"
                  value={newModel.baseUrl || ''}
                  onChange={(e) => setNewModel(p => ({ ...p, baseUrl: e.target.value }))}
                  placeholder="https://api.openai.com/v1"
                  className="w-full px-3 py-1.5 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">最大并发</label>
                <input
                  type="number"
                  value={newModel.maxConcurrency || 5}
                  onChange={(e) => setNewModel(p => ({ ...p, maxConcurrency: parseInt(e.target.value) || 5 }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">上下文长度</label>
                <input
                  type="number"
                  value={newModel.maxContext || 8000}
                  onChange={(e) => setNewModel(p => ({ ...p, maxContext: parseInt(e.target.value) || 8000 }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">提供商</label>
                <select
                  value={newModel.provider || 'openai-compatible'}
                  onChange={(e) => setNewModel(p => ({ ...p, provider: e.target.value as AIProvider }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                >
                  <option value="zhipu">智谱 AI</option>
                  <option value="openai-compatible">OpenAI 兼容</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={handleAddModel}
                disabled={!newModel.name || !newModel.model}
                className="px-4 py-1.5 bg-mc-green text-white text-xs rounded-lg hover:bg-mc-green-dark transition-colors disabled:opacity-50"
              >
                确认添加
              </button>
            </div>
          </div>
        )}

        {/* Model list */}
        <div className="space-y-4">
          {models.map(model => (
            <div key={model.id} className={`p-4 rounded-xl border transition-colors ${
              model.enabled
                ? 'border-mc-border dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/50'
                : 'border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/30 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateModel(model.id, { enabled: !model.enabled })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      model.enabled ? 'bg-mc-green' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                      model.enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <span className="font-minecraft text-sm text-gray-800 dark:text-dark-text">{model.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    model.provider === 'zhipu'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  }`}>
                    {model.provider === 'zhipu' ? '智谱' : 'OpenAI兼容'}
                  </span>
                </div>
                {model.id.startsWith('custom-') && (
                  <button
                    onClick={() => removeModel(model.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">模型名称</label>
                  <input
                    type="text"
                    value={model.model}
                    onChange={(e) => updateModel(model.id, { model: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">API Key</label>
                  <div className="relative">
                    <input
                      type={showKeys[model.id] ? 'text' : 'password'}
                      value={model.apiKey}
                      onChange={(e) => updateModel(model.id, { apiKey: e.target.value })}
                      placeholder="输入 API Key..."
                      className="w-full px-3 py-1.5 pr-8 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                    />
                    <button
                      onClick={() => toggleKeyVisibility(model.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-dark-text"
                    >
                      {showKeys[model.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">API 地址</label>
                  <input
                    type="text"
                    value={model.baseUrl}
                    onChange={(e) => updateModel(model.id, { baseUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">
                      最大并发 {model.provider === 'zhipu' && <span className="text-red-400">(固定)</span>}
                    </label>
                    <input
                      type="number"
                      value={model.maxConcurrency}
                      onChange={(e) => updateModel(model.id, { maxConcurrency: parseInt(e.target.value) || 1 })}
                      disabled={model.provider === 'zhipu'}
                      className="w-full px-3 py-1.5 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green disabled:opacity-50"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1 block">上下文长度</label>
                    <input
                      type="number"
                      value={model.maxContext}
                      onChange={(e) => updateModel(model.id, { maxContext: parseInt(e.target.value) || 8000 })}
                      className="w-full px-3 py-1.5 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Role Assignments */}
      <section className="bg-white dark:bg-dark-card rounded-xl border border-mc-border dark:border-dark-border p-5 mb-6">
        <h2 className="font-minecraft text-sm font-medium mb-4 flex items-center gap-2 text-gray-800 dark:text-dark-text">
          <Sparkles className="w-4 h-4 text-mc-green" />
          AI 角色分配
        </h2>
        <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-4">
          为每个 AI 功能指定使用的模型。支持混合模式（如 OpenAI 兼容模型搜索 + 智谱翻译）。
        </p>
        <div className="space-y-3">
          {(Object.keys(roleLabels) as AIRole[]).map(role => {
            const info = roleLabels[role]
            const Icon = info.icon
            const currentAssignment = roleAssignments.find(r => r.role === role)
            const enabledModels = models.filter(m => m.enabled)

            return (
              <div key={role} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-dark-bg/50 border border-mc-border/50 dark:border-dark-border/50">
                <Icon className="w-4 h-4 text-mc-green flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800 dark:text-dark-text">{info.label}</div>
                  <div className="text-[10px] text-gray-400 dark:text-dark-text-secondary">{info.desc}</div>
                </div>
                <select
                  value={currentAssignment?.modelId || ''}
                  onChange={(e) => setRoleAssignment(role, e.target.value)}
                  className="px-2 py-1 rounded-lg border border-mc-border dark:border-dark-border bg-white dark:bg-dark-bg text-xs text-gray-700 dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-mc-green min-w-[160px]"
                >
                  <option value="">未分配</option>
                  {enabledModels.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            )
          })}
        </div>
      </section>

      {/* API Key Help */}
      <section className="bg-white dark:bg-dark-card rounded-xl border border-mc-border dark:border-dark-border p-5 mb-6">
        <h2 className="font-minecraft text-sm font-medium mb-3 flex items-center gap-2 text-gray-800 dark:text-dark-text">
          <Key className="w-4 h-4 text-mc-green" />
          获取 API Key
        </h2>
        <div className="space-y-2 text-xs text-gray-600 dark:text-dark-text-secondary">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="font-medium text-blue-700 dark:text-blue-400 mb-1">智谱 AI（推荐）</p>
            <p>前往 <a href="https://open.bigmodel.cn/" target="_blank" rel="noopener" className="underline text-blue-600 dark:text-blue-400">open.bigmodel.cn</a> 注册账号，在控制台创建 API Key。GLM-4-Flash 等模型免费使用。</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <p className="font-medium text-purple-700 dark:text-purple-400 mb-1">OpenAI 兼容</p>
            <p>支持任何 OpenAI 兼容的 API 服务（如 OpenAI、DeepSeek、Moonshot 等），填写对应的 API 地址和 Key 即可。</p>
          </div>
        </div>
      </section>
    </div>
  )
}
