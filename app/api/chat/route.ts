import { NextRequest, NextResponse } from 'next/server'



function generateBotResponse(message: string): string {
    const lowerMessage = message.toLowerCase()

    if(lowerMessage.includes('привет') || lowerMessage.includes('прив')){
        return 'Привет! Как дела?'
    }

    if(lowerMessage.includes('как дела') || lowerMessage.includes('как ты')){
        return 'Хорошо, спасибо! А у тебя как?'
    }

    if (lowerMessage.includes('что ты умеешь') || lowerMessage.includes('что ты можешь') || lowerMessage.includes('что ты можешь делать')) {
        return 'Я умею отвечать на вопросы и повторять твои сообщения!'
      }

    const codeExample = `// Пример функции на основе вашего запроса: "${message}"
function processMessage(text) {
  const result = text.toLowerCase().trim();
  return \`Обработано: \${result}\`;
}

const userInput = "${message}";
console.log(processMessage(userInput));`

    return `Вы написали: "${message}"\n\nВот пример кода, который обрабатывает ваш текст:\n\n\`\`\`javascript\n${codeExample}\n\`\`\``
}

function delay (ms: number): Promise<void> {
    return new Promise((resolve)=> setTimeout(resolve, ms))
}

function streamResponse(message: string, currentId: string | undefined, requestSignal?: AbortSignal): Response {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
        async start(controller){
            const botResponse = generateBotResponse(message)
            const words = botResponse.split(' ')
            for(let i = 0; i < words.length; i++){
                if(requestSignal?.aborted){
                    console.log('Stream aborted')
                    controller.close()
                    return
                }
                const word = words[i] + (i < words.length - 1 ? ' ' : '')
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: word })}\n\n`))
                await delay(400)
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
        },
        cancel() {
            console.log('Stream cancelled')
        }
    })
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    })
}







export async function POST(request: NextRequest){
    const body = await request.json()

    const {message, currentId, stream } = body

    if(!message){
        return NextResponse.json(
            {error:'message is required'},
            { status: 400}
        )
    }

    if(stream){
        return streamResponse(message, currentId, request.signal)
    }

    const botResponse = generateBotResponse(message)
    await delay(1000 + Math.random() * 1000)
    return NextResponse.json({
        message: botResponse,
        currentId: currentId || 'new-current-id'
    })
}



