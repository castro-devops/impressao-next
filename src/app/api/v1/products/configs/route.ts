import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface IProductConfig {
    productId: string;
    schema   : any;
    }

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('id_product');

  if (!productId) {
    return NextResponse.json({ error: "id_product é obrigatório" }, { status: 400 });
  }

  try {

    const config: Omit<IProductConfig, "id" | "updated_at"> | null = await prisma.productConfig.findUnique({
      where: { productId }
    });

    if (!config) {
      return NextResponse.json({ error: "Nenhuma configuração encontrada." }, { status: 404 });
    }

    const sanitizedConfig = config
  ? {
      productId: config.productId,
      schema: config.schema.map((item: any) => ({
        ...item,
        config: JSON.parse(item.config), // Faz o parse da string JSON
      })),
    }
  : null;

    return NextResponse.json({ sanitizedConfig }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
            { error: "Não conseguimos encontrar as configurações." },
            { status: 500 }
        );
  }
}