import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { AuthError } from '../../types/auth'
import type { AuthUser } from '../../types/auth'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'
import { UserIcon } from '../ui/Icons'
import { PasswordField } from '../ui/PasswordField'
import { TextField } from '../ui/TextField'

interface LoginFormProps {
  /** Chamado após autenticação bem-sucedida, com o usuário retornado pelo backend. */
  onSuccess: (user: AuthUser) => void
}

interface FieldErrors {
  identifier?: string
  password?: string
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const identifierRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    if (!identifier.trim()) next.identifier = 'Informe seu e-mail ou nome de usuário.'
    else if (identifier.includes('@') && !/^\S+@\S+\.\S+$/.test(identifier.trim())) {
      next.identifier = 'Digite um e-mail válido.'
    }
    if (!password) next.password = 'Informe sua senha.'
    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    setFormError(null)
    const validation = validate()
    setErrors(validation)

    if (validation.identifier) return identifierRef.current?.focus()
    if (validation.password) return passwordRef.current?.focus()

    setLoading(true)
    try {
      const user = await signIn({ identifier, password, remember })
      setSuccess(true)
      // Pequena pausa para o usuário perceber o feedback de sucesso.
      setTimeout(() => onSuccess(user), 700)
    } catch (error) {
      setPassword('')
      setFormError(
        error instanceof AuthError ? error.message : 'Ocorreu um erro inesperado. Tente novamente.',
      )
      passwordRef.current?.focus()
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && <Alert variant="error">{formError}</Alert>}
      {success && <Alert variant="success">Login realizado! Redirecionando…</Alert>}

      <TextField
        ref={identifierRef}
        label="E-mail ou usuário"
        name="identifier"
        type="text"
        inputMode="email"
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        placeholder="voce@empresa.com"
        leadingIcon={<UserIcon className="field-icon" />}
        value={identifier}
        onChange={(e) => {
          setIdentifier(e.target.value)
          if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }))
        }}
        error={errors.identifier}
        disabled={loading || success}
      />

      <PasswordField
        ref={passwordRef}
        label="Senha"
        name="password"
        autoComplete="current-password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
        }}
        error={errors.password}
        disabled={loading || success}
      />

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <Checkbox
          label="Lembrar de mim"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          disabled={loading || success}
        />
        <a href="/recuperar-senha" className="link-subtle">
          Esqueceu sua senha?
        </a>
      </div>

      <Button type="submit" loading={loading || success} loadingText={success ? 'Entrando…' : 'Verificando…'}>
        Entrar
      </Button>
    </form>
  )
}
