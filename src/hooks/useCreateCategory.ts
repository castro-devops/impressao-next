import { createCategory, getCategory, deleteCategory } from "@/services/CategoryService";
import { use, useState } from "react";

interface Category {
  label: string;
}

export function useCreateCategory() {
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [data, setData] = useState<Category | null>(null);

     const handleCreateCategory = async (label:string) => {
          setIsLoading(true);
          setError(null);

          try {
               const response = await createCategory({ label: label });
               console.log(response);
               setData(response);
          } catch (error) {
               setError('Erro ao criar uma nova categoria.');
          } finally {
               setIsLoading(false);
          }
     };

     return { isLoading, error, data, handleCreateCategory };
}

export function useGetCategory() {
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [data, setData] = useState<{label: string, slug: string}[] | null>(null);

     const handleGetCategory = async (label?: string) => {
          setIsLoading(true);
          setError(null);

          try {
               const response = await getCategory(label);
               setData(response);
          } catch (error) {
               setError('Ops, tivemos um problema ao carregar as categorias.');
          } finally {
               setIsLoading(false);
          }
     };

     return { isLoading, error, data, handleGetCategory };
}

export function useDiscardCategory() {
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [data, setData] = useState<{label: string, slug: string}[] | null>(null);

     const handleDiscardCategory = async (slug: string) => {
          setIsLoading(true);
          setError(null);

          try {
               const response = await deleteCategory(slug);
               console.log(response.message);
          } catch (err) {
               setError("Erro ao excluir a categoria");
               console.error(err);
          } finally {
               setIsLoading(false);
          }
     }

     return { isLoading, error, data, handleDiscardCategory };
}