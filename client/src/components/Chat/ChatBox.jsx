// client/src/components/Chat/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react'

export default function ChatBox({ onSendMessage, messages = [], loading, currentAqi, profile }) {
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
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-md flex flex-col h-[520px]">
      <div className="pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>💬</span> Smog Advisor Assistant
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ask any question with your current profile & AQI ({currentAqi}) context
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto py-4 space-y-3"
        role="log"
        aria-live="polite"
        aria-label="Chat messages history"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-4">
            <span className="text-3xl mb-2" aria-hidden="true">💡</span>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              No questions asked yet. Try a sample question:
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSendMessage(q)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-left transition focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isUser = m.role === 'user'
            return (
              <div
                key={idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none shadow-2xs'
                  }`}
                >
                  {m.content}
                </div>
                {m.disclaimer && (
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 max-w-[85%]">
                    {m.disclaimer}
                  </div>
                )}
              </div>
            )
          })
        )}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse p-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Advisor is thinking…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Safety Line */}
      <div className="py-2 text-[10px] text-center text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-2 border border-amber-200 dark:border-amber-900 mb-2">
        ⚠️ <strong>Medical Disclaimer:</strong> This assistant provides environmental guidance, not medical advice. Consult a licensed doctor for health conditions.
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about air purifiers, outdoor safety, masks…"
          aria-label="Ask a question about air quality"
          disabled={loading}
          className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-sm transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  )
}
