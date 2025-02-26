import { NextRequest, NextResponse } from "next/server";

  const chatId = process.env.TELEGRAM_CHAT_ID;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file_id = searchParams.get('file_id');

  if (!file_id) {
    return NextResponse.json({ error: "file_id é obrigatório" }, { status: 400 });
  }

  try {
    // 1. Buscar o caminho do arquivo no Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${file_id}`;


    const response = await fetch(telegramUrl);
    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json({ error: "Erro ao buscar file_path" }, { status: 500 });
    }

    const file_path = data.result.file_path;

    // 2. Construir URL final para download
    const fileUrl = `https://api.telegram.org/file/bot${botToken}/${file_path}`;

    return NextResponse.json({ fileUrl });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMediaGroup`;
  try {
    // Log para verificar o corpo da requisição
    const contentType = request.headers.get('content-type') || '';

    // Certifique-se de que a requisição é multipart/form-data
    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: "Tipo de conteúdo inválido. Esperado multipart/form-data" }), { status: 400 });
    }

    const formData = await request.formData();

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
