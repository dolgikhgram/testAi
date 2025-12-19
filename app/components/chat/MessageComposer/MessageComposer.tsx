import React, { useState, KeyboardEvent } from 'react'
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

  return (
    <div className={styles.composer}>
      <textarea
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Введите сообщение"
        className={styles.textarea}
        rows={1}
      />
      <Button
        onClick={handleSend}
        disabled={!inputValue.trim() || disabled}
        className={styles.sendButton}
        aria-label="Отправить сообщение"
      >
        {disabled ? 'Отправка...' : 'Отправить'}
      </Button>
    </div>
  )
}

