import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface TelegramFileResponse {
  ok: boolean;
  result: {
    file_path: string;
  };
}

const chatId = process.env.TELEGRAM_CHAT_ID;
const botToken = process.env.TELEGRAM_BOT_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file_id = searchParams.get('file_id');

  if (!file_id) {
    return NextResponse.json({ error: "file_id é obrigatório" }, { status: 400 });
  }

  try {
    // URL do Telegram para buscar o caminho do arquivo
    const telegramUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${file_id}`;
    const response = await fetch(telegramUrl);
    const data: TelegramFileResponse = await response.json();

    if (!data.ok) {
      return NextResponse.json({ error: "Erro ao buscar file_path" }, { status: 500 });
    }

    const file_path = data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${botToken}/${file_path}`;

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error("Erro ao buscar arquivo:", error);
    return NextResponse.json({ error: "Erro interno", details: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMediaGroup`;

  try {

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: "Tipo de conteúdo inválido. Esperado multipart/form-data" }, { status: 400 });
    }

    const formData = await request.formData();
    const photos = formData.getAll("photos");
    const category_slug = formData.get("category_slug");

    const groupPhotos = photos.map((photo, index) => {
      const photoFile = new File([photo], `photo${index}.jpg`);
      const mediaObject = {
        type: 'photo',
        media: `attach://${photoFile.name}`,
      };
      formData.append(photoFile.name, photoFile);
      return mediaObject;
    });

    formData.append('chat_id', chatId!);
    formData.append('media', JSON.stringify(groupPhotos));

    // const response = await fetch(telegramUrl, {
    //   method: "POST",
    //   body: formData,
    // });

    // const result = await response.json();

    // console.log(result);

    // // Validação de retorno explícita
    // if (!result.ok) {
    //   console.error("Erro no Telegram:", result);
    //   throw new Error('Erro ao enviar fotos para o Telegram.');
    // }

    // const fileIds = result.result.map((photoGroup: { photo: { file_id: string, file_unique_id: string }[] }) =>{
    //   console.log(photoGroup);
    //   return {
    //     file_id: photoGroup.photo[0].file_id,
    //     file_unique_id: photoGroup.photo.map(photo => photo.file_unique_id)
    //   }
    // });

    const fileIds = [
      {
        file_id: 'AgACAgEAAxkDAAPCZ-fviiL7-9iM4ViKiYERWK90hnsAArKsMRsFQ0BHr-NF9TdeXyIBAAMCAANzAAM2BA',
        file_unique_id: [
          'AQADsqwxGwVDQEd4',
          'AQADsqwxGwVDQEdy',
          'AQADsqwxGwVDQEd9',
          'AQADsqwxGwVDQEd-'
        ]
      },
      {
        file_id: 'AgACAgEAAxUHZ-fxIUoi5EetvaC5sP56KE2ORbUAArOsMRsFQ0BHBLGWtnEe3oMBAAMCAANzAAM2BA',
        file_unique_id: [ 'AQADs6wxGwVDQEd4', 'AQADs6wxGwVDQEdy', 'AQADs6wxGwVDQEd9' ]
      }
    ]

    console.log('registerPhoto before');

    const registerPhoto = await prisma.productImages.createMany({
      data: fileIds.map(file => ({
        telegram_id: JSON.stringify(file.file_unique_id),
        category_slug: String(category_slug),
        telegram_group_id: file.file_id,
      }))
    });

    if (registerPhoto.count < 1) {
      console.error("Erro no Banco de Dados:", registerPhoto);
      throw new Error('Nã conseguimos salvar as imagens no nosso banco de dados.');
    }

    return NextResponse.json({ ok: true, result: fileIds }, { status: 200 });
  } catch (error) {
    console.error("Erro ao enviar foto:", error);
    return NextResponse.json({ error: "Erro ao enviar foto", details: (error as Error).message }, { status: 500 });
  }
}