import { useState, useCallback } from 'react'

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')

  const sendMessage = useCallback(
    async (
      messages: Array<{ role: 'user' | 'assistant'; content: string }>,
      onComplete: (content: string) => void,
      onError?: (error: Error) => void
    ) => {
      setIsStreaming(true)
      setStreamingContent('')

      try {
        console.log('Sending message to API:', { messageCount: messages.length })
        
        const response = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        })

        console.log('API response status:', response.status, response.statusText)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('API error response:', errorText)
          let errorData: any = null
          try {
            errorData = JSON.parse(errorText)
          } catch {
            // Not JSON
          }
          const errorMessage = errorData?.error || errorText.slice(0, 200) || `HTTP ${response.status}: ${response.statusText}`
          throw new Error(errorMessage)
        }

        const raw = await response.text()
        console.log('API raw response:', raw.substring(0, 200))
        
        let data: any = null
        try {
          data = JSON.parse(raw)
          console.log('API parsed response:', data)
        } catch {
          // Not JSON, use raw text
          console.log('Response is not JSON, using raw text')
        }

        const answer = data?.text || data?.content || raw || 'No response.'
        console.log('Final answer:', answer.substring(0, 200))
        
        if (!answer || answer.trim() === '') {
          throw new Error('Received empty response from API')
        }
        
        setStreamingContent(answer)
        onComplete(answer)
      } catch (error) {
        console.error('Error in sendMessage:', error)
        const err = error instanceof Error ? error : new Error('Unknown error')
        if (onError) {
          onError(err)
        } else {
          // Still call onComplete with error message so user sees it
          onComplete(`Sorry, I encountered an error: ${err.message}`)
        }
      } finally {
        setIsStreaming(false)
        setStreamingContent('')
      }
    },
    []
  )

  return {
    isStreaming,
    streamingContent,
    sendMessage,
  }
}

