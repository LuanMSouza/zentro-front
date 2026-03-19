import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // 1. Pega o token dos cookies (é mais seguro que localStorage para o Next)
    const token = request.cookies.get('token')?.value

    // 2. Define quais rotas são públicas
    const isLoginPage = request.nextUrl.pathname === '/login'

    // 3. Lógica de Redirecionamento
    if (!token && !isLoginPage) {
        // Se não está logado e tenta acessar /, /dashboard ou /configuracoes
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && isLoginPage) {
        // Se já está logado e tenta ir para o /login, manda para a home
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

// 4. Configura em quais rotas o middleware deve agir
export const config = {
    matcher: ['/', '/dashboard/:path*', '/configuracoes/:path*'],
}