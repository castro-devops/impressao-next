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

export function useCreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<{ message: string; status: number } | null>(null);
  const [data, setData]           = useState<IProduct | null>(null);

  const { handleSendPhoto, error: errorPhoto, isLoading: loadingPhoto } = useSendPhoto();

  const handleCreateProduct = async (productData: Omit<IProduct, 'imgs_id'>, photos: FileList) => {
    setIsLoading(true);
    setError(null);

    try {
      const savePhotos = await handleSendPhoto(photos);

      if (!savePhotos || !savePhotos.ok) {
        setError({ message: errorPhoto?.message || 'Ops, as fotos não puderam ser salvas, tente novamente', status: 500 });
        return;
      }
      const groupPhotos = savePhotos.result.map((group: { photo: {file_id: string}[] }) => { return group.photo[2].file_id })

      const finishProduct: IProduct = {
        ...productData,
        imgs_id: JSON.stringify(groupPhotos),
      }

      const response: IProductResponse = await createProduct(finishProduct);

      if (!response) {
        setError({ message: "Erro ao criar um novo produto.", status: 500 });
        return null;
      }

      let finalResponse: IProductWithConfig = response;

      if (productData.configs) {
        const configResponse = await createConfig(response.id!, productData.configs);
        finalResponse = {
          ...response,
          config: configResponse
        }
      }

      setData(finalResponse);
      return finalResponse;

    } catch (error) {
        setError({ message: "Erro ao criar um novo produto.", status: 500 });
        return null;
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, error, data, handleCreateProduct };
}

export function useGetProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<{ message: string; status: number } | null>(null);
  const [data, setData]           = useState<IProduct | null>(null);

  const handleGetProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProducts();
      setData(response);
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