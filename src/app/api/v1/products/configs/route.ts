import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { productId, schema } = await request.json();
        const createdAt = new Date().toISOString();

        // 🔹 Validação manual para garantir que todos os campos necessários estão preenchidos
        if (!productId || !schema) {
            return NextResponse.json(
                { error: "Os campos productId e schema são obrigatórios." },
                { status: 400 }
            );
        }

        // 🔹 Criando a configuração
        const newConfig = await prisma.productConfig.create({
            data: { productId, schema, createdAt },
        });
        return NextResponse.json(newConfig, { status: 201 });
    } catch (error) {
        console.error("Erro ao cadastrar a configuração:", error instanceof Error ? error.message : error); // Logando o erro com segurança
        return NextResponse.json(
            { error: "Tivemos um erro ao cadastrar a configuração." },
            { status: 500 }
        );
    }
}