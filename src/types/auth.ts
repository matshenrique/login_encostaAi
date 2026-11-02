/**
 * Perfis existentes na plataforma.
 * O perfil NUNCA é escolhido na tela de login: ele vem do backend.
 */
export type UserRole = 'ADMIN' | 'USER'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginCredentials {
  /** E-mail ou nome de usuário */
  identifier: string
  password: string
  remember: boolean
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface AuthSession {
  token: string
  user: AuthUser
}

/** Erro de autenticação com mensagem segura para exibir ao usuário. */
export class AuthError extends Error {
  readonly code: 'INVALID_CREDENTIALS' | 'NETWORK' | 'SERVER' | 'FORBIDDEN'

  constructor(code: AuthError['code'], message: string) {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}
