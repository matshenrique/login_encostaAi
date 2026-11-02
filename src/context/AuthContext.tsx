import { createContext, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { clearSession, loadSession, login as loginRequest, saveSession } from '../services/authService'
import type { AuthUser, LoginCredentials } from '../types/auth'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  /** Autentica e devolve o usuário (com o perfil validado pelo backend). */
  signIn: (credentials: LoginCredentials) => Promise<AuthUser>
  signOut: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadSession()?.user ?? null)

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    const { token, user: authenticated } = await loginRequest(credentials)
    saveSession({ token, user: authenticated }, credentials.remember)
    setUser(authenticated)
    return authenticated
  }, [])

  const signOut = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, signIn, signOut }),
    [user, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
