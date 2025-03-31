import { createProduct } from "@/services/ProductService";
import { useSendPhoto } from "./useTelegram";
import { createConfig } from "@/services/ProductConfigService";
import { useState } from "react";

interface IProduct {
  name: string;
  description?: string;
  category_slug: string;
  imgs_id: string[];
}

interface IProductResponse extends IProduct {
  id?: string;
}

interface IProductWithConfig extends IProductResponse {
  schema?: string | undefined;
  config?: string | undefined;
}

interface UseCreateProductReturn {
  isLoading: boolean;
  error: { message: string; status: number } | null;
  data: IProductWithConfig | null;
  handleCreateProduct: (
    productData: Omit<IProductWithConfig, "imgs_id">,
    photos: FileList
  ) => Promise<IProductWithConfig | null>;
}

export function useCreateProduct(): UseCreateProductReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; status: number } | null>(null);
  const [data, setData] = useState<IProductWithConfig | null>(null);

  const { handleSendPhoto, error: errorPhoto, isLoading: loadingPhoto } = useSendPhoto();

  const handleCreateProduct = async (
    productData: Omit<IProductWithConfig, "imgs_id">,
    photos: FileList
  ): Promise<IProductWithConfig | null> => {
    setIsLoading(true);
    setError(null);

    console.log('productData', productData);

    try {
      // Enviando as fotos
      const savePhotos = await handleSendPhoto(photos, productData.category_slug);

      console.log('savePhotos', savePhotos);

      if (!savePhotos || !savePhotos.ok) {
        setError({
          message: errorPhoto?.message || "Ops, as fotos não puderam ser salvas, tente novamente",
          status: 500,
        });
        return null;
      }

      // Processando os IDs das fotos
      const photoIds = savePhotos.result.map((group: {file_id: string, file_unique_id: string[] }) => {
          return {
            file_id: group.file_id,
            file_unique_id: JSON.stringify(group.file_unique_id),
          }
      });

      // Preparando os dados do produto
      const finishProduct: IProduct = {
        ...productData,
        imgs_id: photoIds,
      };

      // Criando o produto
      const response: IProductResponse = await createProduct(finishProduct);

      if (!response) {
        setError({ message: "Erro ao criar um novo produto.", status: 500 });
        return null;
      }

      // Criando as configurações, se necessário
      let finalResponse: IProductWithConfig = response;

      console.log('final', finalResponse);

      if (productData.config) {
        const configResponse = await createConfig(response.id!, productData.config);

        finalResponse = {
          ...response,
          schema: configResponse.schema,
        };
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