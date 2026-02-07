'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TopicPage() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const startingRef = useRef(false)
  const router = useRouter()

  const isReady = topic.trim().length > 0

  async function start() {
    if (!isReady || loading || startingRef.current) return
    startingRef.current = true
    setLoading(true)
    console.log('topic_start', { topic })
    const res = await fetch('/api/topic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    })
    const data = await res.json().catch(() => ({}))
    console.log('topic_response', { status: res.status, data })
    setLoading(false)
    startingRef.current = false
    if (data.sessionId) {
      router.push(`/lesson/${data.sessionId}`)
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">今日は何について学習しますか？</h1>
      <input
        className="mt-4 w-full rounded-xl border border-muted bg-surface p-3 text-text placeholder:text-muted focus:outline-none focus:ring-4 focus:ring-brand-200"
        placeholder="例: 量子コンピュータの基礎"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            start()
          }
        }}
      />
      {!isReady && (
        <p className="mt-2 text-sm text-muted">トピックを入力してください</p>
      )}
      <button
        className="mt-4 rounded-full bg-brand-500 px-5 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={start}
        disabled={loading || !isReady}
      >
        学習を始める →
      </button>
    </main>
  )
}
