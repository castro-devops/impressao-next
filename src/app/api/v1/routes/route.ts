import { NextResponse } from 'next/server';

export async function GET() {
     const routes = [
          "/api/v1/routes",
          "/api/v1/products",
          "/api/v1/auth",
     ];

     return NextResponse.json(routes);
}