import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../../ui/Button/Button'
import { Modal } from '../../ui/Modal/Modal'
import { Input } from '../../ui/Input/Input'
import type { DialogType } from '@/app/types/chat'
import styles from './ConversationItem.module.css'

type ConversationItemProps = {
  dialog: DialogType
  isActive?: boolean
  onSelect?: (dialogId: string) => void
  onRename?: (dialogId: string, newTitle: string) => void
  onDelete?: (dialogId: string) => void
}

export function ConversationItem({
  dialog,
  isActive = false,
  onSelect,
  onRename,
  onDelete,
}: ConversationItemProps) {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(dialog.title)
  const itemRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isRenameModalOpen) {
      setNewTitle(dialog.title)
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
          }
        }, 10)
      })
    }
  }, [isRenameModalOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement !== itemRef.current) return

      if (event.key === 'Enter') {
        event.preventDefault()
        onSelect?.(dialog.id)
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        setIsDeleteModalOpen(true)
      }
    }

    const element = itemRef.current
    element?.addEventListener('keydown', handleKeyDown)

    return () => {
      element?.removeEventListener('keydown', handleKeyDown)
    }
  }, [dialog.id, onSelect])

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== dialog.title) {
      onRename?.(dialog.id, newTitle.trim())
    }
    setIsRenameModalOpen(false)
  }

  const handleDelete = () => {
    onDelete?.(dialog.id)
    setIsDeleteModalOpen(false)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <>
      <div
        ref={itemRef}
        className={`${styles.item} ${isActive ? styles.active : ''}`}
        onClick={() => onSelect?.(dialog.id)}
        onContextMenu={handleContextMenu}
        tabIndex={0}
        role="button"
        aria-pressed={isActive}
        aria-label={`Диалог: ${dialog.title}`}
      >
        <div className={styles.content}>
          <div className={styles.title}>{dialog.title}</div>
          <div className={styles.date}>
            {new Date(dialog.updatedAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
            })}
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation()
              setIsRenameModalOpen(true)
            }}
            aria-label="Переименовать диалог"
            title="Переименовать"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" opacity="0.9"/>
            </svg>
          </button>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation()
              setIsDeleteModalOpen(true)
            }}
            aria-label="Удалить диалог"
            title="Удалить"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5h-5zM4 4.5v9a1.5 1.5 0 0 0 1.5 1.5h5a1.5 1.5 0 0 0 1.5-1.5v-9H4zm2 2v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 1 0zm3 0v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 1 0z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Переименовать диалог"
        autoFocusFirstButton={false}
      >
        <Input
          ref={inputRef}
          label="Название"
          value={newTitle}
          onChange={(e) => {
            setNewTitle(e.target.value)
            if (inputRef.current && document.activeElement !== inputRef.current) {
              inputRef.current.focus()
            }
          }}
          onFocus={(e) => {
            e.target.focus()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newTitle.trim()) {
              e.preventDefault()
              handleRename()
            } else if (e.key === 'Escape') {
              e.preventDefault()
              setIsRenameModalOpen(false)
            }
          }}
          autoFocus
        />
        <div className={styles.modalActions}>
          <Button onClick={() => setIsRenameModalOpen(false)} variant="secondary">
            Отмена
          </Button>
          <Button onClick={handleRename} disabled={!newTitle.trim()}>
            Сохранить
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Удалить диалог?"
      >
        <p>Вы уверены, что хотите удалить диалог &quot;{dialog.title}&quot;?</p>
        <p className={styles.warning}>Это действие нельзя отменить.</p>
        <div className={styles.modalActions}>
          <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">
            Отмена
          </Button>
          <Button onClick={handleDelete} variant="primary">
            Удалить
          </Button>
        </div>
      </Modal>
    </>
  )
}

