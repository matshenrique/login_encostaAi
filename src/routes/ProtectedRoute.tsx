import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/auth'

interface ProtectedRouteProps {
  /** Perfil necessário para acessar a rota. */
  role: UserRole
  children: ReactNode
}

/**
 * Guarda de rota de interface.
 * ATENÇÃO: isto é só UX. A autorização real deve ser sempre reforçada
 * pelo backend em cada requisição protegida.
 */
export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/app'} replace />
  }
  return <>{children}</>
}
