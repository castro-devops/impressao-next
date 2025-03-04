import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
    try {
        const products = await prisma.product.findMany();
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar os produtos:", error); // Logando o erro
        return NextResponse.json(
            { error: "Erro ao buscar os produtos." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { name, description, category, price, quantity, imgs_id } = await request.json();
        const slug = slugify(name, { strict: true, lower: true }) + "-" + Math.random().toString(36).slice(2, 11);

        // 🔹 Validação manual para garantir que todos os campos necessários estão preenchidos
        if (!name || !category) {
            return NextResponse.json(
                { error: "Os campos nome e categoria são obrigatórios." },
                { status: 400 }
            );
        }

        console.log(name, slug, description, category, imgs_id);

        // 🔹 Criando o produto
        const newProduct = await prisma.product.create({
            data: { name, slug, description, category, imgs_id },
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Erro ao cadastrar o produto:", error instanceof Error ? error.message : error); // Logando o erro com segurança
        return NextResponse.json(
            { error: "Tivemos um erro ao cadastrar o produto." },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
  try {
    // Pegando o ID do produto a ser deletado da URL ou do corpo da requisição
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug"); // Se estiver na query string

    if (!slug) {
      return NextResponse.json({ error: "Slug não informado" }, { status: 400 });
    }

    const delProduct = await prisma.product.delete({
      where: { slug }
    });

    return NextResponse.json({ message: "Produto deletado com sucesso!", product: delProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar o produto" }, { status: 500 });
  }
}