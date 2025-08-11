import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from '@components/Layout'
import LoadingSpinner from '@components/ui/LoadingSpinner'
import { AuthProvider } from '@stores/AuthStore'

// Lazy load pages for better performance
const HomePage = lazy(() => import('@pages/HomePage'))
const LoginPage = lazy(() => import('@pages/LoginPage'))
const RegisterPage = lazy(() => import('@pages/RegisterPage'))
const DashboardPage = lazy(() => import('@pages/DashboardPage'))
const SubscriptionPage = lazy(() => import('@pages/SubscriptionPage'))
const ProfilePage = lazy(() => import('@pages/ProfilePage'))
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'))

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </AuthProvider>
  )
}

export default App
