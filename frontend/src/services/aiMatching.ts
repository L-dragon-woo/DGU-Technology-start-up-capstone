import type { FactoryRecommendation } from '@/types'
import type { QuoteRequestDraft } from '@/stores/workflow'
import { cosineSimilarity, getEmbedding } from './vectorSearch'

const BACKEND_URL = 'http://localhost:8080'
const TOP_K = 4

interface RawFactory {
  id: number
  certNo: string
  name: string
  ceo: string
  industry: string
  coreSkill: string
  region: string
}

function factoryToDescription(factory: RawFactory): string {
  return [
    `공장명: ${factory.name}`,
    `분야: ${factory.industry}`,
    `핵심뿌리기술: ${factory.coreSkill}`,
    `지역: ${factory.region}`
  ].join('\n')
}

function requestToDescription(request: QuoteRequestDraft): string {
  return [
    `프로젝트명: ${request.projectName}`,
    `공정 유형: ${request.processType}`,
    `제작 품목: ${request.productItem}`,
    `예상 수량: ${request.estimatedQuantity}`,
    `희망 납기: ${request.desiredDeadline}`,
    `예산 범위: ${request.budgetRange}`,
    `상세 요구사항: ${request.detailRequirements}`
  ].join('\n')
}

async function rankFactories(
  requestText: string,
  factories: RawFactory[],
  apiKey: string
): Promise<RawFactory[]> {
  const queryEmbedding = await getEmbedding(requestText, apiKey)

  const scored = await Promise.all(
    factories.map(async (factory) => {
      const embedding = await getEmbedding(factoryToDescription(factory), apiKey)
      const similarity = cosineSimilarity(queryEmbedding, embedding)
      return { factory, similarity }
    })
  )

  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, TOP_K)
    .map((r) => r.factory)
}

interface GPTMatchResult {
  id: string
  aiReason: string
  qualityScore: number
  deliveryScore: number
  priceCompetitiveness: number
  trustScore: number
  estimateMin: number
  estimateMax: number
}

async function getApiKey(): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/api/config/openai-key`)
  const data = await response.json() as { apiKey: string }
  return data.apiKey
}

async function callGPT4o(
  request: QuoteRequestDraft,
  factories: RawFactory[],
  apiKey: string
): Promise<GPTMatchResult[]> {
  const factoryList = factories
    .map((f) => `ID: ${f.id}\n${factoryToDescription(f)}`)
    .join('\n\n')

  const prompt = `당신은 뿌리산업 B2B 수주 매칭 전문가입니다.
발주처의 요청 조건을 분석하여 각 공장의 적합도를 평가해주세요.

[발주처 요청 조건]
${requestToDescription(request)}

[후보 공장 목록]
${factoryList}

각 공장에 대해 아래 JSON 형식으로만 응답하세요. 마크다운 코드블록 없이 순수 JSON만 출력하세요.
{
  "matches": [
    {
      "id": "반드시 위에 제공된 숫자 ID 그대로 복사. 예: 1, 2, 3",
      "aiReason": "추천 이유 2문장 (한국어)",
      "qualityScore": 85,
      "deliveryScore": 90,
      "priceCompetitiveness": 80,
      "trustScore": 88,
      "estimateMin": 350,
      "estimateMax": 450
    }
  ]
}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
  })

  const data = await response.json() as { choices: { message: { content: string } }[] }
  const parsed = JSON.parse(data.choices[0].message.content) as { matches: GPTMatchResult[] }
  return parsed.matches
}

export async function matchFactories(
  request: QuoteRequestDraft
): Promise<FactoryRecommendation[]> {
  // 1단계: 백엔드에서 API 키 가져오기
  const apiKey = await getApiKey()

  // 2단계: 백엔드에서 공장 데이터 가져오기
  const response = await fetch(`${BACKEND_URL}/api/factories`)
  const factories = await response.json() as RawFactory[]

  if (!factories || factories.length === 0) {
    throw new Error('공장 데이터가 없습니다.')
  }

  // 3단계: 랜덤 샘플링 (100개)
  // const sampled = factories.sort(() => Math.random() - 0.5).slice(0, 100)

  // 4단계: 벡터 유사도로 상위 K개 선별 ()_위와 아래는 샘플링 있는 버전
  // const topFactories = await rankFactories(requestToDescription(request), sampled, apiKey)

  // 3단계: 벡터 유사도로 상위 K개 선별_샘플링 없는 버전
  const topFactories = await rankFactories(requestToDescription(request), factories, apiKey)

  // 5단계: GPT-4o로 추천 이유 및 점수 생성
  const gptResults = await callGPT4o(request, topFactories, apiKey)

  // 6단계: 결과 조합
  return gptResults.map((gpt, index) => {
    const factory = topFactories.find((f) => String(f.id) === String(gpt.id))
      ?? topFactories[index]
      ?? topFactories[0]
    return {
      id: String(factory.id),
      name: factory.name,
      location: factory.region,
      processes: [factory.industry],
      trustScore: gpt.trustScore,
      deliveryRate: 90,
      reorderRate: 80,
      estimateMin: gpt.estimateMin,
      estimateMax: gpt.estimateMax,
      aiReason: gpt.aiReason,
      qualityScore: gpt.qualityScore,
      deliveryScore: gpt.deliveryScore,
      priceCompetitiveness: gpt.priceCompetitiveness
    } satisfies FactoryRecommendation
  })
}