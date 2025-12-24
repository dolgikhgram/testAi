import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import styles from './Modal.module.css'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  autoFocusFirstButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  autoFocusFirstButton = true,
}: ModalProps) {
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const hasFocusedRef = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      hasFocusedRef.current = false
      return
    }

    if (!hasFocusedRef.current) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }

    if (autoFocusFirstButton && !hasFocusedRef.current) {
      const modal = document.querySelector(`.${styles.modal}`) as HTMLElement
      if (modal) {
        const activeElement = document.activeElement
        const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA'
        
        if (!isInputFocused) {
          const firstButton = modal.querySelector('button') as HTMLElement
          if (firstButton) {
            firstButton.focus()
          }
        }
      }
      hasFocusedRef.current = true
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)

      if (previousFocusRef.current && !isOpen) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, onClose, autoFocusFirstButton])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const titleId = title ? 'modal-title' : undefined

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={clsx(styles.modal, className)}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            <div className={styles.content}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

