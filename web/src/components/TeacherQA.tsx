'use client'
import { useEffect, useRef, useState } from 'react'

type ChatMsg = { role: 'teacher' | 'user'; content: string }

export default function TeacherQA({ sessionId, initialMaterial }: { sessionId: string; initialMaterial: string }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: 'teacher', content: initialMaterial }])
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)
  const sendingRef = useRef(false)
  const pollingRef = useRef<number | null>(null)

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

  useEffect(() => {
    const isPlaceholder = (t: string) =>
      t.includes('先生が教材を作成中です')
    if (!isPlaceholder(initialMaterial)) return
    const tick = async () => {
      const res = await fetch(`/api/session/${sessionId}`)
      const data = await res.json().catch(() => ({}))
      const nextMaterial = String(data.teacherMaterial ?? '')
      if (nextMaterial && nextMaterial !== messages[0]?.content && !isPlaceholder(nextMaterial)) {
        setMessages((prev) => {
          const next = [...prev]
          if (next[0]?.role === 'teacher') {
            next[0] = { role: 'teacher', content: nextMaterial }
          } else {
            next.unshift({ role: 'teacher', content: nextMaterial })
          }
          return next
        })
        if (pollingRef.current) {
          clearInterval(pollingRef.current)
          pollingRef.current = null
        }
      }
    }
    pollingRef.current = window.setInterval(tick, 2000)
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  async function send() {
    if (!input.trim()) return
    if (sendingRef.current || loading) return
    sendingRef.current = true
    setLoading(true)
    const res = await fetch('/api/teacher/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message: input }),
    })
    const data = await res.json().catch(() => ({}))
    const teacherReply = String(data.reply ?? '')
    setMessages((prev) => {
      const next: ChatMsg[] = [...prev, { role: 'user', content: input }]
      if (teacherReply) next.push({ role: 'teacher', content: teacherReply })
      return next
    })
    setInput('')
    setLoading(false)
    sendingRef.current = false
  }

  return (
    <div className="relative mt-6">
      <div className="max-h-[60vh] overflow-y-auto p-4">
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-end ${m.role === 'teacher' ? 'justify-start' : 'justify-end'}`}>
              {m.role === 'teacher' && (
                <img
                  src="/teacher.png"
                  alt="teacher"
                  width={32}
                  height={32}
                  className="mr-2 h-8 w-8 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-soft ${
                  m.role === 'teacher' ? 'bg-brand-50 border border-brand-200' : 'bg-accent-50 border border-accent-200'
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
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-muted bg-bg/95 backdrop-blur">
        <div className="mx-auto max-w-2xl p-4">
          <div className="mb-3 flex justify-end">
            <a
              href={`/teach/${sessionId}`}
              className="inline-block rounded-full bg-accent-500 px-5 py-3 text-white hover:opacity-90"
            >
              理解した！お馬鹿さんに教える →
            </a>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-muted bg-surface p-3"
              placeholder="先生に質問を入力..."
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
              className="rounded-full bg-brand-500 px-5 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={send}
              disabled={loading || !input.trim()}
            >
              送信
            </button>
          </div>
        </div>
      </div>
      <div className="h-28" />
    </div>
  )
}
