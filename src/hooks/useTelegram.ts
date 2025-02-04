import { createMessage, sendPhoto } from "@/services/TelegramService";
import { useState } from "react";

export function useCreateMessage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<{ message: string; status: number } | null>(null);
    const [data, setData] = useState<string | null>(null);

    const handleCreateMessage = async (productData: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await createMessage(productData);
            console.log(response);
            setData(response);
            return true;
        } catch (err) {
            setError({ message: "Erro ao enviar a mensagem de texto", status: 500 });
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, data, handleCreateMessage };
}

export function useSendPhoto() {
  const handleSendPhoto = async (formData: FormData) => {
    return await sendPhoto(formData);
  };

  return { handleSendPhoto };
}
