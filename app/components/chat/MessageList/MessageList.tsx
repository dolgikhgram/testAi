import React, { useEffect, useRef } from 'react'
import type { MessageType } from '@/app/types/chat'
import { Message } from '../Message/Message'
import styles from './MessageList.module.css'

type MessageListProps = {
  messages: MessageType[]
  streamingMessage?: string | null
  isLoading?: boolean
}

export function MessageList({
  messages,
  streamingMessage = null,
  isLoading = false,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  return (
    <div ref={containerRef} className={styles.container} role="log" aria-live="polite">
      {messages.length === 0 && !streamingMessage && !isLoading && (
        <div className={styles.empty}>
          <p>Начните диалог, отправив сообщение</p>
        </div>
      )}

      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {streamingMessage && (
        <div className={`${styles.message} ${styles.assistantMessage} ${styles.streaming}`}>
          <div className={styles.messageContent}>
            {streamingMessage}
          </div>
        </div>
      )}

      {isLoading && !streamingMessage && (
        <div className={`${styles.message} ${styles.assistantMessage}`}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <span>Печатает...</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

