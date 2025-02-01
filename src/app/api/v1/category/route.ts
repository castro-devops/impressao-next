import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import slugify from 'slugify';

export async function GET(request: NextRequest) {

     if (request.method !== 'GET') return NextResponse.json({ error: 'Método GET HTTP não permitido' });

     const { searchParams } = new URL(request.url);
     const id = searchParams.get('id');
     
     const query = await prisma.category.findMany();

     if (query) return NextResponse.json(query);
     return NextResponse.json({ error: 'Nenhuma sessão localizada' });

}

export async function POST(request: NextRequest, response: NextResponse) {
     if (request.method !== 'POST')  return NextResponse.json({ error: 'Método POST HTTP não permitido' });

     const { label } = await request.json();
     if (!label) return NextResponse.json({ error: "O campo 'label' é obrigatório." });

     const slug = slugify(label, { strict: true, lower: true });

     try {
          const newCategory = await prisma.category.create({
               data: { label, slug },
          });
          return NextResponse.json(newCategory);
     } catch (error) {
          return NextResponse.json({ error: "Erro ao criar categoria.", details: error });
     }

}