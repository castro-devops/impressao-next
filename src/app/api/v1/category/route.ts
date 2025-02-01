import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import slugify from 'slugify';

export async function GET(request: NextRequest) {

     if (request.method !== 'GET') return NextResponse.json({ error: 'Método GET HTTP não permitido' });

     const { searchParams } = new URL(request.url);
     const label = searchParams.get('label') || '';
     
     const categories = await prisma.category.findMany({
          where: {
               label: {
                    contains: label,
                    mode: 'insensitive',
               }
          },
          orderBy: {
               label: 'asc',
          }
     });

     if (categories.length > 0) {
          return NextResponse.json(categories);
     } else {
          return NextResponse.json({ error: 'Nenhuma categoria encontrada' });
     }

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

export async function DELETE(request: NextRequest) {
     try {
          const { searchParams } = new URL(request.url);
          const slug = searchParams.get('slug');

          if (!slug) {
               return NextResponse.json({ error: 'Slug único não fornecido.'}, { status: 400 });
          }

          const deletedCategory = await prisma.category.delete({
               where: {
                    slug: String(slug)
               }
          });

          return NextResponse.json({ message: "Categoria deletada com sucesso!", deletedCategory });
     } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar categoria", details: error }, { status: 500 });
    }
}