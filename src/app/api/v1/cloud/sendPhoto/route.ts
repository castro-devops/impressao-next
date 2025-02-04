import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 🔹 Certifique-se de que os dados são enviados corretamente
    const formData = await request.formData();

    const chatId = process.env.TELEGRAM_CHAT_ID;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

    console.log(chatId);
    console.log(telegramUrl);

    const photo = formData.get("photo"); // 🔹 Obtém o arquivo corretamente

    if (!(photo instanceof Blob)) {
      return new Response(JSON.stringify({ error: "Foto inválida ou não fornecida" }), { status: 400 });
    }


    // 🔹 Monta a requisição corretamente
    const telegramForm = new FormData();
    telegramForm.append("chat_id", chatId!);
    telegramForm.append("photo", photo);

    const response = await fetch(telegramUrl, {
      method: "POST",
      body: telegramForm, // O FormData cuida do 'Content-Type' automaticamente
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: response.status });
  } catch (error) {
    console.error("Erro ao enviar foto:", error); // Log para depuração
    return new Response(JSON.stringify({ error: "Erro ao enviar foto", details: error.message }), {
      status: 500,
    });
  }
}
