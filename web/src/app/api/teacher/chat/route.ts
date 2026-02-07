import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { teacherAnswer } from '@/lib/xai'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
  const message = typeof body.message === 'string' ? body.message : ''
  if (!sessionId || !message) {
    return NextResponse.json({ error: 'sessionId and message are required' }, { status: 400 })
  }

  const session = await prisma.session.findUnique({ where: { id: sessionId } })
  if (!session) {
    return NextResponse.json({ error: 'session not found' }, { status: 404 })
  }

  await prisma.message.create({
    data: { sessionId, role: 'user', content: message },
  })

  let reply = `先生: 「${session.topic}」のポイントは3つです。教材の要点を復習しましょう。`
  const canUseXai =
    typeof process.env.XAI_API_KEY === 'string' && process.env.XAI_API_KEY.trim().length > 0
  if (canUseXai) {
    try {
      const r = await teacherAnswer(session.teacherMaterial ?? '', message)
      if (r && r.length > 0) reply = r
    } catch {
    }
  }
  await prisma.message.create({
    data: { sessionId, role: 'teacher', content: reply },
  })

  return NextResponse.json({ reply })
}
