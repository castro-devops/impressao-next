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
    const { name, description, category_slug, imgs_id } = await request.json();
    const slug = slugify(name, { strict: true, lower: true }) + "-" + Math.random().toString(36).slice(2, 11);

    if (!name || !category_slug) {
      return NextResponse.json(
        { error: "Os campos nome e categoria_slug são obrigatórios." },
        { status: 400 }
      );
    }

    // console.log('DATAS', name, description, category_slug, imgs_id);

    // Validação: Verificar se a categoria existe
    const categoryExists = await prisma.category.findUnique({
      where: { slug: category_slug },
    });
    if (!categoryExists) {
      return NextResponse.json(
        { error: "Categoria não encontrada!" },
        { status: 400 }
      );
    }

    // Criando o produto com imagens
    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        category_slug,
      },
    });

    console.log('newProduct', newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar o produto:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Tivemos um erro ao cadastrar o produto." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug não informado" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { product_imgs: true, config: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado!" }, { status: 404 });
    }

    // Excluindo imagens associadas
    if (product.product_imgs.length > 0) {
      await prisma.imagesOnProduct.deleteMany({
        where: { product_id: product.id },
      });
    }

    // Excluindo configurações associadas
    if (product.config) {
      await prisma.productConfig.delete({
        where: { product_id: product.id },
      });
    }

    // Excluindo o produto
    const delProduct = await prisma.product.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Produto deletado com sucesso!", product: delProduct }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar o produto:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Erro ao deletar o produto" }, { status: 500 });
  }
}