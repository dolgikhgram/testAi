import React, { useEffect } from 'react'
import styles from './Modal.module.css'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const previousFocus = document.activeElement as HTMLElement

    const modal = document.querySelector(`.${styles.modal}`) as HTMLElement
    if (modal) {
      const firstButton = modal.querySelector('button') as HTMLElement
      if (firstButton) {
        firstButton.focus()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)

      if (previousFocus) {
        previousFocus.focus()
      }
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const titleId = title ? 'modal-title' : undefined

  return (
    <div 
      className={styles.overlay} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className={`${styles.modal} ${className}`}>
        {title && (
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
        )}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}

