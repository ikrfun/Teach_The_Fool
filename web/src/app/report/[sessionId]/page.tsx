import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export default async function ReportPage(props: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await props.params
  logger.info('report_params', { sessionId })
  if (!sessionId) redirect('/topic')
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { id: true, topic: true, createdAt: true },
  })
  const messages: { role: string; content: string }[] = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    select: { role: true, content: true },
  })

  if (!session) redirect('/topic')

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">学習レポート</h1>
      <div className="mt-2 text-sm text-gray-600">トピック: {session.topic}</div>
      <div className="mt-4 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="rounded border p-3">
            <strong className="mr-2">
              {m.role === 'fool' ? '🤪 お馬鹿さん' : m.role === 'teacher' ? '🎓 先生' : '👤 あなた'}
            </strong>
            {m.content}
          </div>
        ))}
      </div>
      <Link className="mt-6 inline-block rounded bg-pink-500 px-4 py-2 text-white" href="/topic">
        新しい学習を始める
      </Link>
    </main>
  )
}
