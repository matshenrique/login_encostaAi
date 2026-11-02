import { AlertIcon, CheckCircleIcon } from './Icons'

interface AlertProps {
  variant: 'error' | 'success'
  children: string
}

export function Alert({ variant, children }: AlertProps) {
  const Icon = variant === 'error' ? AlertIcon : CheckCircleIcon

  return (
    <div
      className={`alert ${variant === 'error' ? 'alert-error animate-shake' : 'alert-success'}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <span>{children}</span>
    </div>
  )
}
