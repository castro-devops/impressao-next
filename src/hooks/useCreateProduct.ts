import { createProduct, deleteProduct, getProducts } from "@/services/ProductService";
import { useEffect, useState } from "react";
import { useSendPhoto } from "./useTelegram";
import { createConfig } from "@/services/ProductConfigService";

interface IProduct {
    name        : string;
    description?: string;
    category    : string;
    imgs_id     : string;
    configs?    : any[];
}

interface IProductConfig {
  productId: string;
  schema   : any;
}

interface IProductResponse extends IProduct {
  id?: string,
}
interface IProductWithConfig extends IProductResponse {
  config?: IProductConfig | string;
}

interface UseCreateProductReturn {
  isLoading: boolean;
  error: { message: string; status: number } | null;
  data: IProduct[] | IProductWithConfig | null;
  handleCreateProduct: (productData: Omit<IProduct, 'imgs_id'>, photos: FileList) => Promise<IProductWithConfig | null>;
}

export function useCreateProduct(): UseCreateProductReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<{ message: string; status: number } | null>(null);
  const [data, setData] = useState<IProduct[] | IProductWithConfig | null>(null);

  const { handleSendPhoto, error: errorPhoto, isLoading: loadingPhoto } = useSendPhoto();

  const handleCreateProduct = async (productData: Omit<IProduct, 'imgs_id'>, photos: FileList): Promise<IProductWithConfig | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const savePhotos = await handleSendPhoto(photos);

      if (!savePhotos || !savePhotos.ok) {
        setError({ message: errorPhoto?.message || 'Ops, as fotos não puderam ser salvas, tente novamente', status: 500 });
        return null;
      }
      const groupPhotos = savePhotos.result.map((group: { photo: { file_id: string }[] }) => { return group.photo[2].file_id });

      const finishProduct: IProduct = {
        ...productData,
        imgs_id: JSON.stringify(groupPhotos),
      };

      const response: IProductResponse = await createProduct(finishProduct);

      if (!response) {
        setError({ message: "Erro ao criar um novo produto.", status: 500 });
        return null; // Retorno explícito de null
      }

      let finalResponse: IProductWithConfig = response;

      if (productData.configs) {
        const configResponse = await createConfig(response.id!, productData.configs);
        finalResponse = {
          ...response,
          config: configResponse,
        };
      }

      setData(finalResponse);
      return finalResponse; // Retorno explícito de IProductWithConfig

    } catch (error) {
      setError({ message: "Erro ao criar um novo produto.", status: 500 });
      return null; // Retorno explícito de null
    } finally {
      setIsLoading(false);
    }
  };


  return { isLoading, error, data, handleCreateProduct };
}

interface IProductListResponse {
  products: IProduct[];
  total: number;
}

export function useGetProducts(): {
  isLoading: boolean;
  error: { message: string; status: number } | null;
  data: IProductListResponse | null;
  handleGetProducts: () => Promise<void>;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; status: number } | null>(null);
  const [data, setData] = useState<IProductListResponse | null>(null);

  const handleGetProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProducts(); // A resposta esperada é do tipo IProductListResponse
      setData(response); // Agora o tipo de 'response' está correto
    } catch (error) {
      setError({ message: "Erro ao buscar os produtos.", status: 500 });
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, data, handleGetProducts };
}

export function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<{ message: string; status: number } | null>(null);

  const handleDeleteProduct = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!slug) {
        setError({ message: 'Ops, não conseguimos identificar o produto a ser deletado.', status: 500 });
        return;
      }

      const response = await deleteProduct(slug);
      return response;
    } catch {
      setError({ message: "Ops, falha ao excluir produto.", status: 500 });
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, handleDeleteProduct }

}