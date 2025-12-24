import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from '../Button'

describe('Button компонент', () => {
  it('должен отображать текст кнопки', () => {
    render(<Button>Нажми меня</Button>)
    expect(screen.getByText('Нажми меня')).toBeInTheDocument()
  })

  it('должен вызывать onClick при клике', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Кнопка</Button>)

    const button = screen.getByText('Кнопка')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('должен быть заблокирован когда disabled=true', () => {
    render(<Button disabled>Заблокированная кнопка</Button>)
    
    const button = screen.getByText('Заблокированная кнопка')
    expect(button).toBeDisabled()
  })

  it('не должен вызывать onClick когда disabled', () => {
    const handleClick = jest.fn()
    render(
      <Button onClick={handleClick} disabled>
        Кнопка
      </Button>
    )

    const button = screen.getByText('Кнопка')
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('должен иметь правильный aria-label', () => {
    render(<Button aria-label="Закрыть окно">X</Button>)
    
    const button = screen.getByLabelText('Закрыть окно')
    expect(button).toBeInTheDocument()
  })
})

