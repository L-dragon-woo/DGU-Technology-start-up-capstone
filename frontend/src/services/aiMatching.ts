// src/services/aiMatching.ts
// 벡터 유사도 검색 + GPT-4o를 결합한 AI 공장 추천 서비스

import type { FactoryRecommendation } from '@/types'
import type { QuoteRequestDraft } from '@/stores/workflow'
import { mockFactoryRecommendations } from '@/data/factoryData'
import { mockFactoryDetails } from '@/data/factoryData'
import { rankByEmbedding } from './vectorSearch'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string

// 벡터 검색 후 GPT-4o에 전달할 상위 공장 수
const TOP_K = 4

// ─────────────────────────────────────────────
// 텍스트 변환 (임베딩용)
// ─────────────────────────────────────────────

/**
 * 공장 데이터를 임베딩용 자연어 텍스트로 변환합니다.
 * 공장 상세 데이터가 있으면 우선 사용하고, 없으면 추천 데이터로 대체합니다.
 */
function buildFactoryDescription(id: string): string {
  const detail = mockFactoryDetails[id]

  if (detail) {
    return [
      `공장명: ${detail.name}`,
      `위치: ${detail.location}`,
      `전문 공정: ${detail.specialty.join(', ')}`,
      `보유 설비: ${detail.equipment.join(', ')}`,
      `생산 가능 품목: ${detail.products.join(', ')}`,
      `월 생산 가능량: ${detail.monthlyCapacity}`,
      `납기 준수율: ${detail.kpi.deliveryRate}%`,
      `품질 만족도: ${detail.kpi.qualitySatisfaction}점`,
      `재거래율: ${detail.kpi.reorderRate}%`,
      `평균 응답 시간: ${detail.kpi.avgResponseTime}`,
      `주요 고객사: ${detail.clients.join(', ')}`
    ].join('\n')
  }

  // 상세 데이터가 없는 공장은 추천 데이터로 설명 생성
  const rec = mockFactoryRecommendations.find((r) => r.id === id)
  if (rec) {
    return [
      `공장명: ${rec.name}`,
      `위치: ${rec.location}`,
      `전문 공정: ${rec.processes.join(', ')}`,
      `납기 준수율: ${rec.deliveryRate}%`,
      `재거래율: ${rec.reorderRate}%`,
      `품질 점수: ${rec.qualityScore}점`,
      `납기 점수: ${rec.deliveryScore}점`,
      `가격 경쟁력: ${rec.priceCompetitiveness}점`
    ].join('\n')
  }

  return `공장 ID: ${id}`
}

/**
 * 발주 요청을 임베딩용 자연어 텍스트로 변환합니다.
 */
function buildRequestDescription(request: QuoteRequestDraft): string {
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

// ─────────────────────────────────────────────
// GPT-4o 호출
// ─────────────────────────────────────────────

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

/**
 * GPT-4o에게 발주 요청과 후보 공장 목록을 전달하여
 * 각 공장에 대한 추천 이유와 점수를 생성합니다.
 */
async function callGPT4o(
  request: QuoteRequestDraft,
  factoryIds: string[]
): Promise<GPTMatchResult[]> {
  const factoryList = factoryIds
    .map((id, i) => `[공장 ${i + 1}]\nID: ${id}\n${buildFactoryDescription(id)}`)
    .join('\n\n')

  const prompt = `당신은 뿌리산업 B2B 수주 매칭 전문가입니다.
발주처의 요청 조건을 분석하여 각 공장의 적합도를 평가해주세요.

[발주처 요청 조건]
${buildRequestDescription(request)}

[후보 공장 목록]
${factoryList}

각 공장에 대해 아래 JSON 형식으로만 응답하세요. 마크다운 코드블록 없이 순수 JSON만 출력하세요.
{
  "matches": [
    {
      "id": "공장 ID (그대로 복사)",
      "aiReason": "이 요청에 이 공장을 추천하는 핵심 이유 2문장 (한국어, 발주 조건과 공장 역량을 구체적으로 연결할 것)",
      "qualityScore": 85,
      "deliveryScore": 90,
      "priceCompetitiveness": 80,
      "trustScore": 88,
      "estimateMin": 350,
      "estimateMax": 450
    }
  ]
}

평가 기준:
- qualityScore: 품질 만족도와 이번 요청의 품질 기준 부합도 (0~100)
- deliveryScore: 납기 준수율과 희망 납기 대응 가능성 (0~100)
- priceCompetitiveness: 요청 예산 범위 내 가격 경쟁력 (0~100)
- trustScore: 거래 이력, 재거래율, 응답성을 반영한 종합 신뢰도 (0~100)
- estimateMin / estimateMax: 이 요청에 대한 예상 견적 범위 (만원 단위 정수, 예산 범위 참고)`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3, // 일관성 있는 결과를 위해 낮게 설정
      response_format: { type: 'json_object' }
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`GPT-4o API 오류: ${error?.error?.message ?? response.statusText}`)
  }

  const data = await response.json()
  const parsed = JSON.parse(data.choices[0].message.content)
  return parsed.matches as GPTMatchResult[]
}

// ─────────────────────────────────────────────
// 메인 함수
// ─────────────────────────────────────────────

/**
 * 발주 요청을 입력받아 AI 추천 공장 목록을 반환합니다.
 *
 * [처리 흐름]
 * 1단계 - 벡터 유사도 검색: 요청과 공장 데이터를 임베딩하여 상위 K개 공장 선별
 * 2단계 - GPT-4o 분석: 선별된 공장에 대한 추천 이유 및 점수 생성
 * 3단계 - 결과 조합: GPT 결과와 기존 공장 데이터를 합쳐 FactoryRecommendation 반환
 */
export async function matchFactories(
  request: QuoteRequestDraft
): Promise<FactoryRecommendation[]> {
  // 사용 가능한 모든 공장 ID 수집
  const allIds = mockFactoryRecommendations.map((r) => r.id)

  // 1단계: 벡터 유사도 검색으로 상위 K개 공장 선별
  const requestText = buildRequestDescription(request)
  const ranked = await rankByEmbedding(requestText, allIds, buildFactoryDescription)
  const topIds = ranked.slice(0, TOP_K).map((r) => r.item)

  // 2단계: GPT-4o로 추천 이유 및 점수 생성
  const gptResults = await callGPT4o(request, topIds)

  // 3단계: GPT 결과와 기존 공장 데이터를 합쳐 최종 결과 생성
  return gptResults.map((gpt) => {
    const rec = mockFactoryRecommendations.find((r) => r.id === gpt.id)
    const detail = mockFactoryDetails[gpt.id]

    const name = detail?.name ?? rec?.name ?? `공장 ${gpt.id}`
    const location = detail?.location ?? rec?.location ?? '위치 미상'
    const processes = detail?.specialty.slice(0, 2) ?? rec?.processes ?? []

    return {
      id: gpt.id,
      name,
      location,
      processes,
      trustScore: gpt.trustScore,
      deliveryRate: detail?.kpi.deliveryRate ?? rec?.deliveryRate ?? 90,
      reorderRate: detail?.kpi.reorderRate ?? rec?.reorderRate ?? 80,
      estimateMin: gpt.estimateMin,
      estimateMax: gpt.estimateMax,
      aiReason: gpt.aiReason,
      qualityScore: gpt.qualityScore,
      deliveryScore: gpt.deliveryScore,
      priceCompetitiveness: gpt.priceCompetitiveness
    } satisfies FactoryRecommendation
  })
}
