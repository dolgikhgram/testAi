'use client'

import React from 'react'
import styles from './layout.module.css'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}

