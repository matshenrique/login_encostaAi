import { AuthError } from '../types/auth'
import type { AuthSession, LoginCredentials, LoginResponse, UserRole } from '../types/auth'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3333'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const STORAGE_KEY = 'encosta-ai:session'

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */

/**
 * Autentica o usuário.
 * O backend é a única fonte de verdade do perfil (role): o frontend apenas
 * lê o valor devolvido e redireciona.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  if (USE_MOCK) return mockLogin(credentials)

  let response: Response
  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: credentials.identifier.trim(),
        password: credentials.password,
      }),
    })
  } catch {
    throw new AuthError('NETWORK', 'Não foi possível conectar ao servidor. Verifique sua conexão.')
  }

  if (response.status === 401 || response.status === 400) {
    throw new AuthError('INVALID_CREDENTIALS', 'E-mail/usuário ou senha incorretos.')
  }
  if (response.status === 403) {
    throw new AuthError('FORBIDDEN', 'Seu acesso está desativado. Fale com o administrador.')
  }
  if (!response.ok) {
    throw new AuthError('SERVER', 'Erro no servidor. Tente novamente em instantes.')
  }

  const data = (await response.json()) as LoginResponse
  if (!data?.token || !data?.user || !isValidRole(data.user.role)) {
    throw new AuthError('SERVER', 'Resposta inválida do servidor.')
  }
  return data
}

function isValidRole(role: unknown): role is UserRole {
  return role === 'ADMIN' || role === 'USER'
}

/* ------------------------------------------------------------------ */
/* Sessão                                                              */
/* ------------------------------------------------------------------ */

/**
 * "Lembrar de mim" => localStorage (persiste ao fechar o navegador).
 * Caso contrário => sessionStorage (some ao fechar a aba).
 *
 * Em produção, o ideal é que o backend entregue o token em cookie
 * HttpOnly + Secure + SameSite, eliminando o armazenamento no JS.
 */
export function saveSession(session: AuthSession, remember: boolean): void {
  clearSession()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function loadSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as AuthSession
    if (parsed?.token && parsed.user && isValidRole(parsed.user.role)) return parsed
  } catch {
    /* sessão corrompida: ignora */
  }
  clearSession()
  return null
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}

/* ------------------------------------------------------------------ */
/* Mock (somente desenvolvimento)                                      */
/* ------------------------------------------------------------------ */

const MOCK_USERS = [
  { id: '1', name: 'Administrador', email: 'admin@encosta.ai', username: 'admin', password: 'admin123', role: 'ADMIN' as const },
  { id: '2', name: 'Usuário Comum', email: 'usuario@encosta.ai', username: 'usuario', password: 'usuario123', role: 'USER' as const },
]

async function mockLogin({ identifier, password }: LoginCredentials): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const id = identifier.trim().toLowerCase()
  const found = MOCK_USERS.find((u) => (u.email === id || u.username === id) && u.password === password)
  if (!found) {
    throw new AuthError('INVALID_CREDENTIALS', 'E-mail/usuário ou senha incorretos.')
  }

  return {
    token: `mock-token-${found.id}`,
    user: { id: found.id, name: found.name, email: found.email, role: found.role },
  }
}
