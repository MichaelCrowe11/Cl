import { cn } from '@/lib/utils'

interface CroweLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  showText?: boolean
  variant?: 'monogram' | 'wordmark' | 'emblem' | 'official-circle' | 'official-minimal'
  colors?: 'default' | 'royal-purple-gold'
  /** Explicitly for CroweOS Systems branding only */
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
  systemBranding = false,
  darkTheme = false
}: CroweLogoProps) {
  // Use official CroweOS Systems logos for system branding
  if (systemBranding && (variant === 'official-circle' || variant === 'official-minimal')) {
    const sizeValue = typeof size === 'number' ? size : {
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64
    }[size]

    // Use transparent logo for light backgrounds, darker logo for dark headers
    const logoSrc = variant === 'official-circle' 
      ? (darkTheme ? '/crowe0s1.png' : '/crowe0s.png')  // Dark header uses crowe0s1.png, light uses crowe0s.png
      : (darkTheme ? '/crowe0s1.png' : '/crowe0s.png')  // Both variants respect theme

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
            <h1 className={`text-lg font-semibold ${darkTheme 
              ? 'text-slate-100' 
              : 'text-foreground'
            }`}>
              CroweOS Systems
            </h1>
            <p className={`text-sm ${darkTheme ? 'text-slate-300' : 'text-muted-foreground'}`}>
              Mycology Platform
            </p>
          </div>
        )}
      </div>
    )
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  }

  // Handle numeric sizes for pixel values
  const sizeStyles = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div 
        className={cn(
          "relative rounded-full overflow-hidden shadow-lg ring-2",
          colors === 'royal-purple-gold' 
            ? "bg-purple-700 ring-amber-500/50"
            : "bg-[#332057] ring-[#C6A351]/50", // Official CroweOS colors
          typeof size === 'string' ? sizeClasses[size] : undefined
        )}
        style={sizeStyles}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
        <div className={cn(
          "relative flex items-center justify-center w-full h-full font-bold",
          colors === 'royal-purple-gold' ? "text-amber-400" : "text-[#C6A351]"
        )}>
          C0S
        </div>
      </div>
      {showText && (
        <div>
          <h1 className={cn(
            "text-lg font-semibold",
            colors === 'royal-purple-gold' 
              ? "bg-gradient-to-r from-purple-700 to-amber-500 bg-clip-text text-transparent"
              : "text-[#332057]"
          )}>
            CroweOS Systems
          </h1>
          <p className={cn(
            "text-sm",
            colors === 'royal-purple-gold'
              ? "text-purple-600"
              : "text-[#7F6BAA]"
          )}>
            Expert Intelligence Platform
          </p>
        </div>
      )}
    </div>
  )
}

// Official Art-Deco Monogram SVG Logo 
export function CroweLogoSVG({ className, size = 40, variant = 'monogram' }: { 
  className?: string; 
  size?: number | string;
  variant?: 'monogram' | 'wordmark' | 'emblem';
}) {
  const numericSize = typeof size === 'string' ? 40 : size
  
  if (variant === 'wordmark') {
    return (
      <svg
        width={numericSize * 2}
        height={numericSize}
        viewBox="0 0 780 280"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <style>{`
          .line{fill:none;stroke:#C6A351;stroke-width:14;stroke-linecap:round;stroke-linejoin:round;}
          .word{fill:#C6A351;font-family:'Trajan Pro 3',serif;font-size:120px;letter-spacing:2px;}
          .sub{fill:#C6A351;font-family:'Inter',sans-serif;font-size:72px;letter-spacing:4px;}
        `}</style>
        {/* Crest */}
        <g transform="translate(60 0)">
          <path className="line" d="M150 190 L150 60"/>
          <path className="line" d="M110 190 C110 130 70 140 70 60"/>
          <path className="line" d="M190 190 C190 130 230 140 230 60"/>
          <path className="line" d="M90 190 L60 140"/>
          <path className="line" d="M210 190 L240 140"/>
          <path className="line" d="M60 140 L150 60 L240 140"/>
        </g>
        {/* Word-mark */}
        <text className="word" x="340" y="140">CroweOS</text>
        <text className="sub" x="340" y="230">SYSTEMS</text>
      </svg>
    )
  }

  if (variant === 'emblem') {
    return (
      <svg
        width={numericSize}
        height={numericSize}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect x="32" y="32" width="448" height="448" rx="80" ry="80" fill="none" stroke="#C6A351" strokeWidth="16"/>
        <path d="M180 128 h152 a60 60 0 0 1 0 120 H210 a20 20 0 0 0 0 40 h124" fill="none" stroke="#C6A351" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  // Default: Art-Deco Monogram
  return (
    <svg
      width={numericSize}
      height={numericSize}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <style>{`
        .stroke{fill:none;stroke:#C6A351;stroke-width:16;stroke-linecap:round;stroke-linejoin:round;}
        .fill{fill:#C6A351;font-family:'Trajan Pro 3',serif;font-size:170px;}
      `}</style>
      <circle className="stroke" cx="256" cy="256" r="224"/>
      <circle className="stroke" cx="256" cy="256" r="160"/>
      <text className="fill" x="50%" y="55%" dominantBaseline="middle" textAnchor="middle">C0S</text>
    </svg>
  )
}
