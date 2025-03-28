import { post, get } from "@/utils/api";

const BASE_URL_SEND_PHOTO = '/api/v1/cloud/sendPhoto';

export async function sendPhoto(formData: FormData): Promise<{ ok: boolean; result: { photo: { file_id: string }[] }[] }> {
  const response = await post<{ ok: boolean; result: { photo: { file_id: string }[] }[] }>(BASE_URL_SEND_PHOTO, {
    body: formData,
  });

  // Verifica explicitamente se a propriedade `ok` existe e é falsa
  if (!response.ok) {
    throw new Error('Erro ao enviar fotos.');
  }

  return response;
}

interface TelegramFileResponse {
  fileUrl: string;
}

export async function getPhoto(file_id: string): Promise<string> {
  const result: TelegramFileResponse = await get(`${BASE_URL_SEND_PHOTO}?file_id=${file_id}`, {
    'Content-Type': 'application/json',
  });

  if (!result.fileUrl) throw new Error('Erro ao buscar a foto');
  return result.fileUrl;
}