import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn(
      "animate-spin rounded-full border-2 border-muted border-t-primary",
      sizeClasses[size],
      className
    )} />
  )
}

interface TypingIndicatorProps {
  className?: string
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
      </div>
      <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
    </div>
  )
}

interface StreamingTextProps {
  text: string
  isComplete: boolean
  className?: string
}

export function StreamingText({ text, isComplete, className }: StreamingTextProps) {
  return (
    <div className={cn("relative", className)}>
      <span className="whitespace-pre-wrap">{text}</span>
      {!isComplete && (
        <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse">|</span>
      )}
    </div>
  )
}

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  showPercentage?: boolean
}

export function ProgressBar({ value, max, className, showPercentage = true }: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100)
  
  return (
    <div className={cn("space-y-1", className)}>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-muted-foreground text-center">
          {percentage}% Complete
        </div>
      )}
    </div>
  )
}

interface PulseIndicatorProps {
  isActive: boolean
  color?: 'green' | 'blue' | 'yellow' | 'red'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PulseIndicator({ 
  isActive, 
  color = 'green', 
  size = 'md', 
  className 
}: PulseIndicatorProps) {
  const colorClasses = {
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    yellow: 'bg-yellow-400', 
    red: 'bg-red-400'
  }
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return (
    <div className={cn("relative inline-flex", className)}>
      <div className={cn(
        "rounded-full",
        colorClasses[color],
        sizeClasses[size]
      )} />
      {isActive && (
        <div className={cn(
          "absolute inset-0 rounded-full animate-ping",
          colorClasses[color],
          sizeClasses[size]
        )} />
      )}
    </div>
  )
}

interface FloatingLabelInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
  type?: string
  className?: string
}

export function FloatingLabelInput({ 
  value, 
  onChange, 
  label, 
  placeholder,
  type = 'text',
  className 
}: FloatingLabelInputProps) {
  const hasValue = value.length > 0

  return (
    <div className={cn("relative", className)}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "peer w-full px-3 pt-6 pb-2 border rounded-md bg-background",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "placeholder-transparent"
        )}
      />
      <label className={cn(
        "absolute left-3 transition-all duration-200 pointer-events-none",
        "text-muted-foreground",
        hasValue || placeholder 
          ? "top-2 text-xs" 
          : "top-4 text-sm peer-focus:top-2 peer-focus:text-xs"
      )}>
        {label}
      </label>
    </div>
  )
}

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  from?: string
  to?: string
}

export function GradientText({ 
  children, 
  className,
  from = 'from-primary',
  to = 'to-primary/60'
}: GradientTextProps) {
  return (
    <span className={cn(
      "bg-gradient-to-r bg-clip-text text-transparent",
      from,
      to,
      className
    )}>
      {children}
    </span>
  )
}
