import { post, get } from "@/utils/api";

const BASE_URL = '/api/v1/products/configs';

interface IProductConfig {
  product_id: string;
  schema: any | string;
}

// Função para criar a configuração do produto
export async function createConfig(product_id: string, schema: any) {
  const response = await post<IProductConfig>(BASE_URL, {
    body: JSON.stringify({
      product_id,          // Envia com o nome correto
      schema,              // Já serializado na API
    }),
  });

  return response;
}

// Função para buscar a configuração do produto
export async function getConfig(product_id: string) {
  const response = await get<IProductConfig>(`${BASE_URL}${product_id ? `?product_id=${product_id}` : ''}`);
  
  // Faz o parse do schema ao receber
  return {
    ...response,
    schema: JSON.parse(response.schema), // Garantindo que o schema seja deserializado
  };
}