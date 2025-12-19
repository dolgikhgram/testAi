type SendMessageRequest = {
    message: string
    currentId?: string
    stream?: boolean
  }

  type SendMessageResponse = {
    message: string
    currentId: string
  }


  type StreamCallback = (chunk: string) => void


  export async function sendMessage(
    message: string, 
    streamCallback: StreamCallback, 
    currentId?: string, 
    stream?: boolean,
    signal?: AbortSignal
  ): Promise<SendMessageResponse | undefined>  {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message,
            currentId,
            stream,
        }),
        signal,
    })
    if(!response.ok){
        throw new Error('Failed to send message')
    }
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('text/event-stream')) {
        throw new Error('Expected text/event-stream response')
    }
    const reader = response.body?.getReader()
    if(!reader){
        throw new Error('Failed to get reader')
    }
    const decoder = new TextDecoder()
    try {
        while(true){
            if(signal?.aborted){
                reader.cancel()
                throw new Error('Request aborted')
            }
            const {done, value} = await reader.read()
            if(done){
                break
            }
            const chunk = decoder.decode(value, {stream: true})
            const lines = chunk.split('\n')    
            for (const line of lines){
                if(line.trim() === ''){
                    continue
                }
                if(line.startsWith('data: ')){
                    const data = line.slice(6)
                    if(data.trim() === '[DONE]') {
                        return
                    }
                    try {
                        const parsed = JSON.parse(data)
                        if(parsed.content){
                            streamCallback(parsed.content)
                        }
                    } catch (e) {
                        console.warn('Failed to parse chunk:', e)
                    }
                }
            }
        }
    } catch (error) {
        if(signal?.aborted){
            throw new Error('Request aborted')
        }
        throw error
    }
  }

