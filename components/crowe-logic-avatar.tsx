/**
 * Crowe Logic AI Avatar Component
 * ALWAYS uses crowe-avatar.png for Crowe Logic AI branding
 * This is separate from CroweOS Systems logos
 */

import { cn } from '@/lib/utils'

interface CroweLogicAvatarProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  showText?: boolean
  variant?: 'circle' | 'square' | 'rounded'
  pulse?: boolean
}

export function CroweLogicAvatar({ 
  className, 
  size = 'md', 
  showText = false,
  variant = 'circle',
  pulse = false
}: CroweLogicAvatarProps) {
  const sizeValue = typeof size === 'number' ? size : {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64
  }[size]

  const shapeClass = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg'
  }[variant]

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div 
        className={cn(
          "relative overflow-hidden border-2 border-purple-600/20",
          shapeClass,
          pulse && "animate-pulse"
        )}
        style={{ width: sizeValue, height: sizeValue }}
      >
        <img 
          src="/crowe-avatar.png"
          alt="Crowe Logic AI"
          className="w-full h-full object-cover"
        />
        {/* AI indicator dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white shadow-sm">
          <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {showText && (
        <div>
          <h3 className="font-semibold text-base bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Crowe Logic AI
          </h3>
          <p className="text-sm text-muted-foreground">
            Mycology Assistant
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Compact variant for chat bubbles and inline usage
 */
export function CroweLogicAvatarCompact({ 
  size = 24,
  className
}: {
  size?: number
  className?: string
}) {
  return (
    <div 
      className={cn("relative rounded-full overflow-hidden border border-purple-600/20", className)}
      style={{ width: size, height: size }}
    >
      <img 
        src="/crowe-avatar.png"
        alt="Crowe Logic AI"
        className="w-full h-full object-cover"
      />
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
    </div>
  )
}
