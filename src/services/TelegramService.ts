import { post, get } from "@/utils/api";

const BASE_URL_SEND_MESSAGE = '/api/v1/cloud/sendMessage';
const BASE_URL_SEND_PHOTO = '/api/v1/cloud/sendPhoto';

// export function createMessage(data: string) {
//   return post<string>(BASE_URL_SEND_MESSAGE, { message: data });
// }

export async function sendPhoto(formData: FormData) {
  const result = await post(BASE_URL_SEND_PHOTO, {
    body: formData
  });
  return result;
}

interface TelegramFileResponse {
  fileUrl: string;
}

export async function getPhoto(file_id: string): Promise<string> {
  const result: TelegramFileResponse  = await get(`${BASE_URL_SEND_PHOTO}?file_id=${file_id}`, {
      'Content-Type': 'application/json',
  });

  if (!result!.fileUrl) throw new Error('Erro ao buscar a foto');
  return result!.fileUrl;

}