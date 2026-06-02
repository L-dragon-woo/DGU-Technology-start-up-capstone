import type { FactoryDetail, FactoryRecommendation } from '@/types'

export const mockFactoryRecommendations: FactoryRecommendation[] = [
  {
    id: '1',
    name: '문래정밀가공',
    location: '서울 영등포구 문래동',
    processes: ['금형', '소성가공'],
    trustScore: 94,
    deliveryRate: 97,
    reorderRate: 88,
    estimateMin: 320,
    estimateMax: 420,
    aiReason: '금형 전문성과 높은 납기 준수율이 귀사의 요구사항에 최적화되어 있습니다.',
    qualityScore: 95,
    deliveryScore: 97,
    priceCompetitiveness: 82
  },
  {
    id: '2',
    name: '대성용접산업',
    location: '경기 시흥시',
    processes: ['용접', '표면처리'],
    trustScore: 91,
    deliveryRate: 93,
    reorderRate: 82,
    estimateMin: 280,
    estimateMax: 360,
    aiReason: '용접 품질이 우수하며 가격 경쟁력이 높습니다.',
    qualityScore: 90,
    deliveryScore: 93,
    priceCompetitiveness: 91
  },
  {
    id: '3',
    name: '한빛주조',
    location: '인천 남동구',
    processes: ['주조', '열처리'],
    trustScore: 89,
    deliveryRate: 90,
    reorderRate: 79,
    estimateMin: 400,
    estimateMax: 520,
    aiReason: '대형 주조 설비를 보유하여 대량 생산에 적합합니다.',
    qualityScore: 88,
    deliveryScore: 90,
    priceCompetitiveness: 75
  },
  {
    id: '4',
    name: '미래표면처리',
    location: '경기 안산시',
    processes: ['표면처리', '열처리'],
    trustScore: 87,
    deliveryRate: 89,
    reorderRate: 76,
    estimateMin: 250,
    estimateMax: 340,
    aiReason: '표면처리 전문 업체로 다양한 코팅 옵션을 제공합니다.',
    qualityScore: 86,
    deliveryScore: 89,
    priceCompetitiveness: 88
  }
]

export const mockFactoryDetails: Record<string, FactoryDetail> = {
  '1': {
    id: '1',
    name: '문래정밀가공',
    location: '서울 영등포구 문래동',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=400&fit=crop',
    verified: true,
    trustScore: 4.8,
    specialty: ['금형 제작', '소성가공', 'CNC 정밀가공'],
    equipment: ['5축 CNC 머시닝센터', 'Wire-cut EDM', '고속 드릴링머신', '정밀 연삭기'],
    products: ['자동차 부품', '전자기기 하우징', '정밀 브라켓', '금형 부품'],
    monthlyCapacity: '월 5,000개 이상',
    clients: ['현대모비스', 'LG전자', '두산에너빌리티'],
    kpi: {
      deliveryRate: 98.5,
      qualitySatisfaction: 4.7,
      reorderRate: 87,
      avgResponseTime: '2시간'
    },
    portfolio: [
      { id: 1, image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop', title: '정밀 기어 부품', process: 'CNC 가공', period: '2026.01' },
      { id: 2, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', title: '알루미늄 하우징', process: '5축 가공', period: '2026.02' },
      { id: 3, image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop', title: '스테인리스 샤프트', process: '선반 가공', period: '2026.03' },
      { id: 4, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop', title: '정밀 금형', process: '금형 제작', period: '2026.03' }
    ],
    reviews: [
      { id: 1, author: '김**', company: '(주)테크솔루션', rating: 5, content: '납기도 정확하고 품질도 매우 만족스럽습니다. 커뮤니케이션이 빠르고 정확했습니다.', product: 'CNC 정밀 부품', date: '2026.03.15' },
      { id: 2, author: '이**', company: '스마트기어(주)', rating: 4, content: '복잡한 형상의 부품도 정확하게 가공해주셨습니다.', product: '기어 부품', date: '2026.02.28' }
    ]
  },
  '2': {
    id: '2',
    name: '대성용접산업',
    location: '경기 시흥시',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=400&fit=crop',
    verified: true,
    trustScore: 4.6,
    specialty: ['용접', '표면처리', '제관'],
    equipment: ['자동 용접 로봇', 'TIG/MIG 용접기', '쇼트 블라스트', '도장 부스'],
    products: ['산업용 프레임', '스틸 브라켓', '설비 커버'],
    monthlyCapacity: '월 3,000세트',
    clients: ['중견 제조사 다수', '설비 제작사'],
    kpi: {
      deliveryRate: 93,
      qualitySatisfaction: 4.5,
      reorderRate: 82,
      avgResponseTime: '3시간'
    },
    portfolio: [
      { id: 1, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop', title: '설비 프레임', process: '용접', period: '2026.02' },
      { id: 2, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', title: '브라켓 세트', process: '표면처리', period: '2026.03' }
    ],
    reviews: [
      { id: 1, author: '박**', company: '(주)메이커스', rating: 5, content: '용접 품질이 균일하고 후처리까지 깔끔했습니다.', product: '산업용 프레임', date: '2026.03.20' }
    ]
  }
}

export const mockDefaultFactoryDetail: FactoryDetail = {
  id: '0',
  name: '샘플 제조공장',
  location: '서울특별시 금천구',
  image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=400&fit=crop',
  verified: false,
  trustScore: 4.2,
  specialty: ['일반 가공', '조립'],
  equipment: ['범용 선반', 'CNC 밀링'],
  products: ['일반 산업용 부품'],
  monthlyCapacity: '월 1,000개',
  clients: ['중소기업 다수'],
  kpi: {
    deliveryRate: 92,
    qualitySatisfaction: 4.0,
    reorderRate: 75,
    avgResponseTime: '4시간'
  },
  portfolio: [
    { id: 1, image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop', title: '샘플 부품 1', process: '가공', period: '2026.01' },
    { id: 2, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', title: '샘플 부품 2', process: '가공', period: '2026.02' }
  ],
  reviews: [
    { id: 1, author: '홍**', company: '(주)샘플', rating: 4, content: '좋은 품질의 제품을 받았습니다.', product: '일반 부품', date: '2026.03.01' }
  ]
}
