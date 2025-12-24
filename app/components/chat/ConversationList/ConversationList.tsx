import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Button } from '../../ui/Button/Button'
import type { DialogType } from '@/app/types/chat'
import styles from './ConversationList.module.css'

type ConversationListProps = {
  dialogs: DialogType[]
  activeDialogId?: string | null
  searchQuery?: string
  onDialogSelect?: (dialogId: string) => void
}

export function ConversationList({
  dialogs,
  activeDialogId,
  searchQuery = '',
  onDialogSelect,
}: ConversationListProps) {
  const filteredDialogs = dialogs.filter((dialog) =>
    dialog.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.list} role="list" aria-label="Список диалогов">
      {filteredDialogs.length === 0 ? (
        <div className={styles.empty} role="status">
          {searchQuery ? 'Диалоги не найдены' : 'Нет диалогов'}
        </div>
      ) : (
        filteredDialogs.map((dialog, index) => (
          <motion.div
            key={dialog.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
          >
            <Button
              variant="secondary"
              className={clsx(styles.item, {
                [styles.active]: activeDialogId === dialog.id,
              })}
              onClick={() => onDialogSelect?.(dialog.id)}
              role="listitem"
              aria-pressed={activeDialogId === dialog.id}
            >
              <div className={styles.title}>{dialog.title}</div>
              <div className={styles.date}>
                {new Date(dialog.updatedAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                })}
              </div>
            </Button>
          </motion.div>
        ))
      )}
    </div>
  )
}

