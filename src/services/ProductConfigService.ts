import { post, get } from "@/utils/api";

const BASE_URL = '/api/v1/products';

interface IProductConfig {
    productId: string;
    schema   : any;
    }

export async function createConfig(productId: string, schema: any) {
  const response = await post<IProductConfig>(`${BASE_URL}/configs`, {
    body: JSON.stringify({ productId, schema })
  });
  return response;
}

export async function getConfig(productId: string) {
  return await get<IProductConfig>(`${BASE_URL}/configs${productId != '' ? `?id_product=${productId}` : ''}`);
}