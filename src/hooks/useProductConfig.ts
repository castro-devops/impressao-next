import { getConfig } from "@/services/ProductConfigService";
import { useState } from "react";

interface IProductConfig {
    productId: string;
    schema   : any;
    }

export function useProductConfig() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<{ message: string; status: number } | null>(null);
  const [data, setData]           = useState<IProductConfig | null>(null);

  const handleGetConfig = async (id_product: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id_product) {
        setError({ message: "O id do produto precisa ser informado.", status: 500 });
        return null;
      }

      const responseConfig = await getConfig(id_product);
      if (!responseConfig) {
        setError({ message: "Não conseguimos localizar a configuração desse produto.", status: 500 });
        return null;
      }
      setData(responseConfig);
      return responseConfig;
    } catch (error) {
        setError({ message: "Erro ao criar um novo produto.", status: 500 });
        return null;
    } finally {
        setIsLoading(false);
    }
  }

  return { error, data, isLoading, handleGetConfig }

}