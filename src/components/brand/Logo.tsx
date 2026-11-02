interface LogoProps {
  className?: string
}

/**
 * Logo da Encosta AI.
 * - Telas >= 640px: logotipo completo (ícone + "Encosta AI" + descritor).
 * - Telas pequenas: apenas o ícone, em tamanho reduzido.
 * As imagens originais são usadas sem alteração de proporção ou cor.
 */
export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/logo-icone.png"
        alt="Encosta AI"
        width={359}
        height={341}
        className="h-20 w-auto select-none sm:hidden"
        draggable={false}
      />
      <img
        src="/logo-encosta-ai.png"
        alt="Encosta AI – Monitoramento de Barreiras"
        width={1294}
        height={357}
        className="hidden h-24 w-auto max-w-full select-none sm:block"
        draggable={false}
      />
    </div>
  )
}
