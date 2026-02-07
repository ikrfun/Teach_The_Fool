'use client'
import { useEffect, useRef, useState } from 'react'

type Msg = { role: 'fool' | 'user' | 'teacher'; content: string }

export default function TeachPage({ params }: { params: { sessionId: string } }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)
  const sendingRef = useRef(false)
  const reportUrl = `/report/${params.sessionId}`

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
  function mdToHtml(md: string): string {
    let t = escapeHtml(md)
    t = t.replace(/^###\s?(.*)$/gm, '<h3>$1</h3>')
    t = t.replace(/^##\s?(.*)$/gm, '<h2>$1</h2>')
    t = t.replace(/^#\s?(.*)$/gm, '<h1>$1</h1>')
    t = t.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>')
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    t = t.replace(/^- (.*)$/gm, '<li>$1</li>')
    t = t.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    t = t.replace(/\n/g, '<br/>')
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    return t
  }

  async function send() {
    if (!input.trim()) return
    if (sendingRef.current || loading) return
    sendingRef.current = true
    setLoading(true)
    const res = await fetch('/api/teach/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: params.sessionId, userMessage: input }),
    })
    const data = await res.json()
    setLoading(false)
    setMessages((prev) => {
      const next: Msg[] = [...prev, { role: 'user', content: input }, { role: 'fool', content: String(data.foolReply ?? '') }]
      if (typeof data.teacherReply === 'string' && data.teacherReply.length > 0) {
        next.push({ role: 'teacher', content: data.teacherReply })
      }
      return next
    })
    setInput('')
    sendingRef.current = false
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">教室</h1>
      <div className="mt-4 max-h-[60vh] overflow-y-auto p-4">
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-end ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role !== 'user' && (
                <img
                  src={m.role === 'teacher' ? '/teacher.png' : '/fool.png'}
                  alt={m.role}
                  width={32}
                  height={32}
                  className="mr-2 h-8 w-8 rounded-full object-cover"
                />
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-soft ${
                  m.role === 'teacher'
                    ? 'bg-brand-50 border border-brand-200'
                    : m.role === 'fool'
                    ? 'bg-accent-50 border border-accent-200'
                    : 'bg-surface border border-muted'
                }`}
              >
                {m.role === 'teacher' ? (
                  <div className="prose mt-1 max-w-none" dangerouslySetInnerHTML={{ __html: mdToHtml(m.content) }} />
                ) : (
                  <div className="mt-1 whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
              {m.role === 'user' && (
                <img
                  src="/user.png"
                  alt="you"
                  width={32}
                  height={32}
                  className="ml-2 h-8 w-8 rounded-full object-cover"
                />
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-muted bg-bg/95 backdrop-blur">
        <div className="mx-auto max-w-2xl p-4">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-muted bg-surface p-3"
              placeholder="お馬鹿さんに教える…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
            />
            <button
              className="rounded-full bg-pink-500 px-5 py-3 text-white disabled:opacity-50"
              onClick={send}
              disabled={loading || !input.trim()}
            >
              送信
            </button>
            <a className="rounded-full bg-gray-800 px-5 py-3 text-white" href={reportUrl}>
              会話を終了
            </a>
          </div>
        </div>
      </div>
      <div className="h-28" />
    </main>
  )
}
