import React, { useState } from 'react'
import { Input } from '../../ui/Input'
import { Button } from '../../ui/Button'
import type { DialogType, MessageType } from '@/app/types/chat'
import styles from './ChatWindow.module.css'

type ChatWindowProps = {
  activeDialog: DialogType | null
  messages?: MessageType[]
  isLoading?: boolean
  error?: string | null
  onSendMessage?: (message: string) => void
}

export function ChatWindow({
  activeDialog,
  messages = [],
  isLoading = false,
  error = null,
  onSendMessage,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }


  if (!activeDialog) {
    return (
      <div className={styles.empty}>
        <p>Выберите диалог или создайте новый</p>
      </div>
    )
  }

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h2 className={styles.title}>{activeDialog.title}</h2>
      </div>

      <div className={styles.messagesContainer}>
        {error && (
          <div className={styles.error} role="alert">
            Ошибка: {error}
          </div>
        )}

        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <span>Загрузка...</span>
          </div>
        )}

        {messages.length === 0 && !isLoading && !error && (
          <div className={styles.emptyMessages}>
            <p>Начните диалог, отправив сообщение</p>
          </div>
        )}

        <div className={styles.messagesList} role="log" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.role === 'user' ? styles.userMessage : styles.assistantMessage
              }`}
            >
              <div className={styles.messageContent}>{message.content}</div>
              <div className={styles.messageTime}>
                {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.composer}>
        <Input
          type="text"
          placeholder="Введите сообщение..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          ariaLabel="Введите сообщение"
          className={styles.input}
        />
        <Button
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
          className={styles.sendButton}
        >
          Отправить
        </Button>
      </div>
    </div>
  )
}

