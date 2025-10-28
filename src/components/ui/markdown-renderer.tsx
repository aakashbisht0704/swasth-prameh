'use client'

import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const processedContent = useMemo(() => {
    // Split content into lines for processing
    const lines = content.split('\n')
    const processedLines: React.ReactElement[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]
      
      // Check for markdown tables
      if (line.includes('|') && line.trim().startsWith('|')) {
        const tableLines: string[] = []
        let j = i
        
        // Collect all table lines
        while (j < lines.length && lines[j].includes('|') && lines[j].trim().startsWith('|')) {
          tableLines.push(lines[j])
          j++
        }
        
        // Skip separator line (e.g., |---|---|)
        if (j < lines.length && lines[j].includes('|') && lines[j].includes('-')) {
          j++
        }
        
        // Render table
        if (tableLines.length > 0) {
          processedLines.push(
            <div key={`table-${i}`} className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-border rounded-lg">
                <tbody>
                  {tableLines.map((tableLine, idx) => {
                    const cells = tableLine.split('|').filter(cell => cell.trim() !== '')
                    return (
                      <tr key={idx} className={idx === 0 ? 'bg-muted font-medium' : 'hover:bg-muted/50'}>
                        {cells.map((cell, cellIdx) => (
                          <td 
                            key={cellIdx} 
                            className="border border-border px-3 py-2 text-sm"
                          >
                            {cell.trim()}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        }
        
        i = j
        continue
      }
      
      // Check for headers
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 1
        const text = line.replace(/^#+\s*/, '')
        const Tag = `h${Math.min(level, 6)}` as keyof React.JSX.IntrinsicElements
        
        processedLines.push(
          <Tag 
            key={`header-${i}`} 
            className={cn(
              'font-semibold mb-2 mt-4',
              level === 1 && 'text-xl',
              level === 2 && 'text-lg',
              level === 3 && 'text-base',
              level >= 4 && 'text-sm'
            )}
          >
            {text}
          </Tag>
        )
        i++
        continue
      }
      
      // Check for bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const listItems: string[] = []
        let j = i
        
        // Collect all list items
        while (j < lines.length && (lines[j].trim().startsWith('- ') || lines[j].trim().startsWith('* '))) {
          listItems.push(lines[j].trim().substring(2))
          j++
        }
        
        processedLines.push(
          <ul key={`list-${i}`} className="list-disc list-inside mb-3 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-sm">{item}</li>
            ))}
          </ul>
        )
        
        i = j
        continue
      }
      
      // Check for numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        const listItems: string[] = []
        let j = i
        
        // Collect all numbered items
        while (j < lines.length && /^\d+\.\s/.test(lines[j].trim())) {
          listItems.push(lines[j].trim().replace(/^\d+\.\s/, ''))
          j++
        }
        
        processedLines.push(
          <ol key={`olist-${i}`} className="list-decimal list-inside mb-3 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-sm">{item}</li>
            ))}
          </ol>
        )
        
        i = j
        continue
      }
      
      // Regular paragraph
      if (line.trim() !== '') {
        processedLines.push(
          <p key={`para-${i}`} className="mb-3 text-sm leading-relaxed">
            {line}
          </p>
        )
      } else {
        // Empty line for spacing
        processedLines.push(<div key={`empty-${i}`} className="h-2" />)
      }
      
      i++
    }
    
    return processedLines
  }, [content])

  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      {processedContent}
    </div>
  )
}

