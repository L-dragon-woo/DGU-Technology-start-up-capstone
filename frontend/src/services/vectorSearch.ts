// src/services/vectorSearch.ts
// OpenAI 임베딩 API를 활용한 벡터 유사도 검색
// 주의: API 키가 프론트엔드에 노출됩니다. 캡스톤 프로젝트용이므로 허용하되,
//       실제 서비스에서는 반드시 백엔드 서버를 통해 호출해야 합니다.

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string

// 동일 텍스트에 대한 중복 API 호출을 방지하는 인메모리 캐시
const embeddingCache = new Map<string, number[]>()

/**
 * 텍스트를 OpenAI Embeddings API로 벡터(숫자 배열)로 변환합니다.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small', // 비용 효율적인 임베딩 모델
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

/**
 * 두 벡터 간의 코사인 유사도를 계산합니다.
 * 반환값: -1(완전 반대) ~ 1(완전 일치)
 */
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

/**
 * 쿼리 텍스트와 아이템 목록을 임베딩하여 유사도 내림차순으로 정렬합니다.
 * @param queryText 검색 기준 텍스트 (발주 요청)
 * @param items 비교할 아이템 배열
 * @param getDescription 각 아이템을 텍스트로 변환하는 함수
 */
export async function rankByEmbedding<T>(
  queryText: string,
  items: T[],
  getDescription: (item: T) => string
): Promise<Array<{ item: T; similarity: number }>> {
  // 요청 텍스트와 모든 공장 설명을 동시에 임베딩 (병렬 처리)
  const [queryEmbedding, ...itemEmbeddings] = await Promise.all([
    getEmbedding(queryText),
    ...items.map((item) => getEmbedding(getDescription(item)))
  ])

  const ranked = items.map((item, i) => ({
    item,
    similarity: cosineSimilarity(queryEmbedding, itemEmbeddings[i])
  }))

  return ranked.sort((a, b) => b.similarity - a.similarity)
}
