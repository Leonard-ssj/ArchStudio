import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600',
  secondary: 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700',
  ghost: 'bg-transparent text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-600',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3.5 py-1.5 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  isLoading,
  leftIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center gap-1.5 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
    </button>
  )
}
