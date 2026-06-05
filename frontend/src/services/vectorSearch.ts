const embeddingCache = new Map<string, number[]>()

export async function getEmbedding(text: string, apiKey: string): Promise<number[]> {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`Embedding API 오류: ${error?.error?.message ?? response.statusText}`)
  }

  const data = await response.json()
  const embedding = data.data[0].embedding as number[]
  embeddingCache.set(text, embedding)
  return embedding
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dot = 0
  let magA = 0
  let magB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB)
  if (denom === 0) return 0
  return dot / denom
}