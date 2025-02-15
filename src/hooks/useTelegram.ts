import { sendPhoto } from "@/services/TelegramService";
import { NextResponse } from "next/server";
import { useState } from "react";

// export function useCreateMessage() {
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<{ message: string; status: number } | null>(null);
//     const [data, setData] = useState<string | null>(null);

//     const handleCreateMessage = async (productData: string) => {
//         setIsLoading(true);
//         setError(null);

//         try {
//             const response = await createMessage(productData);
//             console.log(response);
//             setData(response);
//             return true;
//         } catch (err) {
//             setError({ message: "Erro ao enviar a mensagem de texto", status: 500 });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return { isLoading, error, data, handleCreateMessage };
// }

export function useSendPhoto() {

  const [error, setError] = useState<{ message: string; status: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendPhoto(photos: FileList) {
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