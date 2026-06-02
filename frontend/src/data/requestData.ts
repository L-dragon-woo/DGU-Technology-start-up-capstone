import type { ReceivedQuoteRequest } from '@/types'

export const mockReceivedQuoteRequests: ReceivedQuoteRequest[] = [
  {
    id: 'req-001',
    projectName: '알루미늄 하우징 시제품 제작',
    clientName: '루트테크',
    processType: '금형 / CNC 정밀가공',
    productItem: '전장 모듈용 알루미늄 케이스',
    quantity: '1차 500개, 양산 월 3,000개',
    budgetRange: '3,000만원 ~ 4,500만원',
    desiredDeadline: '2026년 5월 20일',
    requestedAt: '2026.04.28 14:20',
    status: 'new',
    description:
      '6061 알루미늄 소재 기준으로 CNC 정밀가공과 표면 아노다이징 처리가 필요합니다. 외관 스크래치 기준이 엄격하며, 초도품 검수 후 양산 전환 예정입니다.',
    attachments: [
      { id: 'att-001', name: 'housing_2d_drawing.pdf', url: '#', size: 2400000, type: 'application/pdf' },
      { id: 'att-002', name: 'housing_3d_model.step', url: '#', size: 8200000, type: 'model/step' }
    ]
  },
  {
    id: 'req-002',
    projectName: '스틸 브라켓 양산 견적 요청',
    clientName: '세명모빌리티',
    processType: '소성가공 / 표면처리',
    productItem: '차량용 스틸 브라켓',
    quantity: '월 10,000개',
    budgetRange: '월 7,000만원 내외',
    desiredDeadline: '2026년 6월 10일',
    requestedAt: '2026.04.27 09:40',
    status: 'reviewing',
    description:
      '프레스 성형 후 아연도금 처리가 필요합니다. 양산 전 PPAP 수준의 검사 성적서 제출이 가능한 업체를 찾고 있습니다.',
    attachments: [
      { id: 'att-003', name: 'bracket_specification.xlsx', url: '#', size: 920000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    ]
  },
  {
    id: 'req-003',
    projectName: '설비 커버 용접 제작',
    clientName: '디에스오토메이션',
    processType: '용접 / 도장',
    productItem: '산업용 설비 커버',
    quantity: '초도 30세트',
    budgetRange: '1,200만원 ~ 1,800만원',
    desiredDeadline: '2026년 5월 30일',
    requestedAt: '2026.04.25 16:05',
    status: 'quoted',
    description:
      'SS400 판재 절곡 및 용접 후 분체도장 마감이 필요합니다. 설치 현장 납품 가능 여부도 함께 검토해 주세요.',
    attachments: [
      { id: 'att-004', name: 'cover_layout.pdf', url: '#', size: 3100000, type: 'application/pdf' }
    ]
  }
]
