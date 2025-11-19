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
        const response = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          let errorData: any = null
          try {
            errorData = JSON.parse(errorText)
          } catch {
            // Not JSON
          }
          throw new Error(errorData?.error || errorText.slice(0, 200) || 'Chat error')
        }

        const raw = await response.text()
        let data: any = null
        try {
          data = JSON.parse(raw)
        } catch {
          // Not JSON, use raw text
        }

        const answer = data?.text || raw || 'No response.'
        setStreamingContent(answer)
        onComplete(answer)
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error')
        if (onError) {
          onError(err)
        } else {
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

