import React, { useState, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../ui/Button/Button'
import styles from './MessageComposer.module.css'

type MessageComposerProps = {
  onSend?: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function MessageComposer({
  onSend,
  disabled = false,
  placeholder = 'Введите сообщение...',
}: MessageComposerProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (inputValue.trim() && onSend) {
      onSend(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const hasText = inputValue.trim().length > 0

  return (
    <div className={styles.composer}>
      <motion.textarea
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Введите сообщение"
        className={styles.textarea}
        rows={1}
        whileFocus={{ scale: 1.005 }}
        transition={{ duration: 0.15 }}
      />
      <AnimatePresence>
        {hasText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              onClick={handleSend}
              disabled={disabled}
              className={styles.sendButton}
              aria-label="Отправить сообщение"
            >
              {disabled ? 'Отправка...' : 'Отправить'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

