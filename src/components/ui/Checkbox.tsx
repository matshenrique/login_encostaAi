import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm font-medium text-ink-muted">
      <input type="checkbox" className="checkbox-box" {...props} />
      {label}
    </label>
  )
}
