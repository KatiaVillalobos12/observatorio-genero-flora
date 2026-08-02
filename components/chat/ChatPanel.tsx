'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { MessageBubble } from './MessageBubble'
import { FREE_MODELS, DEFAULT_MODEL } from '@/lib/openrouter'

const SUGGESTED_QUESTIONS = [
  '¿Cuál es la brecha de matrícula femenina en carreras STEM?',
  '¿Qué estudios hay sobre acoso y hostigamiento sexual en universidades?',
  '¿Qué buenas prácticas existen para atraer mujeres a carreras STEM?',
  '¿Cómo ha evolucionado el porcentaje de mujeres investigadoras en el Perú?',
]

export function ChatPanel() {
  const [apiKey, setApiKey] = useState('')
  const [savedApiKey, setSavedApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [showSettings, setShowSettings] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const transport = useMemo(() => new DefaultChatTransport({
    api: '/api/chat',
    body: {
      apiKey: savedApiKey,
      model: selectedModel,
    },
  }), [savedApiKey, selectedModel])

  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    const storedKey = localStorage.getItem('openrouter_api_key')
    const storedModel = localStorage.getItem('openrouter_model')
    if (storedKey) {
      setSavedApiKey(storedKey)
      setApiKey(storedKey)
    } else {
      setShowSettings(true)
    }
    if (storedModel) setSelectedModel(storedModel)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSaveKey = () => {
    localStorage.setItem('openrouter_api_key', apiKey)
    localStorage.setItem('openrouter_model', selectedModel)
    setSavedApiKey(apiKey)
    setShowSettings(false)
  }

  const handleSend = (text?: string) => {
    const value = (text ?? inputValue).trim()
    if (!value || isLoading || !savedApiKey) return
    sendMessage({ text: value })
    setInputValue('')
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--white)',
      borderRadius: '16px',
      border: '1px solid var(--line)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--paper-dim)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/flora-avatar.png" alt="Flora" style={{
            width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, objectFit: 'cover',
          }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>Flora</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
              {savedApiKey ? `Modelo: ${FREE_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}` : 'Configura tu API key para empezar'}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            width: '34px', height: '34px', borderRadius: '8px', border: '1px solid var(--line)',
            background: '#fff', cursor: 'pointer', fontSize: '16px',
          }}
          aria-label="Configuración"
        >⚙️</button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', background: 'var(--paper)' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
            API key de OpenRouter
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              style={{
                flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--line)',
                fontSize: '0.85rem', fontFamily: 'monospace',
              }}
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              style={{ padding: '0 10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', cursor: 'pointer' }}
            >{showApiKey ? '🙈' : '👁️'}</button>
          </div>

          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
            Modelo
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--line)',
              fontSize: '0.85rem', marginBottom: '12px', background: '#fff',
            }}
          >
            {FREE_MODELS.filter(m => !m.paid).map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <button
            onClick={handleSaveKey}
            disabled={!apiKey}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
              background: apiKey ? 'var(--primary)' : 'var(--line)', color: '#fff', fontWeight: 600,
              cursor: apiKey ? 'pointer' : 'not-allowed', fontSize: '0.85rem',
            }}
          >
            Guardar y empezar
          </button>
          <p style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', marginTop: '8px' }}>
            Tu key se guarda solo en tu navegador (localStorage) y se envía directo a OpenRouter. Consíguela en{' '}
            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>openrouter.ai/keys</a>.
          </p>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.length === 0 && (
          <div style={{ margin: 'auto', maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ marginBottom: '8px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/flora-avatar.png" alt="Flora" style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto', objectFit: 'cover' }} />
            </div>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '16px' }}>
              ¡Hola! Soy Flora. Pregúntame sobre indicadores, estudios o buenas prácticas de igualdad de género en educación superior.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={!savedApiKey}
                  style={{
                    textAlign: 'left', padding: '10px 14px', borderRadius: '10px',
                    border: '1px solid var(--line)', background: 'var(--paper)',
                    color: 'var(--ink)', fontSize: '0.82rem', cursor: savedApiKey ? 'pointer' : 'not-allowed',
                  }}
                >{q}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} isLoading={isLoading && m.id === messages[messages.length - 1]?.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--line)', display: 'flex', gap: '8px' }}>
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={savedApiKey ? 'Escribe tu pregunta...' : 'Configura tu API key arriba primero'}
          disabled={!savedApiKey}
          rows={1}
          style={{
            flex: 1, resize: 'none', padding: '10px 14px', borderRadius: '10px',
            border: '1px solid var(--line)', fontSize: '0.9rem', fontFamily: 'inherit', maxHeight: '120px',
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!savedApiKey || isLoading || !inputValue.trim()}
          style={{
            padding: '0 18px', borderRadius: '10px', border: 'none',
            background: savedApiKey && !isLoading && inputValue.trim() ? 'var(--primary)' : 'var(--line)',
            color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
          }}
        >
          {isLoading ? '…' : 'Enviar'}
        </button>
      </div>
    </div>
  )
}
