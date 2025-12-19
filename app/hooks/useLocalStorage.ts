import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [currentValue, setCurrentValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue
        }
        const el = window.localStorage.getItem(key)
        if (el) {
            return JSON.parse(el) 
        }
        return initialValue 
    })

    useEffect(() => {
        if(typeof window === 'undefined'){
            return 
        }
        window.localStorage.setItem(key, JSON.stringify(currentValue))
    },[key, currentValue])

    const setValue = (value: T) => setCurrentValue(value)
    return [currentValue, setValue]
}