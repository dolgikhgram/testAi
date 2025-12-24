import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import clsx from 'clsx'
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
    <div className={clsx(styles.wrapper, className)}>
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
      <div className={styles.codeContainer}>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#858585',
            userSelect: 'none',
          }}
          customStyle={{
            margin: 0,
            padding: '16px',
            background: '#1e1e1e',
            borderRadius: '0 0 8px 8px',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'var(--font-mono)',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

