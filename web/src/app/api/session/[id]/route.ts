import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }
  const session = await prisma.session.findUnique({
    where: { id },
    select: { id: true, topic: true, teacherMaterial: true, keyConcepts: true, createdAt: true },
  })
  if (!session) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  return NextResponse.json({
    id: session.id,
    topic: session.topic,
    teacherMaterial: session.teacherMaterial,
    keyConcepts: (session.keyConcepts ?? '').split(',').filter((s) => s.length > 0),
    createdAt: session.createdAt,
  })
}
