import { saveDialogs, loadDialogs, clearDialogs } from '../storage'
import type { DialogType } from '@/app/types/chat'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('storage функции', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('должна сохранять диалоги в localStorage', () => {
    const dialogs: DialogType[] = [
      {
        id: '1',
        title: 'Тестовый диалог',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        messages: [],
      },
    ]

    saveDialogs(dialogs)

    const saved = localStorage.getItem('chat-dialogs')
    expect(saved).toBeTruthy()
    expect(JSON.parse(saved!)).toHaveLength(1)
  })

  it('должна загружать диалоги из localStorage', () => {
    const dialogs: DialogType[] = [
      {
        id: '1',
        title: 'Первый диалог',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        messages: [],
      },
      {
        id: '2',
        title: 'Второй диалог',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        messages: [],
      },
    ]

    saveDialogs(dialogs)
    const loaded = loadDialogs()

    expect(loaded).toHaveLength(2)
    expect(loaded[0].title).toBe('Первый диалог')
    expect(loaded[1].title).toBe('Второй диалог')
  })

  it('должна возвращать пустой массив если localStorage пустой', () => {
    const loaded = loadDialogs()
    expect(loaded).toEqual([])
  })

  it('должна очищать диалоги из localStorage', () => {
    const dialogs: DialogType[] = [
      {
        id: '1',
        title: 'Тестовый диалог',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        messages: [],
      },
    ]

    saveDialogs(dialogs)
    clearDialogs()

    const loaded = loadDialogs()
    expect(loaded).toEqual([])
  })
})

