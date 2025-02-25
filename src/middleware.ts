import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes: { path: string; access: 'private' | 'public' }[] = [
     { path: '/admin', access: 'private' }, // Página pública
     { path: '/admin/*', access: 'private' }, // Página pública
];

const REDIRECT_DEFAULT = '/admin';

export function middleware(request: NextRequest) {
     const path = request.nextUrl.pathname;
     const publicRoute = publicRoutes.find(route => route.path === path);
     const token = request.cookies.get("token")?.value.toString();
     let decoded = {
          exp: 0,
     };
     if (token) {
          decoded = jwtDecode(token);
     }

     // Se for uma rota pública, permite o acesso
     if (!token && publicRoute) {
          return NextResponse.next();
     }

     if (!token && !publicRoute) {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = REDIRECT_DEFAULT;
          return NextResponse.redirect(redirectUrl);
     }

     if (token && publicRoute && publicRoute.access === 'private') {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = '/admin/category';
          return NextResponse.redirect(redirectUrl);
     }

     if (token && !publicRoute) {
          const currentTime = Date.now() / 1000;
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = '/admin';
          try {
               if (currentTime > decoded.exp!) {
                    const response = NextResponse.redirect(redirectUrl);
                    response.cookies.delete('token'); // Deleta o cookie 'token'
                    return response;
               }
          } catch (error) {
               console.error('Erro ao verificar o token:', error);
          }
          // Se a chave estiver correta, permite o acesso
          return NextResponse.next();
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
