import { forwardRef, useState } from 'react'
import { TextField } from './TextField'
import type { TextFieldProps } from './TextField'
import { EyeIcon, EyeOffIcon, LockIcon } from './Icons'

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing' | 'leadingIcon'>

/** Campo de senha com botão para exibir/ocultar o conteúdo. */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  props,
  ref,
) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      ref={ref}
      {...props}
      type={visible ? 'text' : 'password'}
      leadingIcon={<LockIcon className="field-icon" />}
      trailing={
        <button
          type="button"
          className="icon-button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visible}
        >
          {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      }
    />
  )
})
