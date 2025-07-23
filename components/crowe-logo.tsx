import { cn } from '@/lib/utils'

interface CroweLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  showText?: boolean
  variant?: 'monogram' | 'wordmark' | 'emblem' | 'official-circle' | 'official-minimal'
  colors?: 'default' | 'royal-purple-gold'
  /** Use for Crowe Logic primary branding */
  logicBranding?: boolean
  /** Use for CroweOS Systems footer/minimal branding only */
  systemBranding?: boolean
  /** Dark theme variant for light text */
  darkTheme?: boolean
}

export function CroweLogo({ 
  className, 
  size = 'md', 
  showText = false, 
  variant = 'monogram',
  colors = 'default',
  logicBranding = true,
  systemBranding = false,
  darkTheme = false
}: CroweLogoProps) {
  const sizeValue = typeof size === 'number' ? size : {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64
  }[size]

  // Use Crowe Logic avatar for primary branding
  if (logicBranding && !systemBranding) {
    const logoSrc = '/crowelogic-avatar.png'

    return (
      <div className={cn("flex items-center gap-3", className)}>
        <img 
          src={logoSrc}
          alt="Crowe Logic"
          style={{ height: sizeValue }}
          className="object-contain rounded-full"
        />
        {showText && (
          <div>
            <h1 className={`text-lg font-semibold ${darkTheme 
              ? 'text-slate-100' 
              : 'text-foreground'
            }`}>
              Crowe Logic
            </h1>
          </div>
        )}
      </div>
    )
  }

  // Use official CroweOS Systems logos for system/footer branding only
  if (systemBranding && (variant === 'official-circle' || variant === 'official-minimal')) {
    const logoSrc = '/cos-logo.svg'

    return (
      <div className={cn("flex items-center gap-3", className)}>
        <img 
          src={logoSrc}
          alt="CroweOS Systems"
          style={{ height: sizeValue }}
          className="object-contain"
        />
        {showText && (
          <div>
            <h1 className={`text-sm font-medium ${darkTheme 
              ? 'text-slate-100' 
              : 'text-foreground'
            }`}>
              CroweOS Systems
            </h1>
            <p className={`text-xs ${darkTheme ? 'text-slate-300' : 'text-muted-foreground'}`}>
              Software Platform
            </p>
          </div>
        )}
      </div>
    )
  }

  // Default fallback with SVG monogram
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div 
        className={cn(
          "relative rounded-full overflow-hidden shadow-lg ring-2",
          colors === 'royal-purple-gold' 
            ? "bg-purple-700 ring-amber-500/50"
            : "bg-[#332057] ring-[#C6A351]/50",
          `w-${sizeValue} h-${sizeValue}`
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
        <div className="relative flex items-center justify-center w-full h-full font-bold text-[#C6A351]">
          CL
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold tracking-tight leading-tight",
            darkTheme ? "text-white" : "text-foreground"
          )}>
            Crowe Logic
          </span>
        </div>
      )}
    </div>
  )
}
