// Company Types
export interface Company {
  id: string
  name: string
  industry: string
  region: string
  size: string
  description: string
  logo?: string
  tags: string[]
  contactEmail: string
  contactPhone: string
  website?: string
  establishedYear: number
  employeeCount: number
  revenue?: string
  certifications: string[]
  createdAt: string
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  company: Company
  role: 'admin' | 'member'
  avatar?: string
  position: string
  phone: string
}

// Message Types
export interface Message {
  id: string
  senderId: string
  senderName: string
  senderCompany: string
  receiverId: string
  receiverName: string
  receiverCompany: string
  subject: string
  content: string
  isRead: boolean
  createdAt: string
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  url: string
  size: number
  type: string
}

// Notification Types
export interface Notification {
  id: string
  type: 'message' | 'match' | 'system' | 'inquiry'
  title: string
  content: string
  isRead: boolean
  createdAt: string
  link?: string
}

// Filter Types
export interface CompanyFilter {
  industry?: string
  region?: string
  size?: string
  keyword?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalViews: number
  totalInquiries: number
  totalMatches: number
  recentMessages: number
}

// Activity Log
export interface ActivityLog {
  id: string
  type: 'view' | 'inquiry' | 'match' | 'message'
  description: string
  targetCompanyId?: string
  targetCompanyName?: string
  createdAt: string
}

export interface FactoryRecommendation {
  id: string
  name: string
  location: string
  processes: string[]
  trustScore: number
  deliveryRate: number
  reorderRate: number
  estimateMin: number
  estimateMax: number
  aiReason: string
  qualityScore: number
  deliveryScore: number
  priceCompetitiveness: number
}

export interface FactoryPortfolioItem {
  id: number
  image: string
  title: string
  process: string
  period: string
}

export interface FactoryReview {
  id: number
  author: string
  company: string
  rating: number
  content: string
  product: string
  date: string
}

export interface FactoryDetail {
  id: string
  name: string
  location: string
  image: string
  verified: boolean
  trustScore: number
  specialty: string[]
  equipment: string[]
  products: string[]
  monthlyCapacity: string
  clients: string[]
  kpi: {
    deliveryRate: number
    qualitySatisfaction: number
    reorderRate: number
    avgResponseTime: string
  }
  portfolio: FactoryPortfolioItem[]
  reviews: FactoryReview[]
}

export interface ReceivedQuoteRequest {
  id: string
  projectName: string
  clientName: string
  processType: string
  productItem: string
  quantity: string
  budgetRange: string
  desiredDeadline: string
  requestedAt: string
  status: 'new' | 'reviewing' | 'quoted'
  description: string
  attachments: Attachment[]
}
