import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import slugify from 'slugify';

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const label = searchParams.get('label');
  
  const categories = await prisma.category.findMany({
      where: label ? {
        active: true,
        label: {
            contains: label,
        }
      } : {},
      select: {
        label: true,
        slug: true,
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

export async function POST(request: NextRequest) {

     const { label } = await request.json();
     if (!label) return NextResponse.json({ error: "O campo 'label' é obrigatório." });

     const slug = slugify(label, { strict: true, lower: true });

     try {
          const newCategory = await prisma.category.create({
               data: { label, slug },
          });
          return NextResponse.json(
               { message: 'Categoria criada com sucesso', newCategory },
               { status: 201 }
          );
     } catch (error) {
          return NextResponse.json(
               { error: 'Ocorreu um erro ao criar a categoria' },
               { status: 500 }
          );
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