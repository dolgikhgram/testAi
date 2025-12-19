import React from 'react'
import clsx from 'clsx'
import styles from './Input.module.css'

type InputSize = 'small' | 'medium' | 'large'

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  type?: 'text' | 'email' | 'password' | 'number' | 'search'
  label?: string
  size?: InputSize
  invalid?: boolean
  errorMessage?: string
  ariaLabel?: string
  ariaDescribedBy?: string
} 

export function Input({
  type = 'text',
  value,
  placeholder,
  label,
  name,
  id,
  size = 'medium',
  disabled = false,
  required = false,
  invalid = false,
  errorMessage,
  ariaLabel,
  ariaDescribedBy,
  onChange,
  onBlur,
  onFocus,
  className = '',
}: InputProps) {
  const inputId = id 
  const errorId = errorMessage ? `${inputId}-error` : undefined
  const descriptionId = ariaDescribedBy || (errorMessage ? errorId : undefined)

  const inputClasses = clsx(
    styles.input,
    styles[size],
    {
      [styles.invalid]: invalid,
      [styles.disabled]: disabled,
    },
    className
  )

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        placeholder={placeholder}
        className={inputClasses}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-label={ariaLabel || label}
        aria-labelledby={label ? `${inputId}-label` : undefined}
        aria-describedby={descriptionId}
        aria-invalid={invalid}
        aria-required={required}
        aria-disabled={disabled}
      />
      {errorMessage && (
        <span id={errorId} className={styles.error} role="alert" aria-live="polite">
          {errorMessage}
        </span>
      )}
    </div>
  )
}

