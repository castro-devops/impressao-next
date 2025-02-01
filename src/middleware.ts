import { NextRequest, NextResponse } from "next/server";

const publicRoutes: { path: string; access: 'private' | 'next' }[] = [
     { path: '/', access: 'next' }, // Página pública
     { path: '/category', access: 'next' }, // Página pública
];

const REDIRECT_DEFAULT = '/';
const ACCESS_KEY = process.env.ACCESS_KEY;

export function middleware(request: NextRequest) {
     const path = request.nextUrl.pathname;
     const accessKey = request.nextUrl.searchParams.get('access_key');

     // Verifica se a rota é pública
     const publicRoute = publicRoutes.find(route => route.path === path);

     // Se for uma rota pública, permite o acesso
     if (publicRoute) {
          return NextResponse.next();
     }

     // Se for uma rota privada e a chave de acesso for inválida, redireciona
     if (!ACCESS_KEY || ACCESS_KEY !== accessKey) {
          return NextResponse.redirect(new URL(REDIRECT_DEFAULT, request.nextUrl));
     }

     // Se a chave estiver correta, permite o acesso
     return NextResponse.next();
}

// Configuração para evitar que o middleware atue sobre APIs e arquivos estáticos
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
