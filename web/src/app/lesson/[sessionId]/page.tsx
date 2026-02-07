import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TeacherQA from '@/components/TeacherQA'

export default async function LessonPage(props: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await props.params
  if (!sessionId) redirect('/topic')
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { id: true, topic: true, teacherMaterial: true },
  })


  if (!session) redirect('/topic')

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">先生の授業: {session.topic}</h1>
      <TeacherQA sessionId={session.id} initialMaterial={session.teacherMaterial ?? ''} />
    </main>
  )
}
