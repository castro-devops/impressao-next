import { createProduct } from "@/services/ProductService";
import { useEffect, useState } from "react";
import { useSendPhoto } from "./useTelegram";
import { createConfig } from "@/services/ProductConfigService";

interface IProduct {
    name        : string;
    description?: string;
    category    : string;
    price       : number;
    imgs_id     : string;
    quantity    : number;
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
      const groupPhotos = savePhotos.result.map((group: { photo: {file_id: string}[] }) => { return group.photo[0].file_id })

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