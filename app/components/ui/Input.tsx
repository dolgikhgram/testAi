import React from 'react'
import styles from './Input.module.css'

type InputSize = 'small' | 'medium' | 'large'

type InputProps = {
  type?: 'text' | 'email' | 'password' | 'number' | 'search'
  value?: string
  placeholder?: string
  label?: string
  name?: string
  id?: string
  size?: InputSize
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  errorMessage?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  className?: string
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

  const inputClasses = [
    styles.input,
    styles[size],
    invalid ? styles.invalid : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

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

