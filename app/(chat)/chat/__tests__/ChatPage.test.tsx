import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ChatPage from '../page'
import * as chatApi from '@/app/lib/chatApi'
import * as storage from '@/app/lib/storage'

jest.mock('@/app/lib/chatApi')
jest.mock('@/app/lib/storage')

let uuidCounter = 0
jest.mock('uuid', () => ({
  v4: jest.fn(() => {
    uuidCounter++
    return `test-uuid-${uuidCounter}`
  }),
}))

const mockChatApi = chatApi as jest.Mocked<typeof chatApi>
const mockStorage = storage as jest.Mocked<typeof storage>

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('ChatPage тесты', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    uuidCounter = 0
    localStorage.clear()
    mockStorage.loadDialogs.mockReturnValue([])
    mockStorage.saveDialogs.mockImplementation(() => {})
  })

  describe('Тест 1: Создание нового диалога', () => {
    it('должен создаваться новый диалог', async () => {
      const user = userEvent.setup()
      render(<ChatPage />)

      const button = screen.getByRole('button', { name: /создать новый диалог/i })
      await user.click(button)

      await waitFor(() => {
        const dialogs = screen.getAllByText(/новый диалог/i)
        expect(dialogs.length).toBeGreaterThan(0)
      })
    })

    it('новый диалог должен быть активным', async () => {
      const user = userEvent.setup()
      render(<ChatPage />)

      const button = screen.getByRole('button', { name: /создать новый диалог/i })
      await user.click(button)

      await waitFor(() => {
        const title = screen.getByRole('heading', { level: 1 })
        expect(title.textContent).toContain('Новый диалог')
      })
    })
  })

  describe('Тест 2: Отправка сообщения', () => {
    beforeEach(() => {
      const dialog = {
        id: 'dialog-1',
        title: 'Тестовый диалог',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
      }
      mockStorage.loadDialogs.mockReturnValue([dialog])
    })

    it('должно отправляться сообщение', async () => {
      const user = userEvent.setup()
      
      mockChatApi.sendMessage.mockImplementation(async (message, callback) => {
        setTimeout(() => {
          callback('Ответ от AI')
        }, 100)
        return Promise.resolve(undefined)
      })

      render(<ChatPage />)

      await waitFor(() => {
        const dialogs = screen.getAllByText('Тестовый диалог')
        expect(dialogs.length).toBeGreaterThan(0)
      })

      const input = screen.getByPlaceholderText(/введите сообщение/i)
      await user.type(input, 'Привет')

      const sendButton = screen.getByRole('button', { name: /отправить/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText('Привет')).toBeInTheDocument()
      })

      await waitFor(() => {
        expect(screen.getByText('Ответ от AI')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('поле ввода должно очищаться после отправки', async () => {
      const user = userEvent.setup()
      
      mockChatApi.sendMessage.mockResolvedValue(undefined)

      render(<ChatPage />)

      await waitFor(() => {
        const dialogs = screen.getAllByText('Тестовый диалог')
        expect(dialogs.length).toBeGreaterThan(0)
      })

      const input = screen.getByPlaceholderText(/введите сообщение/i) as HTMLTextAreaElement
      await user.type(input, 'Тест')

      const sendButton = screen.getByRole('button', { name: /отправить/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(input.value).toBe('')
      })
    })
  })

  describe('Тест 3: Ошибка отправки', () => {
    beforeEach(() => {
      const dialog = {
        id: 'dialog-1',
        title: 'Тестовый диалог',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [
          {
            id: 'msg-1',
            role: 'user' as const,
            content: 'Сообщение',
            timestamp: new Date(),
          },
        ],
      }
      mockStorage.loadDialogs.mockReturnValue([dialog])
    })

    it('должна показываться ошибка при неудачной отправке', async () => {
      const user = userEvent.setup()
      
      mockChatApi.sendMessage.mockRejectedValue(new Error('Ошибка сети'))

      render(<ChatPage />)

      await waitFor(() => {
        const dialogs = screen.getAllByText('Тестовый диалог')
        expect(dialogs.length).toBeGreaterThan(0)
      })

      const input = screen.getByPlaceholderText(/введите сообщение/i)
      await user.type(input, 'Новое сообщение')

      const sendButton = screen.getByRole('button', { name: /отправить/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/ошибка/i)).toBeInTheDocument()
      })

      const retryButton = screen.getByRole('button', { name: /повторить/i })
      expect(retryButton).toBeInTheDocument()
    })

    it('должна работать кнопка повторить', async () => {
      const user = userEvent.setup()
      
      mockChatApi.sendMessage
        .mockRejectedValueOnce(new Error('Ошибка'))
        .mockResolvedValueOnce(undefined)

      render(<ChatPage />)

      await waitFor(() => {
        const dialogs = screen.getAllByText('Тестовый диалог')
        expect(dialogs.length).toBeGreaterThan(0)
      })

      const input = screen.getByPlaceholderText(/введите сообщение/i)
      await user.type(input, 'Сообщение')

      const sendButton = screen.getByRole('button', { name: /отправить/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/ошибка/i)).toBeInTheDocument()
      })

      const retryButton = screen.getByRole('button', { name: /повторить/i })
      await user.click(retryButton)

      await waitFor(() => {
        expect(mockChatApi.sendMessage).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Тест 4: Поиск диалогов', () => {
    beforeEach(() => {
      const dialogs = [
        {
          id: 'dialog-1',
          title: 'Работа',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
        },
        {
          id: 'dialog-2',
          title: 'Личное',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
        },
        {
          id: 'dialog-3',
          title: 'Проект X',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
        },
      ]
      mockStorage.loadDialogs.mockReturnValue(dialogs)
    })

    it('должен работать поиск диалогов', async () => {
      const user = userEvent.setup()
      render(<ChatPage />)

      await waitFor(() => {
        const dialogs = screen.getAllByText('Работа')
        expect(dialogs.length).toBeGreaterThan(0)
      })

      const searchInput = screen.getByLabelText(/поиск по диалогам/i)
      await user.type(searchInput, 'Работа')

      await waitFor(() => {
        expect(screen.queryByText('Личное')).not.toBeInTheDocument()
        expect(screen.queryByText('Проект X')).not.toBeInTheDocument()
      })
    })

    it('должны показываться все диалоги после очистки поиска', async () => {
      const user = userEvent.setup()
      render(<ChatPage />)

      await waitFor(() => {
        const dialogs = screen.getAllByText('Работа')
        expect(dialogs.length).toBeGreaterThan(0)
      })

      const searchInput = screen.getByLabelText(/поиск по диалогам/i) as HTMLInputElement
      await user.type(searchInput, 'Работа')

      await waitFor(() => {
        expect(screen.queryByText('Личное')).not.toBeInTheDocument()
      })

      await user.clear(searchInput)

      await waitFor(() => {
        expect(screen.getByText('Личное')).toBeInTheDocument()
        expect(screen.getByText('Проект X')).toBeInTheDocument()
      })
    })

    it('должно показываться сообщение когда диалоги не найдены', async () => {
      const user = userEvent.setup()
      render(<ChatPage />)

      await waitFor(() => {
        const dialogs = screen.getAllByText('Работа')
        expect(dialogs.length).toBeGreaterThan(0)
      })

      const searchInput = screen.getByLabelText(/поиск по диалогам/i)
      await user.type(searchInput, 'Несуществующий')

      await waitFor(() => {
        expect(screen.getByText(/диалоги не найдены/i)).toBeInTheDocument()
      })
    })
  })

  describe('Тест 5: Удаление диалога', () => {
    beforeEach(() => {
      const dialogs = [
        {
          id: 'dialog-1',
          title: 'Диалог 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
        },
        {
          id: 'dialog-2',
          title: 'Диалог 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
        },
      ]
      mockStorage.loadDialogs.mockReturnValue(dialogs)
    })

    it('должен удаляться диалог', async () => {
      const user = userEvent.setup()
      render(<ChatPage />)

      await waitFor(() => {
        const dialogs = screen.getAllByText('Диалог 1')
        expect(dialogs.length).toBeGreaterThan(0)
      })

      const deleteButtons = screen.getAllByLabelText(/удалить диалог/i)
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.getByText(/вы уверены/i)).toBeInTheDocument()
      })

      const confirmButtons = screen.getAllByRole('button', { name: /удалить/i })
      const confirmButton = confirmButtons.find(btn => btn.textContent === 'Удалить')
      expect(confirmButton).toBeInTheDocument()
      if (confirmButton) {
        await user.click(confirmButton)
      }

      await waitFor(() => {
        expect(screen.queryByText('Диалог 1')).not.toBeInTheDocument()
      })
    })

    it('должен выбираться следующий диалог после удаления активного', async () => {
      const user = userEvent.setup()
      render(<ChatPage />)

      await waitFor(() => {
        const dialogs = screen.getAllByText('Диалог 1')
        expect(dialogs.length).toBeGreaterThan(0)
      })

      const deleteButtons = screen.getAllByLabelText(/удалить диалог/i)
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.getByText(/вы уверены/i)).toBeInTheDocument()
      })

      const confirmButtons = screen.getAllByRole('button', { name: /удалить/i })
      const confirmButton = confirmButtons.find(btn => btn.textContent === 'Удалить')
      expect(confirmButton).toBeInTheDocument()
      if (confirmButton) {
        await user.click(confirmButton)
      }

      await waitFor(() => {
        const title = screen.getByRole('heading', { level: 1 })
        expect(title.textContent).toBe('Диалог 2')
      })
    })

    it('должна работать отмена удаления', async () => {
      const user = userEvent.setup()
      render(<ChatPage />)

      await waitFor(() => {
        const dialogs = screen.getAllByText('Диалог 1')
        expect(dialogs.length).toBeGreaterThan(0)
      })

      const deleteButtons = screen.getAllByLabelText(/удалить диалог/i)
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.getByText(/вы уверены/i)).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: /отмена/i })
      await user.click(cancelButton)

      await waitFor(() => {
        const dialogs = screen.getAllByText('Диалог 1')
        expect(dialogs.length).toBeGreaterThan(0)
      })
    })
  })
})

