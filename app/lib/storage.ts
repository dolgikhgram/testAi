import type { DialogType } from '@/app/types/chat'

const STORAGE_KEY = 'chat-dialogs'

export function saveDialogs(dialogs: DialogType[]) {
    if (typeof window === 'undefined'){
        return 
    }
    const json = JSON.stringify(dialogs)
    window.localStorage.setItem(STORAGE_KEY, json)
}

export function loadDialogs():DialogType[]{
    if (typeof window === 'undefined'){
        return []
    }
    const json = window.localStorage.getItem(STORAGE_KEY)
    if(!json){
        return []
    }
    const dialogs = JSON.parse(json) as DialogType[]
    return dialogs.map(dialog =>( {
        ...dialog,
        createdAt: new Date(dialog.createdAt),
        updatedAt: new Date(dialog.updatedAt),
        messages: dialog.messages?.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
    }))
}

export function clearDialogs(){
    if (typeof window === 'undefined'){
        return 
    }
    window.localStorage.removeItem(STORAGE_KEY)
}

