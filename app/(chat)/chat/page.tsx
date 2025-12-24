'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ConversationItem } from '@/app/components/chat/ConversationItem/ConversationItem'
import { MessageList } from '@/app/components/chat/MessageList/MessageList'
import { MessageComposer } from '@/app/components/chat/MessageComposer/MessageComposer'
import { Button } from '@/app/components/ui/Button/Button'
import type { DialogType, MessageType } from '@/app/types/chat'
import { loadDialogs, saveDialogs } from '@/app/lib/storage'
import { sendMessage } from '@/app/lib/chatApi'
import { v4 as uuidv4 } from 'uuid'
import styles from './page.module.css'

export default function ChatPage() {
  const [dialogs, setDialogs] = useState<DialogType[]>([])
  const [activeDialogId, setActiveDialogId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const streamingContentRef = useRef<string>('')

  useEffect(() => {
    const loadedDialogs = loadDialogs()
    setDialogs(loadedDialogs)
    if (loadedDialogs.length > 0 && !activeDialogId) {
      setActiveDialogId(loadedDialogs[0].id)
    }
  }, [])

  useEffect(() => {
    if (dialogs.length > 0) {
      saveDialogs(dialogs)
    }
  }, [dialogs])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isSidebarOpen])

  const activeDialog = dialogs.find((d) => d.id === activeDialogId) || null
  const activeMessages = activeDialog?.messages || []

  const handleNewDialog = useCallback(() => {
    const emptyDialog = dialogs.find(
      (dialog) => !dialog.messages || dialog.messages.length === 0
    )

    if (emptyDialog) {
      setActiveDialogId(emptyDialog.id)
      setSearchQuery('')
      setError(null)
      return
    }
    const newDialog: DialogType = {
      id: uuidv4(),
      title: `Новый диалог ${dialogs.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    }
    setDialogs((prev) => [newDialog, ...prev])
    setActiveDialogId(newDialog.id)
    setSearchQuery('')
    setError(null)
  }, [dialogs])

  const handleDialogSelect = useCallback((dialogId: string) => {
    setActiveDialogId(dialogId)
    setError(null)
    setStreamingMessage(null)
    setIsSidebarOpen(false)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const handleRenameDialog = useCallback((dialogId: string, newTitle: string) => {
    setDialogs((prev) =>
      prev.map((dialog) =>
        dialog.id === dialogId
          ? { ...dialog, title: newTitle, updatedAt: new Date() }
          : dialog
      )
    )
  }, [])

  const handleDeleteDialog = useCallback((dialogId: string) => {
    setDialogs((prev) => prev.filter((dialog) => dialog.id !== dialogId))
    if (activeDialogId === dialogId) {
      const remainingDialogs = dialogs.filter((d) => d.id !== dialogId)
      setActiveDialogId(remainingDialogs.length > 0 ? remainingDialogs[0].id : null)
    }
  }, [activeDialogId, dialogs])

  const handleSendMessage = useCallback(
    async (messageText: string) => {
      if (!activeDialogId || !messageText.trim()) return

      const userMessage: MessageType = {
        id: uuidv4(),
        role: 'user',
        content: messageText,
        timestamp: new Date(),
      }

      setDialogs((prev) =>
        prev.map((dialog) =>
          dialog.id === activeDialogId
            ? {
                ...dialog,
                messages: [...(dialog.messages || []), userMessage],
                updatedAt: new Date(),
              }
            : dialog
        )
      )

      setIsLoading(true)
      setError(null)
      setStreamingMessage('')
      streamingContentRef.current = ''

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      try {
        let accumulatedContent = ''

        await sendMessage(
          messageText,
          (chunk: string) => {
            if (!abortController.signal.aborted) {
              accumulatedContent += chunk
              streamingContentRef.current = accumulatedContent
              setStreamingMessage(accumulatedContent)
            }
          },
          activeDialogId,
          true,
          abortController.signal
        )

        if (!abortController.signal.aborted && accumulatedContent.trim()) {
          const assistantMessage: MessageType = {
            id: uuidv4(),
            role: 'assistant',
            content: accumulatedContent,
            timestamp: new Date(),
          }

          setDialogs((prev) =>
            prev.map((dialog) =>
              dialog.id === activeDialogId
                ? {
                    ...dialog,
                    messages: [...(dialog.messages || []), assistantMessage],
                    updatedAt: new Date(),
                  }
                : dialog
            )
          )
        }

        setStreamingMessage(null)
        streamingContentRef.current = ''
      } catch (err) {
        if (abortController.signal.aborted) {
          const currentContent = streamingContentRef.current || ''
          if (currentContent.trim() && activeDialogId) {
            const assistantMessage: MessageType = {
              id: uuidv4(),
              role: 'assistant',
              content: currentContent,
              timestamp: new Date(),
            }

            setDialogs((prev) =>
              prev.map((dialog) =>
                dialog.id === activeDialogId
                  ? {
                      ...dialog,
                      messages: [...(dialog.messages || []), assistantMessage],
                      updatedAt: new Date(),
                    }
                  : dialog
              )
            )
          }
          setStreamingMessage(null)
          streamingContentRef.current = ''
        } else {
          setError(err instanceof Error ? err.message : 'Ошибка отправки сообщения')
          setStreamingMessage(null)
          streamingContentRef.current = ''
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [activeDialogId]
  )

  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      
      const currentContent = streamingContentRef.current || ''
      if (currentContent.trim() && activeDialogId) {
        const assistantMessage: MessageType = {
          id: uuidv4(),
          role: 'assistant',
          content: currentContent,
          timestamp: new Date(),
        }

        setDialogs((prev) =>
          prev.map((dialog) =>
            dialog.id === activeDialogId
              ? {
                  ...dialog,
                  messages: [...(dialog.messages || []), assistantMessage],
                  updatedAt: new Date(),
                }
              : dialog
          )
        )
      }

      abortControllerRef.current = null
      streamingContentRef.current = ''
      setIsLoading(false)
      setStreamingMessage(null)
    }
  }, [activeDialogId])

  const handleRetry = useCallback(() => {
    if (activeMessages.length > 0) {
      const lastUserMessage = [...activeMessages]
        .reverse()
        .find((msg) => msg.role === 'user')
      if (lastUserMessage) {
        const lastAssistantIndex = activeMessages.findLastIndex(
          (msg) => msg.role === 'assistant'
        )
        if (lastAssistantIndex !== -1) {
          setDialogs((prev) =>
            prev.map((dialog) =>
              dialog.id === activeDialogId
                ? {
                    ...dialog,
                    messages: dialog.messages?.slice(0, lastAssistantIndex) || [],
                  }
                : dialog
            )
          )
        }
        handleSendMessage(lastUserMessage.content)
      }
    }
  }, [activeMessages, activeDialogId, handleSendMessage])

  const filteredDialogs = dialogs.filter((dialog) =>
    dialog.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.chatPage}>
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
        aria-label="Список диалогов"
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Диалоги</h2>
          <div className={styles.sidebarActions}>
            <Button onClick={handleNewDialog} size="small" aria-label="Создать новый диалог">
              +
            </Button>
            <button
              className={styles.closeButton}
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Закрыть меню"
            >
              ✕
            </button>
          </div>
        </div>

        <div className={styles.search}>
          <input
            type="search"
            placeholder="Поиск диалогов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Поиск по диалогам"
          />
        </div>

        <div className={styles.dialogList} role="list">
          {filteredDialogs.length === 0 ? (
            <div className={styles.empty} role="status">
              {searchQuery ? 'Диалоги не найдены' : 'Нет диалогов'}
            </div>
          ) : (
            filteredDialogs.map((dialog) => (
              <ConversationItem
                key={dialog.id}
                dialog={dialog}
                isActive={activeDialogId === dialog.id}
                onSelect={handleDialogSelect}
                onRename={handleRenameDialog}
                onDelete={handleDeleteDialog}
              />
            ))
          )}
        </div>
      </aside>

      <main className={styles.main}>
        {!activeDialog ? (
          <div className={styles.emptyState}>
            <p>Выберите диалог или создайте новый</p>
          </div>
        ) : (
          <>
            <div className={styles.chatHeader}>
              <button
                className={styles.menuButton}
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Открыть меню диалогов"
                aria-expanded={isSidebarOpen}
              >
                ☰
              </button>
              <h1 className={styles.chatTitle}>{activeDialog.title}</h1>
              <div className={styles.chatHeaderActions}>
                {isLoading && (
                  <button
                    onClick={handleStopGeneration}
                    className={styles.stopButton}
                    aria-label="Остановить генерацию"
                  >
                    <span className={styles.stopIcon}>⏹</span>
                    <span>Stop</span>
                  </button>
                )}
              </div>
            </div>

            <div className={styles.messagesContainer}>
              {error && (
                <div className={styles.error} role="alert">
                  <span>Ошибка: {error}</span>
                  <Button onClick={handleRetry} size="small" variant="secondary">
                    Повторить
                  </Button>
                </div>
              )}

              {activeMessages.length === 0 && !streamingMessage && !isLoading ? (
                <div className={styles.emptyMessage}>Начните диалог, отправив сообщение</div>
              ) : (
                <MessageList
                  messages={activeMessages}
                  streamingMessage={streamingMessage}
                  isLoading={isLoading && !streamingMessage}
                />
              )}
            </div>

            <div className={styles.composerContainer}>
              <MessageComposer
                onSend={handleSendMessage}
                disabled={isLoading}
                placeholder="Введите сообщение..."
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

