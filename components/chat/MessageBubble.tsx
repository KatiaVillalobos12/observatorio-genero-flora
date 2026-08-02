'use client'

import { UIMessage } from 'ai'
import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageBubbleProps {
  message: UIMessage
  isLoading?: boolean
}

export function MessageBubble({ message, isLoading }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const textParts = message.parts?.filter((p: any) => p.type === 'text') || []
  const toolParts = message.parts?.filter((p: any) => p.type?.startsWith('tool-')) || []
  const hasText = textParts.some((p: any) => p.text?.trim())

  const handleCopy = () => {
    const text = textParts.map((p: any) => p.text).join('')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      flexDirection: isUser ? 'row-reverse' : 'row',
    }}>
      {/* Avatar */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: isUser ? 'rgba(83,102,255,0.08)' : 'var(--white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        border: isUser ? 'none' : '1px solid var(--line)',
      }}>
        {isUser ? (
          <span style={{ fontSize: '14px' }}>👩</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/flora-avatar.png" alt="Flora" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      
      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
        minWidth: 0,
      }}>
        {/* Tool Steps */}
        {toolParts.length > 0 && (
          <div style={{ width: '100%' }}>
            {toolParts.map((part: any, index: number) => (
              <ToolStep key={index} part={part} index={index + 1} />
            ))}
          </div>
        )}

        {/* Text Response */}
        {(hasText || (!isUser && !toolParts.length)) && (
          <div style={{
            padding: '12px 16px',
            borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            background: isUser ? 'var(--primary)' : 'var(--paper-dim)',
            color: isUser ? '#ffffff' : 'var(--ink)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: '100%',
            wordBreak: 'break-word',
          }}>
            {isLoading && !hasText ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ animation: 'pulse 1.5s infinite' }}>⏳</span>
                <span>Pensando...</span>
              </div>
            ) : (
              textParts.map((p: any, i: number) => (
                <div key={i} className="markdown-content">
                  <Markdown remarkPlugins={[remarkGfm]}>{p.text}</Markdown>
                </div>
              ))
            )}
          </div>
        )}

        {/* Copy button */}
        {!isUser && hasText && (
          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              color: 'var(--ink-soft)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 4px',
            }}
          >
            {copied ? '✓ Copiado' : '📋 Copiar'}
          </button>
        )}
      </div>
    </div>
  )
}

function ToolStep({ part, index }: { part: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const isRunning = part.state === 'input-streaming' || part.state === 'input-available'
  const isDone = part.state === 'output-available'
  const isError = part.state === 'output-error'

  const getCommand = () => {
    if (part.input?.command) {
      return String(part.input.command)
    }
    return ''
  }

  const getStatusColor = () => {
    if (isRunning) return { bg: 'rgba(83,102,255,0.05)', border: 'rgba(83,102,255,0.2)' }
    if (isDone) return { bg: 'rgba(63,143,95,0.06)', border: 'rgba(63,143,95,0.25)' }
    if (isError) return { bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.2)' }
    return { bg: 'var(--paper)', border: 'var(--line)' }
  }

  const colors = getStatusColor()

  return (
    <div style={{
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      background: colors.bg,
      overflow: 'hidden',
      marginBottom: '4px',
    }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--ink-soft)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Status indicator */}
        <div style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: isRunning ? 'var(--primary)' : isDone ? '#3F8F5F' : isError ? '#ef4444' : '#8A8390',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isRunning ? (
            <span style={{ fontSize: '10px', animation: 'spin 1s linear infinite' }}>⟳</span>
          ) : isDone ? (
            <span style={{ fontSize: '10px', color: '#fff' }}>✓</span>
          ) : isError ? (
            <span style={{ fontSize: '10px', color: '#fff' }}>✗</span>
          ) : (
            <span style={{ fontSize: '10px', color: '#fff' }}>{index}</span>
          )}
        </div>
        
        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
          {isRunning ? 'Ejecutando...' : isDone ? 'Completado' : isError ? 'Error' : 'Paso'}
        </span>
        
        {getCommand() && (
          <code style={{
            fontFamily: 'monospace',
            color: 'var(--primary)',
            background: 'rgba(83,102,255,0.08)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginLeft: 'auto',
          }}>
            {getCommand()}
          </code>
        )}
        
        {(isDone || isError) && (
          <span style={{ fontSize: '10px', color: '#8A8390' }}>
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
      </button>
      
      {isExpanded && (isDone || isError) && (
        <div style={{ padding: '0 12px 8px', borderTop: `1px solid ${colors.border}` }}>
          <button
            onClick={() => setShowResult(!showResult)}
            style={{
              fontSize: '10px',
              color: 'var(--ink-soft)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {showResult ? '▼ Ocultar salida' : '▶ Ver salida del comando'}
          </button>
          
          {showResult && part.output && (
            <pre style={{
              fontSize: '10px',
              color: '#374151',
              background: '#ffffff',
              border: '1px solid var(--line)',
              borderRadius: '6px',
              padding: '8px',
              maxHeight: '128px',
              overflow: 'auto',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              margin: 0,
            }}>
              {typeof part.output === 'object' ? (
                <>
                  {part.output.stdout && <div style={{ color: '#059669' }}>{part.output.stdout.slice(0, 800)}</div>}
                  {part.output.stderr && <div style={{ color: '#dc2626', marginTop: '4px' }}>{part.output.stderr.slice(0, 200)}</div>}
                  {part.output.exitCode !== 0 && (
                    <div style={{ color: '#d97706', marginTop: '4px' }}>Exit code: {part.output.exitCode}</div>
                  )}
                </>
              ) : (
                String(part.output).slice(0, 800)
              )}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
