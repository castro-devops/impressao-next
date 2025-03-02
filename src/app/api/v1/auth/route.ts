import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Token armazenado" });
  
  response.cookies.set("token", token, {
      httpOnly: false, // Torna o cookie inacessível ao JavaScript no navegador
      secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
      sameSite: "strict", // Previne ataques CSRF
      path: "/", // O cookie estará disponível em todas as rotas
      maxAge: 60 * 60 * 24 * 7, // Expira em 7 dias
  });

  return response;
}
