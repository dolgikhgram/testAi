import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'small' | 'medium' | 'large'

type  ButtonProps = {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  'aria-label'?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault() 
      if (!disabled && onClick) {
        onClick()
      }
    }
  }

  const buttonClasses = clsx(
    styles.button,
    styles[variant],
    styles[size],
    {
      [styles.disabled]: disabled,
    },
    className
  )

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  )
}

