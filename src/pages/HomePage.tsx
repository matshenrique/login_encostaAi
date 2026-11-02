import { Logo } from '../components/brand/Logo'
import { useAuth } from '../hooks/useAuth'

interface HomePageProps {
  title: string
  description: string
}

/**
 * Página provisória exibida após o login.
 * Substitua pelos ambientes reais de Administrador e Usuário comum.
 */
export function HomePage({ title, description }: HomePageProps) {
  const { user, signOut } = useAuth()

  return (
    <main className="auth-backdrop flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="auth-card text-center">
        <Logo className="mb-6" />
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-ink-muted">{description}</p>
        <p className="mt-4 rounded-xl bg-surface-muted px-4 py-3 text-sm">
          Olá, <strong>{user?.name}</strong> · perfil <strong>{user?.role}</strong>
        </p>
        <button type="button" onClick={signOut} className="link-subtle mt-6">
          Sair
        </button>
      </div>
    </main>
  )
}
