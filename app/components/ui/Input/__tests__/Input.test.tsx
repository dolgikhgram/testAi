import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Input } from '../Input'

describe('Input компонент', () => {
  it('должен отображать placeholder', () => {
    render(<Input placeholder="Введите имя" />)
    
    const input = screen.getByPlaceholderText('Введите имя')
    expect(input).toBeInTheDocument()
  })

  it('должен отображать label если он передан', () => {
    render(<Input label="Имя пользователя" />)
    
    expect(screen.getByText('Имя пользователя')).toBeInTheDocument()
  })

  it('должен вызывать onChange при вводе текста', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'тест' } })

    expect(handleChange).toHaveBeenCalled()
  })

  it('должен быть заблокирован когда disabled=true', () => {
    render(<Input disabled placeholder="Введите текст" />)
    
    const input = screen.getByPlaceholderText('Введите текст')
    expect(input).toBeDisabled()
  })

  it('должен показывать сообщение об ошибке если errorMessage передан', () => {
    render(<Input errorMessage="Это поле обязательно" />)
    
    expect(screen.getByText('Это поле обязательно')).toBeInTheDocument()
  })
})

