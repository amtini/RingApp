import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  subscription: {
    status: string
    planId: string
    endDate: string
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: (user: User, token: string) =>
        set(
          produce((state: AuthState) => {
            state.user = user
            state.token = token
            state.isAuthenticated = true
            state.error = null
          })
        ),

      logout: () =>
        set(
          produce((state: AuthState) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.error = null
          })
        ),

      setUser: (user: User) =>
        set(
          produce((state: AuthState) => {
            state.user = user
          })
        ),

      setToken: (token: string) =>
        set(
          produce((state: AuthState) => {
            state.token = token
          })
        ),

      setLoading: (loading: boolean) =>
        set(
          produce((state: AuthState) => {
            state.isLoading = loading
          })
        ),

      setError: (error: string | null) =>
        set(
          produce((state: AuthState) => {
            state.error = error
          })
        ),

      clearError: () =>
        set(
          produce((state: AuthState) => {
            state.error = null
          })
        ),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Provider component for React context compatibility
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}
