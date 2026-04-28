<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockDefaultFactoryDetail, mockFactoryDetails } from '@/data/factoryData'
import {
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  TrendingUp,
  RefreshCw,
  MessageSquare,
  ChevronRight,
  Award,
  Package,
  Settings,
  Users,
  Calendar
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const factoryId = computed(() => route.params.id as string)
const factory = computed(() => mockFactoryDetails[factoryId.value] || mockDefaultFactoryDetail)

const handleQuoteRequest = () => {
  router.push('/contract')
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating))
}
</script>

<template>
  <div class="factory-detail">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-image">
        <img :src="factory.image" :alt="factory.name" />
        <div class="hero-overlay" />
      </div>
      <div class="hero-content">
        <div class="hero-info">
          <div class="hero-badges">
            <span v-if="factory.verified" class="badge badge-verified">
              <ShieldCheck :size="14" />
              인증업체
            </span>
            <span class="badge badge-score">
              <Star :size="14" />
              {{ factory.trustScore }}
            </span>
          </div>
          <h1 class="hero-title">{{ factory.name }}</h1>
          <p class="hero-location">
            <MapPin :size="16" />
            {{ factory.location }}
          </p>
        </div>
        <button class="cta-button" @click="handleQuoteRequest">
          견적 요청하기
          <ChevronRight :size="20" />
        </button>
      </div>
    </section>

    <div class="content-wrapper">
      <!-- Basic Info Card -->
      <section class="info-section">
        <h2 class="section-title">
          <Settings :size="20" />
          기본 정보
        </h2>
        <div class="info-grid">
          <div class="info-card">
            <div class="info-card-header">
              <Award :size="18" />
              <span>전문 공정</span>
            </div>
            <div class="info-card-content">
              <div class="tag-list">
                <span v-for="process in factory.specialty" :key="process" class="tag">
                  {{ process }}
                </span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <Settings :size="18" />
              <span>보유 설비</span>
            </div>
            <div class="info-card-content">
              <ul class="equipment-list">
                <li v-for="equipment in factory.equipment" :key="equipment">
                  {{ equipment }}
                </li>
              </ul>
            </div>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <Package :size="18" />
              <span>생산 가능 품목</span>
            </div>
            <div class="info-card-content">
              <div class="tag-list">
                <span v-for="product in factory.products" :key="product" class="tag tag-secondary">
                  {{ product }}
                </span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <TrendingUp :size="18" />
              <span>월 생산 가능량</span>
            </div>
            <div class="info-card-content">
              <p class="capacity-text">{{ factory.monthlyCapacity }}</p>
            </div>
          </div>

          <div class="info-card info-card-wide">
            <div class="info-card-header">
              <Users :size="18" />
              <span>주요 고객사</span>
            </div>
            <div class="info-card-content">
              <div class="client-list">
                <span v-for="client in factory.clients" :key="client" class="client-badge">
                  {{ client }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- KPI Cards -->
      <section class="kpi-section">
        <h2 class="section-title">
          <TrendingUp :size="20" />
          성과 지표
        </h2>
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon kpi-icon-delivery">
              <Clock :size="24" />
            </div>
            <div class="kpi-content">
              <span class="kpi-label">납기 준수율</span>
              <span class="kpi-value">{{ factory.kpi.deliveryRate }}%</span>
            </div>
            <div class="kpi-bar">
              <div class="kpi-bar-fill kpi-bar-delivery" :style="{ width: `${factory.kpi.deliveryRate}%` }" />
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon kpi-icon-quality">
              <Star :size="24" />
            </div>
            <div class="kpi-content">
              <span class="kpi-label">품질 만족도</span>
              <span class="kpi-value">{{ factory.kpi.qualitySatisfaction }} / 5.0</span>
            </div>
            <div class="kpi-bar">
              <div class="kpi-bar-fill kpi-bar-quality" :style="{ width: `${(factory.kpi.qualitySatisfaction / 5) * 100}%` }" />
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon kpi-icon-reorder">
              <RefreshCw :size="24" />
            </div>
            <div class="kpi-content">
              <span class="kpi-label">재거래율</span>
              <span class="kpi-value">{{ factory.kpi.reorderRate }}%</span>
            </div>
            <div class="kpi-bar">
              <div class="kpi-bar-fill kpi-bar-reorder" :style="{ width: `${factory.kpi.reorderRate}%` }" />
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon kpi-icon-response">
              <MessageSquare :size="24" />
            </div>
            <div class="kpi-content">
              <span class="kpi-label">평균 응답 시간</span>
              <span class="kpi-value">{{ factory.kpi.avgResponseTime }}</span>
            </div>
            <div class="kpi-bar">
              <div class="kpi-bar-fill kpi-bar-response" style="width: 90%" />
            </div>
          </div>
        </div>
      </section>

      <!-- Portfolio Gallery -->
      <section class="portfolio-section">
        <h2 class="section-title">
          <Package :size="20" />
          작업 포트폴리오
        </h2>
        <div class="portfolio-grid">
          <div v-for="item in factory.portfolio" :key="item.id" class="portfolio-card">
            <div class="portfolio-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="portfolio-content">
              <h3 class="portfolio-title">{{ item.title }}</h3>
              <div class="portfolio-meta">
                <span class="portfolio-process">{{ item.process }}</span>
                <span class="portfolio-period">
                  <Calendar :size="12" />
                  {{ item.period }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Reviews -->
      <section class="reviews-section">
        <h2 class="section-title">
          <MessageSquare :size="20" />
          거래 후기
        </h2>
        <div class="reviews-list">
          <div v-for="review in factory.reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <div class="review-author">
                <div class="author-avatar">{{ review.author.charAt(0) }}</div>
                <div class="author-info">
                  <span class="author-name">{{ review.author }}</span>
                  <span class="author-company">{{ review.company }}</span>
                </div>
              </div>
              <div class="review-rating">
                <Star
                  v-for="(filled, index) in renderStars(review.rating)"
                  :key="index"
                  :size="16"
                  :class="['star', { 'star-filled': filled }]"
                />
              </div>
            </div>
            <p class="review-content">{{ review.content }}</p>
            <div class="review-footer">
              <span class="review-product">거래 품목: {{ review.product }}</span>
              <span class="review-date">{{ review.date }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Sticky CTA for Mobile -->
      <div class="mobile-cta">
        <button class="cta-button cta-button-full" @click="handleQuoteRequest">
          견적 요청하기
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.factory-detail {
  min-height: 100vh;
  background-color: #f8fafc;
}

/* Hero Section */
.hero {
  position: relative;
  height: 320px;
}

.hero-image {
  position: absolute;
  inset: 0;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.3));
}

.hero-content {
  position: relative;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .hero-content {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.hero-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-verified {
  background-color: #10b981;
  color: white;
}

.badge-score {
  background-color: #f59e0b;
  color: white;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
}

.hero-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  font-size: 1rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.cta-button:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

/* Content Wrapper */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-bottom: 6rem;
}

@media (min-width: 768px) {
  .content-wrapper {
    padding: 2rem;
    padding-bottom: 2rem;
  }
}

/* Section Title */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

/* Info Section */
.info-section {
  margin-bottom: 3rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.info-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-card-wide {
  grid-column: 1 / -1;
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.info-card-content {
  color: #1e293b;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.375rem 0.75rem;
  background-color: #dbeafe;
  color: #1d4ed8;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.tag-secondary {
  background-color: #f1f5f9;
  color: #475569;
}

.equipment-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.equipment-list li {
  position: relative;
  padding-left: 1rem;
  font-size: 0.9375rem;
  color: #334155;
}

.equipment-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 6px;
  height: 6px;
  background-color: #2563eb;
  border-radius: 50%;
}

.capacity-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.client-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.client-badge {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

/* KPI Section */
.kpi-section {
  margin-bottom: 3rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.kpi-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.kpi-icon-delivery {
  background-color: #dbeafe;
  color: #2563eb;
}

.kpi-icon-quality {
  background-color: #fef3c7;
  color: #d97706;
}

.kpi-icon-reorder {
  background-color: #d1fae5;
  color: #059669;
}

.kpi-icon-response {
  background-color: #ede9fe;
  color: #7c3aed;
}

.kpi-content {
  margin-bottom: 1rem;
}

.kpi-label {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.kpi-bar {
  height: 6px;
  background-color: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.kpi-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease-out;
}

.kpi-bar-delivery {
  background-color: #2563eb;
}

.kpi-bar-quality {
  background-color: #d97706;
}

.kpi-bar-reorder {
  background-color: #059669;
}

.kpi-bar-response {
  background-color: #7c3aed;
}

/* Portfolio Section */
.portfolio-section {
  margin-bottom: 3rem;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .portfolio-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .portfolio-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.portfolio-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.portfolio-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.portfolio-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.portfolio-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.portfolio-card:hover .portfolio-image img {
  transform: scale(1.05);
}

.portfolio-content {
  padding: 1rem;
}

.portfolio-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.portfolio-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
}

.portfolio-process {
  padding: 0.25rem 0.5rem;
  background-color: #f1f5f9;
  border-radius: 0.25rem;
}

.portfolio-period {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Reviews Section */
.reviews-section {
  margin-bottom: 2rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #1e293b;
}

.author-company {
  font-size: 0.75rem;
  color: #64748b;
}

.review-rating {
  display: flex;
  gap: 0.125rem;
}

.star {
  color: #e2e8f0;
}

.star-filled {
  color: #f59e0b;
  fill: #f59e0b;
}

.review-content {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.75rem;
  color: #64748b;
}

.review-product {
  padding: 0.25rem 0.5rem;
  background-color: #f8fafc;
  border-radius: 0.25rem;
}

/* Mobile CTA */
.mobile-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

@media (min-width: 768px) {
  .mobile-cta {
    display: none;
  }
}

.cta-button-full {
  width: 100%;
  justify-content: center;
}
</style>
