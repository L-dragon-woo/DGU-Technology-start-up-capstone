export type DisputeStatus = 'reviewing' | 'proposal' | 'waiting' | 'resolved'

export interface DisputeStep {
  title: string
  description: string
  completed: boolean
}

export interface DisputeTimelineItem {
  title: string
  date: string
  description: string
}

export interface DisputeCase {
  id: string
  projectName: string
  counterparty: string
  type: string
  status: DisputeStatus
  statusLabel: string
  requestedAt: string
  nextAction: string
  amount: string
  mediator: string
  progress: number
  updatedAt: string
  requester: string
  respondent: string
  contractDate: string
  dueDate: string
  summary: string
  requestedResolution: string
  evidenceFiles: string[]
  steps: DisputeStep[]
  timeline: DisputeTimelineItem[]
}

export const disputeStatusStyles: Record<DisputeStatus, string> = {
  reviewing: 'bg-blue-50 text-blue-700 ring-blue-100',
  proposal: 'bg-amber-50 text-amber-700 ring-amber-100',
  waiting: 'bg-violet-50 text-violet-700 ring-violet-100',
  resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-100'
}

export const disputeCases: DisputeCase[] = [
  {
    id: 'DSP-2026-014',
    projectName: '알루미늄 하우징 시제품 제작',
    counterparty: '문래정밀가공',
    type: '품질 불량',
    status: 'reviewing',
    statusLabel: '자료 검토 중',
    requestedAt: '2026.05.21',
    nextAction: '검수 결과서와 납품 사진 비교 검토',
    amount: '4,200,000원',
    mediator: '플랫폼 중재팀',
    progress: 45,
    updatedAt: '2026.05.27 14:20',
    requester: '루트테크',
    respondent: '문래정밀가공',
    contractDate: '2026.04.28',
    dueDate: '2026.05.20',
    summary: '납품된 알루미늄 하우징 일부에서 표면 스크래치와 치수 오차가 확인되어 검수 승인이 보류되었습니다.',
    requestedResolution: '불량 수량 재제작 또는 해당 수량만큼 대금 감액 조정',
    evidenceFiles: ['incoming_inspection_report.pdf', 'defect_photo_set.zip', 'delivery_chat_history.xlsx'],
    steps: [
      { title: '분쟁 접수', description: '요청 내용과 거래 정보를 접수했습니다.', completed: true },
      { title: '자료 검토', description: '검수 자료와 납품 사진을 비교하고 있습니다.', completed: true },
      { title: '조정안 제시', description: '양측 입장을 반영한 조정안을 작성합니다.', completed: false },
      { title: '합의 또는 후속 절차', description: '합의 결과를 확정하거나 후속 절차를 안내합니다.', completed: false }
    ],
    timeline: [
      { title: '중재 요청 접수', date: '2026.05.21 10:30', description: '품질 불량 사유로 중재가 접수되었습니다.' },
      { title: '증빙 자료 업로드', date: '2026.05.21 10:45', description: '검수 결과서, 하자 사진, 채팅 기록이 제출되었습니다.' },
      { title: '담당 중재자 배정', date: '2026.05.22 09:10', description: '플랫폼 중재팀이 거래 기록 검토를 시작했습니다.' },
      { title: '추가 확인 진행', date: '2026.05.27 14:20', description: '검수 기준과 사진 자료의 항목별 비교가 진행 중입니다.' }
    ]
  },
  {
    id: 'DSP-2026-011',
    projectName: '스테인리스 브라켓 양산',
    counterparty: '서울메탈웍스',
    type: '납기 지연',
    status: 'proposal',
    statusLabel: '조정안 제시',
    requestedAt: '2026.05.18',
    nextAction: '부분 납품 및 잔여 일정 조정안 확인',
    amount: '9,800,000원',
    mediator: '외부 제조 분쟁 위원',
    progress: 70,
    updatedAt: '2026.05.26 09:10',
    requester: '루트테크',
    respondent: '서울메탈웍스',
    contractDate: '2026.04.15',
    dueDate: '2026.05.15',
    summary: '원자재 입고 지연으로 약정 납기 내 전체 수량 납품이 어려워져 분쟁 중재가 접수되었습니다.',
    requestedResolution: '부분 납품 승인, 잔여 물량 납기 재설정, 지연분 패널티 조정',
    evidenceFiles: ['production_schedule.pdf', 'material_delay_notice.pdf', 'contract_terms.pdf'],
    steps: [
      { title: '분쟁 접수', description: '납기 지연 사유와 계약 조건을 접수했습니다.', completed: true },
      { title: '자료 검토', description: '생산 일정과 원자재 지연 근거를 검토했습니다.', completed: true },
      { title: '조정안 제시', description: '부분 납품과 잔여 일정 조정안을 제시했습니다.', completed: true },
      { title: '합의 또는 후속 절차', description: '양측의 조정안 수락 여부를 기다리고 있습니다.', completed: false }
    ],
    timeline: [
      { title: '중재 요청 접수', date: '2026.05.18 15:00', description: '납기 지연 건이 접수되었습니다.' },
      { title: '제조 일정 검토', date: '2026.05.20 11:20', description: '공장 측 생산 계획과 지연 사유를 확인했습니다.' },
      { title: '조정안 전달', date: '2026.05.26 09:10', description: '부분 납품과 잔여 납기 조정안이 양측에 전달되었습니다.' }
    ]
  },
  {
    id: 'DSP-2026-009',
    projectName: 'ABS 사출 케이스 금형 제작',
    counterparty: '동부금형',
    type: '추가 비용',
    status: 'waiting',
    statusLabel: '상대방 답변 대기',
    requestedAt: '2026.05.12',
    nextAction: '추가 가공비 산정 근거 회신 대기',
    amount: '13,500,000원',
    mediator: '플랫폼 중재팀',
    progress: 58,
    updatedAt: '2026.05.25 18:40',
    requester: '루트테크',
    respondent: '동부금형',
    contractDate: '2026.04.05',
    dueDate: '2026.05.28',
    summary: '금형 수정 과정에서 추가 가공비가 청구되었으나 최초 견적 범위 포함 여부에 대한 이견이 있습니다.',
    requestedResolution: '추가 비용 산정 근거 확인 후 계약 범위 내 비용 재조정',
    evidenceFiles: ['initial_quote.pdf', 'design_revision_history.pdf', 'additional_cost_statement.pdf'],
    steps: [
      { title: '분쟁 접수', description: '추가 비용 관련 이견을 접수했습니다.', completed: true },
      { title: '자료 검토', description: '초기 견적서와 설계 변경 이력을 검토했습니다.', completed: true },
      { title: '조정안 제시', description: '상대방의 추가 근거 자료를 기다리고 있습니다.', completed: false },
      { title: '합의 또는 후속 절차', description: '비용 분담 기준을 확정합니다.', completed: false }
    ],
    timeline: [
      { title: '중재 요청 접수', date: '2026.05.12 13:50', description: '추가 비용 분쟁이 접수되었습니다.' },
      { title: '초기 견적 검토', date: '2026.05.15 16:15', description: '견적 범위와 설계 변경 이력을 대조했습니다.' },
      { title: '상대방 자료 요청', date: '2026.05.25 18:40', description: '추가 가공비 산정 근거를 공장 측에 요청했습니다.' }
    ]
  },
  {
    id: 'DSP-2026-004',
    projectName: 'CNC 정밀 샤프트 가공',
    counterparty: '한강정밀',
    type: '계약 불이행',
    status: 'resolved',
    statusLabel: '합의 완료',
    requestedAt: '2026.04.29',
    nextAction: '합의서 보관 및 정산 완료',
    amount: '2,700,000원',
    mediator: '플랫폼 중재팀',
    progress: 100,
    updatedAt: '2026.05.20 11:30',
    requester: '루트테크',
    respondent: '한강정밀',
    contractDate: '2026.04.01',
    dueDate: '2026.04.25',
    summary: '계약된 후처리 조건 일부가 누락되어 재작업 및 정산 조정이 진행되었습니다.',
    requestedResolution: '후처리 재작업 완료 후 잔금 정산',
    evidenceFiles: ['contract_terms.pdf', 'before_after_photos.zip', 'settlement_agreement.pdf'],
    steps: [
      { title: '분쟁 접수', description: '후처리 누락 이슈가 접수되었습니다.', completed: true },
      { title: '자료 검토', description: '계약 조건과 납품 상태를 확인했습니다.', completed: true },
      { title: '조정안 제시', description: '재작업 및 정산 조정안이 제시되었습니다.', completed: true },
      { title: '합의 또는 후속 절차', description: '합의서가 확정되고 정산이 완료되었습니다.', completed: true }
    ],
    timeline: [
      { title: '중재 요청 접수', date: '2026.04.29 09:00', description: '계약 불이행 분쟁이 접수되었습니다.' },
      { title: '재작업 조정안 확정', date: '2026.05.08 17:20', description: '후처리 재작업 조건이 합의되었습니다.' },
      { title: '합의 완료', date: '2026.05.20 11:30', description: '정산과 합의서 보관이 완료되었습니다.' }
    ]
  }
]
