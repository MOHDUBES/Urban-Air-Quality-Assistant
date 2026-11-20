// client/src/components/Chat/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Sparkles, User, AlertCircle, Info } from 'lucide-react'

export default function ChatBox({
  onSendMessage,
  messages = [],
  loading,
  currentAqi,
  _profile,
}) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    onSendMessage(input.trim())
    setInput('')
  }

  const suggestedQuestions = [
    'Is it safe for my child to play outside today?',
    'When should I open my apartment windows?',
    'How do I build a DIY air purifier?',
    'Do cloth masks protect against PM2.5?',
    'What air purifier CADR rating do I need?',
  ]

  return (
    <div
      className="bg-white dark:bg-navy-850 rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col h-[600px] transition-colors"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Smog Advisor Assistant
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                Gemini Grounded
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized guidance grounded in your profile & ambient AQI ({currentAqi || 'Live'})
            </p>
          </div>
        </div>
      </div>

      {/* Suggested question chips (horizontally scrollable / wrapped) */}
      <div className="py-3 border-b border-slate-100 dark:border-white/5 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 shrink-0 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-teal-500" aria-hidden="true" />
          Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(q)}
            disabled={loading}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 border border-slate-200/60 dark:border-white/5"
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
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                How can I help you navigate today's air quality?
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Ask about indoor air cleaning, commute safety, vulnerability precautions, or click any suggestion above.
              </p>
            </div>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isUser = m.role === 'user'

            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 dark:bg-navy-800 text-teal-600 dark:text-teal-400 border border-slate-300 dark:border-white/10'
                  }`}
                  aria-hidden="true"
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[82%] sm:max-w-[75%] space-y-1`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-tr-none shadow-xs'
                        : 'bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-white/10 shadow-xs'
                    }`}
                  >
                    {m.content}
                  </div>

                  {m.disclaimer && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 pl-1">
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
              className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-navy-800 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-slate-300 dark:border-white/10"
              aria-hidden="true"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-100 dark:bg-navy-800 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-200/80 dark:border-white/10 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></span>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 font-medium">
                Advisor is thinking…
              </span>
            </div>
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
          className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
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
      <div className="mt-3 py-2 px-3 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-navy-900 rounded-xl border border-slate-200/60 dark:border-white/5 flex items-center justify-center gap-1.5 text-center">
        <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
        <span>
          <strong>Medical Disclaimer:</strong> Provides environmental guidance, not medical advice. Consult a doctor for clinical conditions.
        </span>
      </div>
    </div>
  )
}
