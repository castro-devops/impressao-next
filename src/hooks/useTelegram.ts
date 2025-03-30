import { sendPhoto, getPhoto } from "@/services/TelegramService";
import { useState } from "react";

export function useGetPhoto() {
  const [error, setError] = useState<{ message: string; status: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleGetPhoto(file_id: string) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPhoto(file_id);
      return response;
    } catch (error: any) {
      setError({ message: error.message || "Erro ao carregar a foto.", status: 500 });
      return error;
    } finally {
      setIsLoading(false);
    }
  }

  return { handleGetPhoto, error, isLoading };
}

export function useSendPhoto() {

  const [error, setError] = useState<{ message: string; status: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendPhoto(photos: FileList, category: string) {
      setIsLoading(true);
      setError(null);

    if (photos.length > 3) {
      setError({ message: 'Você pode enviar até 3 imagens por produto.', status: 500 });
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < photos.length; i++) {
      formData.append('photos', photos[i]);
    }
    formData.append('category_slug', category);

    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]); // Deve exibir os arquivos
    // }

    try {
      const response = await sendPhoto(formData);
      return response;
    } catch (error: any) {
      setError({ message: "Erro ao enviar a foto.", status: 500 });
      return error;
    } finally {
      setIsLoading(false);
    }
  }
  return { handleSendPhoto, error, isLoading };
}