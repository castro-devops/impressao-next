import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { product_id, schema } = await request.json();
    const created_at = new Date().toISOString();

    // 🔹 Validação dos campos obrigatórios
    if (!product_id || typeof schema !== "object" || Object.keys(schema).length === 0) {
      return NextResponse.json(
        { error: "Os campos product_id e schema são obrigatórios e devem conter valores válidos." },
        { status: 400 }
      );
    }

    // 🔹 Criação no banco com validação de chave estrangeira
    const newConfig = await prisma.productConfig.create({
      data: {
        product_id,
        schema: JSON.stringify(schema),
        created_at,
      },
    });

    return NextResponse.json(newConfig, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar a configuração:", error instanceof Error ? error.message : "Erro desconhecido");
    return NextResponse.json(
      { error: "Tivemos um erro ao cadastrar a configuração." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product_id = searchParams.get("product_id");

  if (!product_id) {
    return NextResponse.json({ error: "product_id é obrigatório" }, { status: 400 });
  }

  try {
    const config = await prisma.productConfig.findUnique({
      where: { product_id },
    });

    if (!config) {
      return NextResponse.json({ error: "Nenhuma configuração encontrada." }, { status: 404 });
    }

    // Retorna o schema já como JSON
    const sanitizedConfig = {
      product_id: config.product_id,
      schema: JSON.parse(config.schema),
    };

    return NextResponse.json(sanitizedConfig, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar configurações:", error instanceof Error ? error.message : "Erro desconhecido");
    return NextResponse.json(
      { error: "Não conseguimos encontrar as configurações." },
      { status: 500 }
    );
  }
}