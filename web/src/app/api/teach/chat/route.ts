import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
  const userMessage = typeof body.userMessage === 'string' ? body.userMessage : ''

  if (!sessionId || !userMessage) {
    return NextResponse.json({ error: 'sessionId and userMessage are required' }, { status: 400 })
  }

  const session = await prisma.session.findUnique({ where: { id: sessionId } })
  if (!session) {
    return NextResponse.json({ error: 'session not found' }, { status: 404 })
  }

  await prisma.message.create({
    data: { sessionId, role: 'user', content: userMessage },
  })

  const foolReply = `ねぇ、「${session.topic}」ってむずかしいの？もっとやさしく教えて。`
  await prisma.message.create({
    data: { sessionId, role: 'fool', content: foolReply },
  })

  const teacherNeedsIntervention = false
  const teacherReply = teacherNeedsIntervention
    ? '良い説明です！補足として重要な点を追加します。'
    : null

  if (teacherReply) {
    await prisma.message.create({
      data: { sessionId, role: 'teacher', content: teacherReply },
    })
  }

  return NextResponse.json({
    foolReply,
    ...(teacherReply ? { teacherReply } : {}),
  })
}
