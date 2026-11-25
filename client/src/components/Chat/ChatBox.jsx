// client/src/components/Chat/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Sparkles, User, AlertCircle, Info, RotateCcw } from 'lucide-react'

export default function ChatBox({
  onSendMessage,
  messages = [],
  loading = false,
  error = null,
  onClearChat,
  currentAqi,
  profile,
}) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    onSendMessage(input.trim())
    setInput('')
  }

  const suggestedQuestions = [
    'Is it safe for my family to go outside today?',
    'When should I open my apartment windows?',
    'How do I build an effective DIY air purifier?',
    'Do cloth masks protect against PM2.5?',
    'What air purifier CADR rating do I need?',
  ]

  return (
    <div
      className="rounded-3xl p-5 sm:p-6 md:p-7 border shadow-sm flex flex-col h-[620px] transition-colors"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div className="pb-4 border-b flex items-center justify-between gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>Smog Advisor Assistant</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                Gemini Grounded
              </span>
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Personalized guidance grounded in {profile?.city || 'your profile'} &amp; AQI ({currentAqi || 'Live'})
            </p>
          </div>
        </div>

        {onClearChat && messages.length > 0 && (
          <button
            type="button"
            onClick={onClearChat}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 shrink-0"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Suggested question chips */}
      <div className="py-2.5 border-b overflow-x-auto scrollbar-none flex items-center gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="text-[11px] font-bold shrink-0 uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <Sparkles className="w-3 h-3 text-teal-500" aria-hidden="true" />
          Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(q)}
            disabled={loading}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-teal-500/40"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto py-4 space-y-4 pr-1"
        role="log"
        aria-live="polite"
        aria-label="Chat messages history"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                How can I help you navigate today's air quality?
              </p>
              <p className="text-xs mt-1 max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Ask about indoor air cleaning, commute safety, vulnerability precautions, or click any suggestion above.
              </p>
            </div>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isUser = m.role === 'user'
            const isError = Boolean(m.isError)

            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-teal-600 text-white shadow-xs'
                      : isError
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                      : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                  }`}
                  aria-hidden="true"
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div className="max-w-[85%] sm:max-w-[78%] space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-tr-none shadow-xs font-medium'
                        : isError
                        ? 'bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 rounded-tl-none font-medium'
                        : 'rounded-tl-none border shadow-xs'
                    }`}
                    style={
                      !isUser && !isError
                        ? {
                            backgroundColor: 'var(--bg-elevated)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }
                        : {}
                    }
                  >
                    {m.content}
                  </div>

                  {m.disclaimer && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 pl-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span>{m.disclaimer}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-2.5">
            <div
              className="w-7 h-7 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20"
              aria-hidden="true"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div
              className="rounded-2xl rounded-tl-none px-4 py-3 border flex items-center gap-1.5 shadow-xs"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></span>
              <span className="text-xs ml-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                Advisor is thinking…
              </span>
            </div>
          </div>
        )}

        {/* Inline error notice if error occurred outside history */}
        {error && !messages.some((m) => m.isError) && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="pt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about air purifiers, outdoor safety, masks…"
          aria-label="Ask a question about air quality"
          disabled={loading}
          className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs tracking-wide shadow-sm transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-500 inline-flex items-center gap-1.5"
          aria-label="Send message"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </form>

      {/* Persistent Medical Safety Line */}
      <div
        className="mt-3 py-2 px-3 text-[11px] rounded-xl border flex items-center justify-center gap-1.5 text-center"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
        <span>
          <strong>Medical Disclaimer:</strong> Provides environmental guidance, not medical advice. Consult a doctor for clinical conditions.
        </span>
      </div>
    </div>
  )
}
