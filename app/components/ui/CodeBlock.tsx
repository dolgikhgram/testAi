import React, { useState } from 'react'
import styles from './CodeBlock.module.css'

type CodeBlockProps = {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({
  code,
  language = 'text',
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.header}>
        <span className={styles.language}>{language}</span>
        <button
          className={styles.copyButton}
          onClick={handleCopy}
          aria-label="Копировать код"
        >
          {copied ? 'Скопировано!' : 'Копировать'}
        </button>
      </div>
      <pre className={styles.pre}>
        <code className={styles.code}>{code}</code>
      </pre>
    </div>
  )
}

