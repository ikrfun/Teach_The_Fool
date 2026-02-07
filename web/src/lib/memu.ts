const BASE = process.env.MEMU_API_URL ?? 'https://api.memu.so'

export async function memorize(payload: unknown): Promise<unknown | null> {
  const key = process.env.MEMU_API_KEY ?? ''
  if (!key) return null
  const res = await fetch(`${BASE}/api/v3/memory/memorize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) return null
  return await res.json().catch(() => null)
}
