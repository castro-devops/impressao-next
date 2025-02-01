'use client';

import { use, useEffect, useState } from "react"
import { useCreateCategory, useGetCategory } from "@/hooks/useCreateCategory"

export default function Novo() {
  const [label, setLabel] = useState('');
  const { isLoading: createLoading , error: createError, handleCreateCategory } = useCreateCategory();
  const { isLoading: fetchLoading, error: fetchError, data: fetchData, handleGetCategory } = useGetCategory();

  const handleSubmit = () => {
    handleCreateCategory(label);
  };

  useEffect(() => {
     handleGetCategory();
  }, [])

   console.log(fetchData)

     return (
          <div className="relative h-full p-4 flex flex-col gap-5">
          <div className="relative bg-white rounded-3xl shadow-md flex items-center justify-end">
               <input
               className="p-4 flex-1 bg-transparent outline-none"
               type="text"
               value={label}
               onChange={(e) => setLabel(e.target.value)}
               placeholder="Nome da categoria"
               />
               <button className="py-2.5 px-3.5 mr-2 bg-blue-500 text-sm text-white font-medium rounded-full" onClick={handleSubmit} disabled={createLoading}>
               {createLoading ? 'Criando...' : 'Criar'}
               </button>
               {createError && <p>{createError}</p>}
          </div>
          <div className="p-4 flex-1">

          </div>
          </div>
     )
}