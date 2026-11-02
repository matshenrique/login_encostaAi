# Encosta AI – Tela de Login

Tela de autenticação da plataforma **Encosta AI – Monitoramento de Barreiras**.
React + Vite + TypeScript + Tailwind CSS v4.

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

Acesse http://localhost:5173

## Contas de demonstração (somente com `VITE_USE_MOCK=true`)

| Perfil        | Usuário / e-mail                     | Senha        |
|---------------|--------------------------------------|--------------|
| Administrador | `admin` ou `admin@encosta.ai`        | `admin123`   |
| Usuário comum | `usuario` ou `usuario@encosta.ai`    | `usuario123` |

## Integração com o backend

`POST {VITE_API_URL}/auth/login`

```json
// request
{ "identifier": "admin@encosta.ai", "password": "••••••" }

// response 200
{
  "token": "jwt...",
  "user": { "id": "1", "name": "Administrador", "email": "admin@encosta.ai", "role": "ADMIN" }
}
```

- `role` é `"ADMIN"` ou `"USER"` e **vem sempre do backend**; a tela de login não permite escolher perfil.
- Códigos tratados: `400/401` credenciais inválidas, `403` acesso desativado, demais erros → mensagem genérica.
- O redirecionamento usa o `role` retornado: `ADMIN → /admin`, `USER → /app`.
- Os guards de rota no front são apenas UX. Reforce a autorização em cada endpoint do backend.
- Recomendado em produção: entregar o token em cookie `HttpOnly; Secure; SameSite`.

## Estrutura

```
src/
├── components/
│   ├── auth/LoginForm.tsx      # formulário, validação e estados
│   ├── brand/Logo.tsx          # logo completo (desktop) / ícone (mobile)
│   └── ui/                     # Button, TextField, PasswordField, Checkbox, Alert, Icons
├── context/AuthContext.tsx     # sessão e signIn/signOut
├── hooks/useAuth.ts
├── pages/                      # LoginPage, HomePage (provisória)
├── routes/ProtectedRoute.tsx
├── services/authService.ts     # chamada à API, mock e persistência da sessão
├── styles/index.css            # tokens da marca + classes de componentes
└── types/auth.ts
```

## Identidade visual

Tokens definidos em `src/styles/index.css` (`@theme`):
`#0878F9` principal · `#102F50` escuro · `#0865C0` secundário · `#FFFFFF` · `#F4F7FB` · `#64748B`.
Logos originais em `public/` (apenas recortadas as margens brancas, sem alterar proporção ou cores).
