'use client'

import { useSendPhoto } from "@/hooks/useTelegram";
import React, { useState } from "react";

const MessageForm: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const { handleSendPhoto } = useSendPhoto();

  const handleSend = async () => {
    if (photo) {
      const formData = new FormData();
      formData.append("photo", photo);

      const response = await handleSendPhoto(formData);
      console.log(response);
    } else {
      console.log("Nenhuma foto selecionada.");
    }
  };

  const handleSetPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]); // Captura o arquivo corretamente
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" name="photo" onChange={handleSetPhoto} />
      <button onClick={handleSend}>Enviar Foto</button>
    </div>
  );
};

export default MessageForm;
