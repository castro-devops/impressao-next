'use client';

import { useState } from "react"
import { useCreateCategory } from "@/hooks/useCreateCategory"

export default function Novo() {
  const [label, setLabel] = useState('');
  const { isLoading, error, handleCreateCategory } = useCreateCategory();
  const handleSubmit = () => {
    handleCreateCategory(label);
  };

     return (
          <div>
               <input
               type="text"
               value={label}
               onChange={(e) => setLabel(e.target.value)}
               placeholder="Nome da categoria"
               />
               <button onClick={handleSubmit} disabled={isLoading}>
               {isLoading ? 'Criando...' : 'Criar Sessão'}
               </button>
               {error && <p>{error}</p>}
          </div>
     )
}