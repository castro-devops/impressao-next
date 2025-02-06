import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Log para verificar o corpo da requisição
    const contentType = request.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);

    // Certifique-se de que a requisição é multipart/form-data
    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: "Tipo de conteúdo inválido. Esperado multipart/form-data" }), { status: 400 });
    }

    const formData = await request.formData();

    const chatId = process.env.TELEGRAM_CHAT_ID;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMediaGroup`;

    const photos = formData.getAll("photos"); // Obtém todos o arquivo

    const areAllPhotosBlobs = photos.every(photo => photo instanceof FormData);

    if (areAllPhotosBlobs) {
      return new Response(JSON.stringify({ error: "Foto(s) inválida(s) ou não fornecida(s)" }), { status: 400});
    }

    const groupPhotos = photos.map((photo, index) => {
      const photoFile = new File([photo], `photo${index}.jpg`);
      const mediaObject = {
        type: 'photo',
        media: `attach://${photoFile.name}`
      };
      formData.append(photoFile.name, photoFile);
      return mediaObject;
    });

    // Monta a requisição corretamente
    formData.append('chat_id', chatId!);
    formData.append('media', JSON.stringify(groupPhotos));

    const response = await fetch(telegramUrl, {
      method: "POST",
      body: formData, // O FormData cuida do 'Content-Type' automaticamente
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: response.status });
  } catch (error) {
    console.error("Erro ao enviar foto:", error); // Log para depuração
    return new Response(JSON.stringify({ error: "Erro ao enviar foto", details: error }), {
      status: 500,
    });
  }
}
