import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
     const products = await prisma.product.findMany();
     if (products) return NextResponse.json(products);
     return NextResponse.json({ error: 'Não foi possível carregar todos os produtos'});
}

export async function POST( request: Request ) {
     const { name, description, category, price, quantity } = await request.json();

     try {
          const newProduct = await prisma.product.create({
               data: {
                    name,
                    description,
                    category,
                    price,
                    quantity
               }
          });
          return NextResponse.json(newProduct, { status: 201 });
     } catch ( error ) {
          return NextResponse.json({ error: 'Tivemos um erro ao cadastrar o produto' }, { status: 400 });
     }
}