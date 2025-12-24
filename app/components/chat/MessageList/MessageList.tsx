import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { MessageType } from '@/app/types/chat'
import { Message } from '../Message/Message'
import { CodeBlock } from '../../ui/CodeBlock/CodeBlock'
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
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {streamingMessage && (
        <motion.div
          className={`${styles.message} ${styles.assistantMessage} ${styles.streaming}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.messageContent}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }: { className?: string; children?: React.ReactNode }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const language = match ? match[1] : ''
                  const code = String(children).replace(/\n$/, '')
                  const isInline = !className

                  return !isInline && language ? (
                    <CodeBlock code={code} language={language} />
                  ) : (
                    <code className={className} {...props}>{children}</code>
                  )
                },
              }}
            >
              {streamingMessage}
            </ReactMarkdown>
          </div>
        </motion.div>
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

