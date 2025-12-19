import React, { useState } from 'react'
import { Input } from '../../ui/Input'
import { Button } from '../../ui/Button'
import type { DialogType } from '@/app/types/chat'
import styles from './ChatSidebar.module.css'

type ChatSidebarProps = {
  dialogs: DialogType[]
  activeDialogId?: string | null
  onDialogSelect?: (dialogId: string) => void
  onNewDialog?: () => void
}

export function ChatSidebar({
  dialogs,
  activeDialogId,
  onDialogSelect,
  onNewDialog,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')


  const filteredDialogs = dialogs.filter((dialog) =>
    dialog.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className={styles.sidebar} aria-label="Список диалогов">
      <div className={styles.header}>
        <h2 className={styles.title}>Диалоги</h2>
        <Button onClick={onNewDialog} size="small">
          + 
        </Button>
      </div>

      <div className={styles.search}>
        <Input
          type="search"
          placeholder="Поиск диалогов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          ariaLabel="Поиск по диалогам"
        />
      </div>


      <div className={styles.dialogList} role="list">
        {filteredDialogs.length === 0 ? (
          <div className={styles.empty}>
            {searchQuery ? 'Диалоги не найдены' : 'Нет диалогов'}
          </div>
        ) : (
          filteredDialogs.map((dialog) => (
            <Button
              key={dialog.id}
              variant="secondary"
              className={`${styles.dialogItem} ${
                activeDialogId === dialog.id ? styles.active : ''
              }`}
              onClick={() => onDialogSelect?.(dialog.id)}
            >
              <div className={styles.dialogTitle}>{dialog.title}</div>
              <div className={styles.dialogDate}>
                {new Date(dialog.updatedAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                })}
              </div>
            </Button>
          ))
        )}
      </div>
    </aside>
  )
}

