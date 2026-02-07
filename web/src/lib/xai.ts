type Msg = { role: 'system' | 'user' | 'assistant'; content: string }

async function chat(messages: Msg): Promise<string>
async function chat(messages: Msg[]): Promise<string>
async function chat(messages: Msg | Msg[]): Promise<string> {
  const url = `${process.env.XAI_BASE_URL ?? 'https://api.x.ai/v1'}/chat/completions`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.XAI_API_KEY ?? ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.XAI_MODEL ?? 'grok-3-latest',
      messages: Array.isArray(messages) ? messages : [messages],
    }),
  })
  if (!res.ok) {
    throw new Error('XAI_REQUEST_FAILED')
  }
  const json = await res.json()
  const content = json?.choices?.[0]?.message?.content
  return typeof content === 'string' ? content : ''
}

export async function generateMaterial(topic: string): Promise<{ material: string; concepts: string[] }> {
  const sys: Msg = {
    role: 'system',
    content:
      'あなたは大学レベルの日本語の優秀な先生です。ユーザーが指定するトピックについて、詳細で体系的な教材をMarkdownで作成します。以下の要件に厳密に従ってください。\n\n' +
      '1. 形式: Markdown。見出しは「##」で統一。箇条書きを多用し、段落は短く。\n' +
      '2. 構成: \n' +
      '   - タイトル\n' +
      '   - ## 概要（100–150字）\n' +
      '   - ## キー概念（5–8項目：短い定義＋簡単な例）\n' +
      '   - ## 重要式・法則と直感（式はそのまま記述し、直感的説明を1–2文）\n' +
      '   - ## ステップで理解（3–5段階の学習ステップ）\n' +
      '   - ## 具体例（2–3個、できれば日常例）\n' +
      '   - ## 誤解しやすい点（3–5項目の注意）\n' +
      '   - ## 応用例（3–5件、実社会での活用）\n' +
      '   - ## 用語集（10語程度：用語｜短い説明）\n' +
      '   - ## ミニクイズ（3問：選択式、A/B/C、各正解を最後に明示）\n' +
      '   - ## 次に学ぶこと（3項目）\n' +
      '3. 文体: 丁寧で簡潔。比喩を適度に入れる。不要な前置きは書かない。\n' +
      '4. 出力言語: すべて日本語。\n',
  }
  const user: Msg = { role: 'user', content: topic }
  const material = await chat([sys, user])
  const concepts = extractConcepts(material)
  return { material, concepts }
}

export async function teacherAnswer(context: string, question: string): Promise<string> {
  const sys: Msg = {
    role: 'system',
    content:
      'あなたは先生です。教材内容を踏まえて、丁寧で正確に短く回答し、必要なら箇条書きでポイントを示してください。',
  }
  const user: Msg = { role: 'user', content: `教材:\n${context}\n\n質問:\n${question}` }
  return await chat([sys, user])
}

function extractConcepts(text: string): string[] {
  const lines = text.split('\n').map((l) => l.trim())
  const numbered = lines.filter((l) => /^(\d+)[\.\)．]/.test(l)).slice(0, 5)
  if (numbered.length > 0) {
    return numbered.map((l) => l.replace(/^(\d+)[\.\)．]\s*/, '').slice(0, 40))
  }
  const bullets = lines.filter((l) => /^[\-・•]/.test(l)).slice(0, 5)
  if (bullets.length > 0) {
    return bullets.map((l) => l.replace(/^[\-・•]\s*/, '').slice(0, 40))
  }
  return []
}
