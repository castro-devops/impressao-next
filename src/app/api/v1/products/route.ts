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
        const slug = slugify(name, { strict: true, lower: true });

        // 🔹 Validação manual para garantir que todos os campos necessários estão preenchidos
        if (!name || !category || price === undefined || quantity === undefined) {
            return NextResponse.json(
                { error: "Os campos nome, categoria, preço e quantidade são obrigatórios." },
                { status: 400 }
            );
        }

        // 🔹 Criando o produto
        const newProduct = await prisma.product.create({
            data: { name, slug, description, category, price, quantity, imgs_id },
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
