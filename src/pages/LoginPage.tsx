import { Navigate, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'
import { Logo } from '../components/brand/Logo'
import { ShieldIcon } from '../components/ui/Icons'
import { useAuth } from '../hooks/useAuth'
import type { AuthUser, UserRole } from '../types/auth'

/** Ambiente de destino de cada perfil. A decisão usa o perfil vindo do backend. */
const HOME_BY_ROLE: Record<UserRole, string> = {
  ADMIN: '/admin',
  USER: '/app',
}

export function LoginPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Se já existe sessão, vai direto para o ambiente correspondente.
  if (user) return <Navigate to={HOME_BY_ROLE[user.role]} replace />

  function handleSuccess(authenticated: AuthUser) {
    navigate(HOME_BY_ROLE[authenticated.role], { replace: true })
  }

  return (
    <main className="auth-backdrop flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md animate-fade-up">
        <header className="mb-6 text-center sm:mb-8">
          <Logo />
          <p className="mt-3 text-sm font-medium text-ink-muted sm:text-base">
            Monitoramento inteligente de barreiras
          </p>
        </header>

        <section className="auth-card" aria-labelledby="login-title">
          <div className="mb-6">
            <h1 id="login-title" className="text-2xl font-bold tracking-tight">
              Acesse sua conta
            </h1>
            <p className="mt-1 text-sm text-ink-muted">Entre com suas credenciais para continuar.</p>
          </div>

          <LoginForm onSuccess={handleSuccess} />
        </section>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-ink-muted">
          <ShieldIcon className="h-4 w-4 text-brand" />
          Conexão segura · Seu perfil de acesso é definido pela plataforma
        </p>
      </div>
    </main>
  )
}
