import type { Company, User, Message, Notification, ActivityLog, DashboardStats } from '@/types'

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: '테크솔루션 주식회사',
    industry: 'IT/소프트웨어',
    region: '서울',
    size: '중소기업',
    description: 'AI 기반 비즈니스 솔루션을 제공하는 기업입니다. 머신러닝과 데이터 분석 기술을 활용하여 기업의 디지털 전환을 지원합니다.',
    tags: ['AI', '빅데이터', '클라우드', 'B2B'],
    contactEmail: 'contact@techsolution.co.kr',
    contactPhone: '02-1234-5678',
    website: 'https://techsolution.co.kr',
    establishedYear: 2018,
    employeeCount: 45,
    revenue: '50억원',
    certifications: ['ISO 27001', '벤처기업인증'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: '그린에너지 코리아',
    industry: '에너지/환경',
    region: '경기',
    size: '중견기업',
    description: '친환경 에너지 솔루션과 탄소중립 컨설팅을 제공합니다. ESG 경영을 위한 종합 솔루션을 제공합니다.',
    tags: ['친환경', 'ESG', '태양광', '탄소중립'],
    contactEmail: 'info@greenenergy.co.kr',
    contactPhone: '031-987-6543',
    website: 'https://greenenergy.co.kr',
    establishedYear: 2015,
    employeeCount: 120,
    revenue: '200억원',
    certifications: ['ISO 14001', '녹색기업인증'],
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: '스마트팩토리 주식회사',
    industry: '제조/생산',
    region: '부산',
    size: '중소기업',
    description: '스마트 공장 자동화 솔루션 전문기업. IoT 센서와 AI를 활용한 생산 효율화 시스템을 구축합니다.',
    tags: ['스마트팩토리', 'IoT', '자동화', '제조'],
    contactEmail: 'sales@smartfactory.kr',
    contactPhone: '051-555-1234',
    website: 'https://smartfactory.kr',
    establishedYear: 2019,
    employeeCount: 35,
    revenue: '30억원',
    certifications: ['ISO 9001', '이노비즈'],
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    name: '푸드테크 이노베이션',
    industry: '식품/농업',
    region: '대전',
    size: '스타트업',
    description: '식품 공급망 최적화와 스마트팜 기술을 개발하는 푸드테크 스타트업입니다.',
    tags: ['푸드테크', '스마트팜', '공급망', 'AgriTech'],
    contactEmail: 'hello@foodtechinno.com',
    contactPhone: '042-333-7890',
    website: 'https://foodtechinno.com',
    establishedYear: 2021,
    employeeCount: 15,
    revenue: '10억원',
    certifications: ['벤처기업인증'],
    createdAt: '2024-04-05'
  },
  {
    id: '5',
    name: '메디헬스 솔루션',
    industry: '헬스케어/바이오',
    region: '서울',
    size: '중견기업',
    description: '디지털 헬스케어 플랫폼과 의료 AI 솔루션을 제공합니다. 원격의료와 건강관리 서비스를 운영합니다.',
    tags: ['헬스케어', '의료AI', '디지털헬스', '원격의료'],
    contactEmail: 'contact@medihealth.co.kr',
    contactPhone: '02-8765-4321',
    website: 'https://medihealth.co.kr',
    establishedYear: 2016,
    employeeCount: 85,
    revenue: '150억원',
    certifications: ['ISO 13485', 'KFDA인증'],
    createdAt: '2024-01-25'
  },
  {
    id: '6',
    name: '로지스틱스 파트너스',
    industry: '물류/유통',
    region: '인천',
    size: '중견기업',
    description: '풀필먼트와 라스트마일 배송 서비스를 제공하는 물류 전문기업입니다.',
    tags: ['물류', '풀필먼트', '배송', '창고'],
    contactEmail: 'business@logispartners.kr',
    contactPhone: '032-444-5678',
    website: 'https://logispartners.kr',
    establishedYear: 2014,
    employeeCount: 200,
    revenue: '500억원',
    certifications: ['ISO 9001', 'AEO인증'],
    createdAt: '2024-02-15'
  },
  {
    id: '7',
    name: '핀테크랩 코리아',
    industry: '금융/핀테크',
    region: '서울',
    size: '스타트업',
    description: '기업금융 자동화와 결제 솔루션을 제공하는 핀테크 스타트업입니다.',
    tags: ['핀테크', 'B2B결제', '기업금융', 'API'],
    contactEmail: 'info@fintechlab.kr',
    contactPhone: '02-2222-3333',
    website: 'https://fintechlab.kr',
    establishedYear: 2020,
    employeeCount: 25,
    revenue: '20억원',
    certifications: ['전자금융업등록'],
    createdAt: '2024-03-20'
  },
  {
    id: '8',
    name: '건설테크 주식회사',
    industry: '건설/부동산',
    region: '경기',
    size: '중소기업',
    description: 'BIM 기반 건설 프로젝트 관리 솔루션과 스마트 건설 기술을 제공합니다.',
    tags: ['건설', 'BIM', '프로젝트관리', '스마트건설'],
    contactEmail: 'contact@constructech.kr',
    contactPhone: '031-777-8888',
    website: 'https://constructech.kr',
    establishedYear: 2017,
    employeeCount: 55,
    revenue: '80억원',
    certifications: ['ISO 9001', '건설업등록'],
    createdAt: '2024-04-10'
  }
]

export const mockCurrentUser: User = {
  id: 'user1',
  email: 'hong@techsolution.co.kr',
  name: '홍길동',
  company: mockCompanies[0],
  role: 'admin',
  position: '사업개발팀장',
  phone: '010-1234-5678'
}

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    senderId: '2',
    senderName: '김영희',
    senderCompany: '그린에너지 코리아',
    receiverId: 'user1',
    receiverName: '홍길동',
    receiverCompany: '테크솔루션 주식회사',
    subject: '협력 제안 문의드립니다',
    content: '안녕하세요. 그린에너지 코리아의 김영희입니다.\n\n귀사의 AI 솔루션에 대해 관심이 있어 연락드립니다. ESG 데이터 분석 관련하여 협력 가능성을 논의하고 싶습니다.\n\n편하신 시간에 미팅 가능하실까요?',
    isRead: false,
    createdAt: '2024-04-20T10:30:00'
  },
  {
    id: 'msg2',
    senderId: '3',
    senderName: '박철수',
    senderCompany: '스마트팩토리 주식회사',
    receiverId: 'user1',
    receiverName: '홍길동',
    receiverCompany: '테크솔루션 주식회사',
    subject: 'AI 기반 품질검사 시스템 문의',
    content: '안녕하세요. 스마트팩토리의 박철수입니다.\n\n제조 공정 내 AI 기반 품질검사 시스템 도입을 검토 중입니다. 귀사의 솔루션에 대한 상세 자료와 견적을 요청드립니다.',
    isRead: true,
    createdAt: '2024-04-19T14:20:00'
  },
  {
    id: 'msg3',
    senderId: '5',
    senderName: '이미영',
    senderCompany: '메디헬스 솔루션',
    receiverId: 'user1',
    receiverName: '홍길동',
    receiverCompany: '테크솔루션 주식회사',
    subject: '헬스케어 AI 솔루션 파트너십 제안',
    content: '안녕하세요. 메디헬스 솔루션의 이미영입니다.\n\n의료 AI 분야에서 귀사와의 기술 파트너십을 제안드립니다. 상호 보완적인 기술력을 바탕으로 시너지를 낼 수 있을 것으로 기대합니다.',
    isRead: true,
    createdAt: '2024-04-18T09:15:00'
  },
  {
    id: 'msg4',
    senderId: '7',
    senderName: '최진우',
    senderCompany: '핀테크랩 코리아',
    receiverId: 'user1',
    receiverName: '홍길동',
    receiverCompany: '테크솔루션 주식회사',
    subject: 'API 연동 기술 협력 문의',
    content: '안녕하세요. 핀테크랩 코리아의 최진우입니다.\n\n결제 API와 귀사의 비즈니스 솔루션 연동에 대해 논의하고 싶습니다. 기술 미팅 일정을 잡을 수 있을까요?',
    isRead: false,
    createdAt: '2024-04-17T16:45:00'
  }
]

export const mockNotifications: Notification[] = [
  {
    id: 'noti1',
    type: 'message',
    title: '새 메시지 도착',
    content: '그린에너지 코리아에서 메시지가 도착했습니다.',
    isRead: false,
    createdAt: '2024-04-20T10:30:00',
    link: '/messages/msg1'
  },
  {
    id: 'noti2',
    type: 'match',
    title: '새로운 매칭 기업',
    content: '귀사와 관심 분야가 일치하는 3개 기업이 있습니다.',
    isRead: false,
    createdAt: '2024-04-19T15:00:00',
    link: '/companies'
  },
  {
    id: 'noti3',
    type: 'inquiry',
    title: '기업 프로필 조회',
    content: '5개 기업에서 귀사의 프로필을 조회했습니다.',
    isRead: true,
    createdAt: '2024-04-18T11:20:00',
    link: '/mypage/analytics'
  },
  {
    id: 'noti4',
    type: 'system',
    title: '프로필 업데이트 권장',
    content: '기업 프로필을 업데이트하여 매칭률을 높여보세요.',
    isRead: true,
    createdAt: '2024-04-17T09:00:00',
    link: '/mypage/profile'
  }
]

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'act1',
    type: 'view',
    description: '기업 프로필이 조회되었습니다.',
    targetCompanyId: '2',
    targetCompanyName: '그린에너지 코리아',
    createdAt: '2024-04-20T09:15:00'
  },
  {
    id: 'act2',
    type: 'inquiry',
    description: '협력 문의가 접수되었습니다.',
    targetCompanyId: '3',
    targetCompanyName: '스마트팩토리 주식회사',
    createdAt: '2024-04-19T14:30:00'
  },
  {
    id: 'act3',
    type: 'match',
    description: '새로운 매칭 기업이 발견되었습니다.',
    targetCompanyId: '5',
    targetCompanyName: '메디헬스 솔루션',
    createdAt: '2024-04-18T16:45:00'
  },
  {
    id: 'act4',
    type: 'message',
    description: '메시지가 발송되었습니다.',
    targetCompanyId: '7',
    targetCompanyName: '핀테크랩 코리아',
    createdAt: '2024-04-17T11:00:00'
  },
  {
    id: 'act5',
    type: 'view',
    description: '기업 프로필이 조회되었습니다.',
    targetCompanyId: '8',
    targetCompanyName: '건설테크 주식회사',
    createdAt: '2024-04-16T15:20:00'
  }
]

export const mockDashboardStats: DashboardStats = {
  totalViews: 127,
  totalInquiries: 23,
  totalMatches: 45,
  recentMessages: 4
}

export const industries = [
  'IT/소프트웨어',
  '에너지/환경',
  '제조/생산',
  '식품/농업',
  '헬스케어/바이오',
  '물류/유통',
  '금융/핀테크',
  '건설/부동산'
]

export const regions = [
  '서울',
  '경기',
  '인천',
  '부산',
  '대전',
  '대구',
  '광주',
  '울산',
  '세종',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주'
]

export const companySizes = [
  '스타트업',
  '중소기업',
  '중견기업',
  '대기업'
]
