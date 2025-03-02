'use client';

import { useEffect, useState } from "react";
import { useCreateCategory, useDiscardCategory, useGetCategory } from "@/hooks/useCreateCategory";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';  // Importando ícone de loading
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from "@/services/FirebaseConfig";
import { useRouter } from "next/navigation";
import GuidanceButton from '@/components/guidanceVideo';
import FlashMessage from "@/components/flashMessage";

export default function Novo() {
  const router = useRouter();
  const [signOut] = useSignOut(auth);
  const [label, setLabel] = useState('');
  const { isLoading: createLoading, error: createError, data: createData, handleCreateCategory }  = useCreateCategory();
  const { isLoading: fetchLoading, error: fetchError, data: fetchData, handleGetCategory }        = useGetCategory();
  const { isLoading: deleteLoading, error: deleteError, data: deleteData, handleDiscardCategory } = useDiscardCategory();

  const [error, setError] = useState<{message?: string, type?: "error" | "warning" | "success" | "info", show: boolean}>({
    message: '',
    type: 'info',
    show: false
  });

  useEffect(() => {
    if (createError) {
    setError({ message: createError.message, type: "error", show: true });
  } else if (fetchError) {
    setError({ message: fetchError.message, type: "error", show: true });
  } else if (deleteError) {
    setError({ message: deleteError.message, type: "error", show: true });
  } else {
    setError({ show: false }); // Nenhum erro
  }
  }, [createError, fetchError, deleteError]);

  const handleSubmit = () => {
    handleCreateCategory(label);
    setLabel('');
  };

  useEffect(() => {
    handleGetCategory();
  }, [createData, deleteData]);

  const userLogout = async () => {
    const success = await signOut();
    if (success) {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
    router.push('/');
  }

  useEffect(() => {
    handleGetCategory(label);
  }, [label]);

  const handleDeleteCategorie = async (slug: string) => {
    await handleDiscardCategory(slug);
    setLabel('');
    handleGetCategory();
  }

  return (
    <div className="relative h-full p-4 flex flex-col gap-5">
      {/* Barra de navegação */}
      <div className="relative bg-white flex justify-stretch rounded-lg shadow-sm border border-neutral-100 text-center">
        {/* <a href="/" className="py-3 flex-1 transition border-b-2 border-white hover:border-blue-500 cursor-pointer">Shop</a> */}
        <a href="/admin/product" className="py-3 flex-1 transition border-b-2 border-white hover:border-blue-500 cursor-pointer">Produtos</a>
        <a href="/admin/category" className="py-3 flex-1 transition border-b-2 border-white hover:border-blue-500 cursor-pointer">Categorias</a>
        <a onClick={userLogout} className="py-3 flex-1 transition border-b-2 border-white hover:border-blue-500 cursor-pointer">Sair</a>
      </div>

      {/* Input e Botão de Criar Categoria */}
      <div className="relative bg-white rounded-3xl shadow-md flex items-center justify-end">
        <input
          className="p-4 flex-1 bg-transparent outline-none"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          placeholder="Nome da categoria"
        />
        <button
          className="py-2.5 px-3.5 mr-2 bg-blue-500 hover:bg-blue-600 transition text-sm text-white font-medium rounded-full"
          onClick={handleSubmit}
          disabled={createLoading}
        >
          {createLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            'Criar'
          )}
        </button>
      </div>

      {/* Se houver erro ao buscar categorias */}
      <FlashMessage type="error" message={error.message!} show={error.show} onClick={() => setError({ show: false })} />
      {/* Exibição das categorias */}
      <div className="flex-1 grid grid-flow-row auto-rows-max gap-2 md:grid-cols-2 lg:grid-cols-3">
        {fetchLoading ? (
          <div className="col-span-full text-center">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl" />
            <p>Carregando...</p>
          </div>
        ) : fetchData && fetchData.length > 0 ? (
          fetchData?.map((categorie) => (
            <div key={categorie.slug} className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm border border-neutral-100">
              <div><FontAwesomeIcon icon={faCheck} /></div>
              <div className="flex-1">
                <p>{categorie.label}</p>
              </div>
              <div
                onClick={() => handleDeleteCategorie(categorie.slug)}
                className="text-neutral-400 cursor-pointer hover:text-red-500 hover:border-red-500 w-7 aspect-square flex items-center justify-center rounded-full text-sm border border-neutral-400 transition"
              >
                {deleteLoading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-500 mt-2 text-center text-lg col-span-full">
            Opa, vamos criar uma nova categoria?
          </p>
        )}
      </div>

      {/* Erro ao excluir categoria */}

      <GuidanceButton />
    </div>
  );
}
