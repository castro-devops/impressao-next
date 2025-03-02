import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes: { path: string; access: 'private' | 'public' | 'blocked' }[] = [
  { path: '/admin', access: 'public' },
  { path: '/admin/product', access: 'private' },
  { path: '/admin/category', access: 'private' },
  { path: '/', access: 'blocked' }
];

const REDIRECT_DEFAULT = '/admin';

export function middleware(request: NextRequest) {
  const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  const targetDate = '2025-03-02'; // Data específica

  const path = request.nextUrl.pathname;
  console.log(path);
  const publicRoute = publicRoutes.find(route => path == route.path);
  const token = request.cookies.get("token")?.value?.toString();

  let decoded = { exp: 0 };
  if (token) {
    try {
      decoded = jwtDecode(token);  // Tente decodificar o token apenas se existir
      console.log('Token decoded:', decoded);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
    }
  }

  // Se for uma rota bloqueada
  if (publicRoute?.access === 'blocked') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_DEFAULT;
    return NextResponse.redirect(redirectUrl);
  }

  // Se a data de hoje for igual à targetDate, forçar o cache 'no-store'
  if (today === targetDate) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    console.log('Cache-Control set to no-store');
  }

  // Se a rota for pública e não houver token, permite o acesso
  if (!token && publicRoute?.access === 'public') {
    console.log(publicRoute);
    console.log('Public route and no token, access granted');
    return NextResponse.next();
  }

  // Se não houver token e a rota for privada, redireciona
  if (!token && publicRoute?.access === 'private') {
    console.log('Private route and no token, redirecting');
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_DEFAULT;
    return NextResponse.redirect(redirectUrl);
  }

  // Se o token estiver presente e a rota for privada, verifica a expiração
  const currentTime = Date.now() / 1000;
  if (token && publicRoute?.access === 'private' && currentTime > decoded.exp) {
    console.log('Token expired, redirecting');
    const response = NextResponse.redirect(REDIRECT_DEFAULT);
    response.cookies.delete('token');  // Deleta o cookie 'token' caso expirado
    return response;
  }

  // Se o token estiver presente e a rota for pública e não privada, redireciona para /admin/category
  if (token && publicRoute?.access === 'public') {
    console.log('Token present and public route, redirecting to /admin/category');
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin/category';
    return NextResponse.redirect(redirectUrl);
  }

  // Caso todas as verificações passem, continua o processo
  console.log('Middleware passes, continuing');
  return NextResponse.next();
}

// Configuração para evitar que o middleware atue sobre APIs e arquivos estáticos
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
