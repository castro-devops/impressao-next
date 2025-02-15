import { post } from "@/utils/api";

const BASE_URL_SEND_MESSAGE = '/api/v1/cloud/sendMessage';
const BASE_URL_SEND_PHOTO = '/api/v1/cloud/sendPhoto';

// export function createMessage(data: string) {
//   return post<string>(BASE_URL_SEND_MESSAGE, { message: data });
// }

export async function sendPhoto(formData: FormData) {
  const result = await post(BASE_URL_SEND_PHOTO, {
    headers: {
      
    },
    body: formData
  });
  return result;
}

