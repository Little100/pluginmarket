interface IconProps {
  className?: string
  size?: number
}

// Real SpigotMC icon from simple-icons
export function SpigotIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M12.644 2.44c-.179.033-.456.182-.603.331-.245.2-.588.232-2.023.133l-1.713-.116.049.713.049.713h.652c.36-.016 1.207-.05 1.876-.083l1.224-.083v3.317l-.44.05c-.425.05-.457.1-.457.862 0 .713-.05.813-.36.863-.26.033-.39.182-.44.464-.016.232-.114.448-.18.497-.08.05-.228.597-.326 1.211-.228 1.526-.375 1.708-1.37 1.84-1.436.167-2.056.134-2.056-.148 0-.2-.244-.25-1.158-.25-1.012 0-1.158-.032-1.24-.33-.065-.25-.228-.333-.62-.333s-.555.083-.62.332c-.082.299-.228.332-1.224.332-1.011 0-1.158.033-1.256.332-.049.182-.18.331-.26.331-.082 0-.148.863-.148 1.99 0 1.609.05 1.99.229 1.99.13 0 .293.15.342.332.082.282.245.332 1.175.332.914 0 1.077.05 1.142.331.13.465 1.11.465 1.24 0 .065-.282.228-.331 1.158-.331.849 0 1.077-.05 1.077-.25 0-.397 2.121-.33 3.426.117 1.583.53 5.14.53 6.82 0 .653-.199 1.256-.332 1.338-.282.359.232.163.896-.343 1.178-.587.298-.587.563 0 1.956l.343.797 1.599-.067c1.73-.083 2.822-.48 3.915-1.41l.539-.464-.31-.912c-.327-.962-.734-1.327-1.518-1.327-.342 0-.473-.149-.766-.796-.506-1.144-1.224-1.758-2.758-2.355-.799-.315-1.582-.746-1.99-1.127-.604-.548-.685-.73-.832-1.775-.098-.63-.245-1.194-.326-1.244-.066-.05-.164-.265-.18-.497-.049-.282-.18-.431-.424-.464-.326-.05-.375-.15-.375-.863 0-.763-.033-.812-.44-.862-.458-.05-.458-.05-.507-1.526-.032-.929.017-1.542.13-1.658.115-.116.93-.183 2.09-.183h1.908l.05-.564c.032-.298-.017-.63-.099-.713-.098-.1-.816-.083-1.909.05-1.256.15-1.778.15-1.86.017-.146-.25-.848-.481-1.24-.398z"/>
    </svg>
  )
}

// Hangar (PaperMC) - Paper airplane icon
export function HangarIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634L21.044 2.32c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"/>
    </svg>
  )
}

// Real Modrinth icon from simple-icons
export function ModrinthIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M12.252.004a11.78 11.768 0 0 0-8.92 3.73 11 10.999 0 0 0-2.17 3.11 11.37 11.359 0 0 0-1.16 5.169c0 1.42.17 2.5.6 3.77.24.759.77 1.899 1.17 2.529a12.3 12.298 0 0 0 8.85 5.639c.44.05 2.54.07 2.76.02.2-.04.22.1-.26-1.7l-.36-1.37-1.01-.06a8.5 8.489 0 0 1-5.18-1.8 5.34 5.34 0 0 1-1.3-1.26c0-.05.34-.28.74-.5a37.572 37.545 0 0 1 2.88-1.629c.03 0 .5.45 1.06.98l1 .97 2.07-.43 2.06-.43 1.47-1.47c.8-.8 1.48-1.5 1.48-1.52 0-.09-.42-1.63-.46-1.7-.04-.06-.2-.03-1.02.18-.53.13-1.2.3-1.45.4l-.48.15-.53.53-.53.53-.93.1-.93.07-.52-.5a2.7 2.7 0 0 1-.96-1.7l-.13-.6.43-.57c.68-.9.68-.9 1.46-1.1.4-.1.65-.2.83-.33.13-.099.65-.579 1.14-1.069l.9-.9-.7-.7-.7-.7-1.95.54c-1.07.3-1.96.53-1.97.53-.03 0-2.23 2.48-2.63 2.97l-.29.35.28 1.03c.16.56.3 1.16.31 1.34l.03.3-.34.23c-.37.23-2.22 1.3-2.84 1.63-.36.2-.37.2-.44.1-.08-.1-.23-.6-.32-1.03-.18-.86-.17-2.75.02-3.73a8.84 8.839 0 0 1 7.9-6.93c.43-.03.77-.08.78-.1.06-.17.5-2.999.47-3.039-.01-.02-.1-.02-.2-.03Zm3.68.67c-.2 0-.3.1-.37.38-.06.23-.46 2.42-.46 2.52 0 .04.1.11.22.16a8.51 8.499 0 0 1 2.99 2 8.38 8.379 0 0 1 2.16 3.449 6.9 6.9 0 0 1 .4 2.8c0 1.07 0 1.27-.1 1.73a9.37 9.369 0 0 1-1.76 3.769c-.32.4-.98 1.06-1.37 1.38-.38.32-1.54 1.1-1.7 1.14-.1.03-.1.06-.07.26.03.18.64 2.56.7 2.78l.06.06a12.07 12.058 0 0 0 7.27-9.4c.13-.77.13-2.58 0-3.4a11.96 11.948 0 0 0-5.73-8.578c-.7-.42-2.05-1.06-2.25-1.06Z"/>
    </svg>
  )
}

// Minecraft grass block icon for logo - 3D isometric style with unique IDs
export function MinecraftBlockIcon({ className = '', size = 24 }: IconProps) {
  // 使用唯一 ID 避免多个实例冲突
  const id = `mc-block-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={`${className} transition-transform duration-300 hover:scale-110`}>
      <defs>
        <linearGradient id={`${id}-grassTop`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8BC34A"/>
          <stop offset="40%" stopColor="#689F38"/>
          <stop offset="100%" stopColor="#33691E"/>
        </linearGradient>
        <linearGradient id={`${id}-dirtLeft`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8D6E63"/>
          <stop offset="30%" stopColor="#795548"/>
          <stop offset="100%" stopColor="#5D4037"/>
        </linearGradient>
        <linearGradient id={`${id}-dirtRight`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A1887F"/>
          <stop offset="30%" stopColor="#8D6E63"/>
          <stop offset="100%" stopColor="#6D4C41"/>
        </linearGradient>
        {/* 草地边缘高光 */}
        <linearGradient id={`${id}-grassEdge`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9CCC65"/>
          <stop offset="100%" stopColor="#7CB342"/>
        </linearGradient>
      </defs>
      
      {/* 顶面 - 草地 */}
      <polygon points="12,2 22,7 12,12 2,7" fill={`url(#${id}-grassTop)`}/>
      
      {/* 草地边缘装饰 */}
      <polygon points="2,7 12,12 12,12.5 2,7.5" fill={`url(#${id}-grassEdge)`} opacity="0.6"/>
      <polygon points="22,7 12,12 12,12.5 22,7.5" fill={`url(#${id}-grassEdge)`} opacity="0.4"/>
      
      {/* 左侧面 - 泥土 */}
      <polygon points="2,7 12,12 12,22 2,17" fill={`url(#${id}-dirtLeft)`}/>
      
      {/* 右侧面 - 泥土（更亮） */}
      <polygon points="22,7 12,12 12,22 22,17" fill={`url(#${id}-dirtRight)`}/>
      
      {/* 草地纹理 */}
      <circle cx="7" cy="5" r="0.9" fill="#AED581" opacity="0.8"/>
      <circle cx="12" cy="4" r="0.7" fill="#9CCC65" opacity="0.7"/>
      <circle cx="16" cy="5.5" r="0.8" fill="#8BC34A" opacity="0.6"/>
      <circle cx="10" cy="7" r="0.6" fill="#7CB342" opacity="0.5"/>
      <circle cx="14" cy="8" r="0.5" fill="#689F38" opacity="0.4"/>
      
      {/* 泥土纹理 - 左侧 */}
      <rect x="4" y="11" width="2.5" height="2" fill="#6D4C41" opacity="0.4" rx="0.3"/>
      <rect x="6" y="15" width="2" height="2.5" fill="#5D4037" opacity="0.35" rx="0.3"/>
      <rect x="3" y="14" width="1.5" height="1.5" fill="#4E342E" opacity="0.3" rx="0.2"/>
      
      {/* 泥土纹理 - 右侧 */}
      <rect x="15" y="12" width="2.5" height="2" fill="#8D6E63" opacity="0.35" rx="0.3"/>
      <rect x="17" y="15" width="2" height="2.5" fill="#795548" opacity="0.3" rx="0.3"/>
      <rect x="14" y="16" width="1.5" height="1.5" fill="#6D4C41" opacity="0.25" rx="0.2"/>
      
      {/* 高光效果 */}
      <polygon points="12,2 17,4.5 12,7 7,4.5" fill="white" opacity="0.15"/>
    </svg>
  )
}

// Generic platform icon selector
export function PlatformIcon({ platform, className = '', size = 24 }: { platform: string } & IconProps) {
  switch (platform) {
    case 'spigot': return <SpigotIcon className={className} size={size} />
    case 'hangar': return <HangarIcon className={className} size={size} />
    case 'modrinth': return <ModrinthIcon className={className} size={size} />
    default: return <MinecraftBlockIcon className={className} size={size} />
  }
}
