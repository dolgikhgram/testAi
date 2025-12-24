import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Message } from '../Message'
import type { MessageType } from '@/app/types/chat'

describe('Message компонент', () => {
  const userMessage: MessageType = {
    id: '1',
    role: 'user',
    content: 'Привет, как дела?',
    timestamp: new Date('2024-01-01T12:00:00'),
  }

  const assistantMessage: MessageType = {
    id: '2',
    role: 'assistant',
    content: 'Привет! Всё отлично, спасибо!',
    timestamp: new Date('2024-01-01T12:01:00'),
  }

  it('должен отображать текст сообщения пользователя', () => {
    render(<Message message={userMessage} />)
    
    expect(screen.getByText('Привет, как дела?')).toBeInTheDocument()
  })

  it('должен отображать текст сообщения ассистента', () => {
    render(<Message message={assistantMessage} />)
    
    expect(screen.getByText('Привет! Всё отлично, спасибо!')).toBeInTheDocument()
  })

  it('должен показывать "Вы" для сообщения пользователя', () => {
    render(<Message message={userMessage} />)
    
    expect(screen.getByText('Вы')).toBeInTheDocument()
  })

  it('должен показывать "Ассистент" для сообщения ассистента', () => {
    render(<Message message={assistantMessage} />)
    
    expect(screen.getByText('Ассистент')).toBeInTheDocument()
  })

  it('должен показывать кнопку повтора если есть ошибка и onRetry', () => {
    const handleRetry = jest.fn()
    render(<Message message={userMessage} hasError={true} onRetry={handleRetry} />)
    
    expect(screen.getByText('Повторить')).toBeInTheDocument()
  })
})

