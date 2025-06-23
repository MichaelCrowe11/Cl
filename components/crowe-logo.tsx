import { cn } from '@/lib/utils'

interface CroweLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
}

export function CroweLogo({ className, size = 'md', showText = false }: CroweLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "relative rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-green-600 shadow-lg",
        sizeClasses[size]
      )}>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
        <div className="relative flex items-center justify-center w-full h-full text-white font-bold">
          CL
        </div>
      </div>
      {showText && (
        <div>
          <h1 className="text-lg font-semibold">Crowe Logic AI</h1>
          <p className="text-sm text-muted-foreground">Expert Intelligence Platform</p>
        </div>
      )}
    </div>
  )
}

// SVG Logo version for higher quality
export function CroweLogoSVG({ className, size = 40 }: { className?: string; size?: number }) {
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
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />
      
      {/* Shine effect */}
      <ellipse cx="40" cy="30" rx="25" ry="20" fill="url(#shineGradient)" />
      
      {/* Text */}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="32"
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        CL
      </text>
    </svg>
  )
} 