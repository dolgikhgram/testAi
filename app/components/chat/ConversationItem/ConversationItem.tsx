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

  useEffect(() => {
    if (isRenameModalOpen) {
      setNewTitle(dialog.title)
    }
  }, [isRenameModalOpen, dialog.title])

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
            ✏️
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
            🗑️
          </button>
        </div>
      </div>

      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Переименовать диалог"
      >
        <Input
          label="Название"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
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

