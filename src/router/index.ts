import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingView.vue'),
      meta: { title: '홈', layout: 'none' }
    },
    {
      path: '/role-select',
      name: 'role-select',
      component: () => import('@/views/RoleSelectView.vue'),
      meta: { title: '역할 선택', layout: 'none' }
    },
    {
      path: '/login',
      name: 'login',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: '대시보드' }
    },
    {
      path: '/client/request',
      name: 'client-request',
      component: () => import('@/views/client/ClientRequestView.vue'),
      meta: { title: '수주 의뢰 등록' }
    },
    {
      path: '/client/matching',
      name: 'client-matching',
      component: () => import('@/views/client/MatchingResultView.vue'),
      meta: { title: 'AI 추천 공장' }
    },
    {
      path: '/factory/onboarding',
      name: 'factory-onboarding',
      component: () => import('@/views/factory/FactoryOnboardingView.vue'),
      meta: { title: '공장 프로필 등록' }
    },
    {
      path: '/factories/:id',
      name: 'factory-detail',
      component: () => import('@/views/factory/FactoryDetailView.vue'),
      meta: { title: '공장 상세' }
    },
    {
      path: '/contract',
      name: 'contract-escrow',
      component: () => import('@/views/contract/ContractEscrowView.vue'),
      meta: { title: '계약 및 에스크로 결제' }
    },
    {
      path: '/disputes/mediation',
      name: 'dispute-mediation',
      component: () => import('@/views/dispute/DisputeMediationView.vue'),
      meta: { title: '분쟁 중재 신청' }
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('@/views/CompaniesView.vue'),
      meta: { title: '기업 디렉토리' }
    },
    {
      path: '/companies/:id',
      name: 'company-detail',
      component: () => import('@/views/CompanyDetailView.vue'),
      meta: { title: '기업 상세' }
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import('@/views/MessagesView.vue'),
      meta: { title: '메시지' }
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import('@/views/MyPageView.vue'),
      meta: { title: '마이페이지' },
      children: [
        {
          path: '',
          name: 'mypage-profile',
          component: () => import('@/views/mypage/ProfileView.vue'),
          meta: { title: '기업 프로필' }
        },
        {
          path: 'analytics',
          name: 'mypage-analytics',
          component: () => import('@/views/mypage/AnalyticsView.vue'),
          meta: { title: '활동 분석' }
        },
        {
          path: 'settings',
          name: 'mypage-settings',
          component: () => import('@/views/mypage/SettingsView.vue'),
          meta: { title: '계정 설정' }
        }
      ]
    }
  ]
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || 'RootMatching'} - RootMatching B2B`
  next()
})

export default router
