export type MessageType = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export type DialogType = {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages?: MessageType[]
}

export type ChatStateType = {
  conversations: DialogType[]
  activeConversationId: string | null
}

