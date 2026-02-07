import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateMaterial } from '@/lib/xai'
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const topic = typeof body.topic === 'string' ? body.topic.trim() : ''
  logger.info('topic_post', { topic })
  if (!topic) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  }

  const teacherMaterial = `先生が教材を作成中です。少々お待ちください。`
  const keyConcepts: string[] = []

  const canUseXai =
    typeof process.env.XAI_API_KEY === 'string' && process.env.XAI_API_KEY.trim().length > 0

  const session = await prisma.session.create({
    data: {
      topic,
      teacherMaterial,
      keyConcepts: keyConcepts.join(','),
      status: 'lesson',
    },
    select: { id: true, topic: true, teacherMaterial: true, keyConcepts: true },
  })
  logger.info('session_created', { id: session.id })

  if (canUseXai) {
    ;(async () => {
      try {
        logger.info('material_generate_start', { id: session.id })
        const gen = await generateMaterial(topic)
        if (gen && gen.material) {
          await prisma.session.update({
            where: { id: session.id },
            data: { teacherMaterial: gen.material, keyConcepts: gen.concepts.join(',') },
          })
          logger.info('material_updated', { id: session.id })
        }
      } catch {
        logger.warn('material_generate_failed', { id: session.id })
      }
    })()
  }

  return NextResponse.json({
    sessionId: session.id,
    topic: session.topic,
    teacherMaterial: session.teacherMaterial,
    keyConcepts,
  })
}
