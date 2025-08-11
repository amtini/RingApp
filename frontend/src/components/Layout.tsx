import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useAuth } from '@stores/AuthStore'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout
