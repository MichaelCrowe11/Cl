'use client'

import Image from 'next/image'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin`}>
        <Image
          src="/crowe-logo-secondary.png"
          alt="Loading..."
          width={48}
          height={48}
          className="w-full h-full object-contain"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' }}
        />
      </div>
    </div>
  )
}

interface CroweBackdropProps {
  className?: string
  opacity?: number
}

export function CroweBackdrop({ className = '', opacity = 0.03 }: CroweBackdropProps) {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: 'url("/crowe-logo-secondary.png")',
        backgroundSize: '300px 300px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: opacity,
        zIndex: -1
      }}
    />
  )
}
