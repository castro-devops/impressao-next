'use client';

import { useSendPhoto } from "@/hooks/useTelegram";
import React, { useEffect, useState } from "react";

const MessageForm: React.FC = () => {
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [disabled, setDisabled] = useState(false);
  const { handleSendPhoto } = useSendPhoto();

  const handleSend = async () => {
    if (!photos) {
      throw new Error('Nenhuma foto selecionada');
    }

    

    if (photos && photos.length <= 5) {
      const buffer = new FormData();
      for (const photo in photos) {
        console.log(photos[photo]);
      }
    } else {
      console.log("Nenhuma foto selecionada.");
    }
  };

  const handleSetPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotos(e.target.files ? e.target.files : null); // Certifique-se de capturar corretamente o arquivo
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" name="photo[]" multiple onChange={handleSetPhoto} />
      <button onClick={handleSend}>Enviar Foto</button>
    </div>
  );
};

export default MessageForm;
