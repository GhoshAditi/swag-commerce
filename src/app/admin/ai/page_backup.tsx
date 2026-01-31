'use client'

import { useState } from 'react'

export default function AdminAICopilot() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const askAI = async () => {
    if (!question.trim()) return
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/api/admin/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      if (!res.ok) {
        throw new Error('API error')
      }

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        `🧑‍💼 ${question}`,
        `🤖 ${data.response}`,
      ])

      setQuestion('')
    } catch (err) {
      setMessages(prev => [
        ...prev,
        `🧑‍💼 ${question}`,
        `❌ Failed to get AI response`,
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin AI Copilot</h1>

      <div className="border rounded p-4 h-96 overflow-y-auto mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-20">
            Ask me anything about your store...
          </p>
        ) : (
          messages.map((m, i) => (
            <p key={i} className="mb-2 whitespace-pre-wrap">{m}</p>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="border flex-1 p-2 rounded"
          placeholder="Ask something..."
          disabled={loading}
        />
        <button
          onClick={askAI}
          disabled={loading || !question.trim()}
          className="bg-black text-white px-4 rounded disabled:bg-gray-400"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>
    </div>
  )
}
