import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  error?: string
  /** Ícone exibido à esquerda do campo. */
  leadingIcon?: ReactNode
  /** Elemento exibido à direita (ex.: botão de mostrar senha). */
  trailing?: ReactNode
  /** Link/ação exibida ao lado do rótulo (ex.: "Esqueceu sua senha?"). */
  labelAction?: ReactNode
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, leadingIcon, trailing, labelAction, ...inputProps },
  ref,
) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        {labelAction}
      </div>

      <div className="field-control" data-invalid={error ? 'true' : 'false'}>
        {leadingIcon}
        <input
          ref={ref}
          id={id}
          className="field-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        {trailing}
      </div>

      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})
