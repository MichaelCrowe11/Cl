import { cn } from '@/lib/utils'

interface CroweLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
}

export function CroweLogoOfficial({ className, size = 'md', showText = false }: CroweLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "relative rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg ring-2 ring-yellow-500/50",
        sizeClasses[size]
      )}>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
        <div className="relative flex items-center justify-center w-full h-full text-yellow-100 font-bold">
          COS
        </div>
      </div>
      {showText && (
        <div>
          <h1 className="text-lg font-semibold">CroweOS</h1>
          <p className="text-sm text-muted-foreground">Systems Platform</p>
        </div>
      )}
    </div>
  )
}

// Official CroweOS Logo with Network/System Design
export function CroweOSSystemLogo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="cosGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      
      {/* Outer gold ring */}
      <circle cx="50" cy="50" r="48" stroke="url(#goldGradient)" strokeWidth="4" fill="none" />
      
      {/* Inner purple circle */}
      <circle cx="50" cy="50" r="40" fill="url(#cosGradient)" />
      
      {/* Network nodes design */}
      <g fill="#fbbf24">
        {/* Center node */}
        <circle cx="50" cy="50" r="3" />
        
        {/* Surrounding nodes */}
        <circle cx="35" cy="35" r="2" />
        <circle cx="65" cy="35" r="2" />
        <circle cx="35" cy="65" r="2" />
        <circle cx="65" cy="65" r="2" />
        
        {/* Connection lines */}
        <line x1="50" y1="50" x2="35" y2="35" stroke="#fbbf24" strokeWidth="1.5" />
        <line x1="50" y1="50" x2="65" y2="35" stroke="#fbbf24" strokeWidth="1.5" />
        <line x1="50" y1="50" x2="35" y2="65" stroke="#fbbf24" strokeWidth="1.5" />
        <line x1="50" y1="50" x2="65" y2="65" stroke="#fbbf24" strokeWidth="1.5" />
      </g>
      
      {/* COS Text */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fbbf24"
        fontSize="16"
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        COS
      </text>
    </svg>
  )
}

// Human-like Avatar Logo Design
export function CroweOSPersonLogo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      
      {/* Triple ring design */}
      <circle cx="50" cy="50" r="48" stroke="url(#ringGradient)" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="44" stroke="url(#ringGradient)" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="50" r="40" stroke="url(#ringGradient)" strokeWidth="1" fill="none" />
      
      {/* Inner white background */}
      <circle cx="50" cy="50" r="36" fill="white" />
      
      {/* Stylized person icon */}
      <g fill="url(#bgGradient)">
        {/* Head */}
        <circle cx="50" cy="40" r="8" />
        
        {/* Body */}
        <path d="M42 56 L42 70 L46 70 L46 58 L54 58 L54 70 L58 70 L58 56 C58 50 54 48 50 48 C46 48 42 50 42 56 Z" />
      </g>
      
      {/* OS text */}
      <text
        x="50"
        y="82"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="url(#bgGradient)"
        fontSize="12"
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        OS
      </text>
    </svg>
  )
}
