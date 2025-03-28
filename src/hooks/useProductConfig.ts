import { getConfig } from "@/services/ProductConfigService";
import { useState } from "react";

interface IProductConfig {
  product_id: string; // Alterado para alinhar com o schema.prisma
  schema: any;        // `schema` armazenado como JSON no banco
}

export function useProductConfig() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; status: number } | null>(null);
  const [data, setData] = useState<IProductConfig | null>(null);

  const handleGetConfig = async (product_id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!product_id) {
        setError({ message: "O ID do produto precisa ser informado.", status: 400 });
        return null;
      }

      const responseConfig = await getConfig(product_id);
      if (!responseConfig) {
        setError({ message: "Não conseguimos localizar a configuração desse produto.", status: 404 });
        return null;
      }

      // Faz o parse do `schema` para garantir que os dados sejam utilizáveis
      const parsedConfig = {
        ...responseConfig,
        schema: JSON.parse(responseConfig.schema), // Deserializa o `schema`
      };

      setData(parsedConfig);
      return parsedConfig;
    } catch (err) {
      console.error("Erro ao buscar a configuração:", err);
      setError({ message: "Erro ao buscar a configuração do produto.", status: 500 });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { error, data, isLoading, handleGetConfig };
}