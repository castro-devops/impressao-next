import { createCategory, getCategory, deleteCategory } from "@/services/CategoryService";
import { useState } from "react";

interface Category {
  label: string;
}

export function useCreateCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{message: string, status: number} | null>(null);
  const [data, setData] = useState<Category | null>(null);

  const handleCreateCategory = async (label:string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createCategory({ label: label });
      if ("error" in response) {
        throw new Error (response.error);
      }
      setData(response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar uma nova categoria.';
      const errorData: IError = { error: errorMessage };
      setError({ message: errorMessage, status: 500 });
    } finally {
          setIsLoading(false);
    }
  };

  return { isLoading, error, data, handleCreateCategory };
}

interface ICategory {
  label: string;
  slug: string;
}

interface IError {
  error: string;
}

// A resposta pode ser um array de categorias OU um objeto de erro
type IGetCategoryResponse = ICategory[] | IError;

export function useGetCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; status: number } | null>(null);
  const [data, setData] = useState<{label: string, slug: string}[] | null>(null);

  const handleGetCategory = async (label?: string): Promise<IGetCategoryResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCategory(label);
      if ("error" in response) {
        throw new Error(response.error);
      }
      
      setData(response.length > 0 ? response : []);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar as categorias";
      const errorData: IError = { error: errorMessage };
      setError({ message: errorMessage, status: 500 });
      setData([]);
      return errorData;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, data, handleGetCategory };
}

export function useDiscardCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string, status: number} | null>(null);
  const [data, setData] = useState<boolean>(false);

  const handleDiscardCategory = async (slug: string) => {

    setIsLoading(true);
    setError(null);
    setData(true);

    try {

      const response = await deleteCategory(slug);
      if ("error" in response) {
      throw new Error('Ops, tivemos um erro ao deletar esta categoria.');
      }

    } catch (err) {

      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      const errorData: IError = { error: errorMessage };
      setError({ message: errorMessage, status: 500 });

    } finally {

      setData(false);
      setIsLoading(false);

    }
  }

  return { isLoading, error, data, handleDiscardCategory };
}