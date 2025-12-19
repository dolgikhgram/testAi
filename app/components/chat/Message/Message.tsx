import React from 'react'
import clsx from 'clsx'
import { Button } from '../../ui/Button/Button'
import type { MessageType } from '@/app/types/chat'
import styles from './Message.module.css'

type MessageProps = {
  message: MessageType
  hasError?: boolean
  onRetry?: () => void
}

export function Message({
  message,
  hasError = false,
  onRetry,
}: MessageProps) {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  const formattedTime = new Date(message.timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const today = new Date()
  const messageDate = new Date(message.timestamp)
  const isToday =
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear()

  const formattedDate = isToday
    ? ''
    : messageDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      })

  return (
    <div
      className={clsx(styles.message, {
        [styles.userMessage]: isUser,
        [styles.assistantMessage]: isAssistant,
        [styles.error]: hasError,
      })}
      role="article"
      aria-label={`Сообщение от ${isUser ? 'пользователя' : 'ассистента'}`}
    >
      <div className={styles.metadata}>
        {isAssistant && <span className={styles.role}>Ассистент</span>}
        {isUser && <span className={styles.role}>Вы</span>}
        {formattedDate && <span className={styles.date}>{formattedDate}</span>}
        <span className={styles.time}>{formattedTime}</span>
      </div>

      <div className={styles.content}>
        {message.content}
      </div>

      {hasError && onRetry && (
        <div className={styles.errorContainer}>
          <span className={styles.errorText}>Ошибка отправки</span>
          <Button onClick={onRetry} size="small" variant="secondary">
            Повторить
          </Button>
        </div>
      )}
    </div>
  )
}

