import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, topic: true, createdAt: true, status: true },
  })
  return NextResponse.json({ sessions })
}
