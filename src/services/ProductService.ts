import { get, post, del } from "@/utils/api";

const BASE_URL = '/api/v1/products';

interface IProduct {
  name: string;
  description?: string;
  category_slug: string; // Alterar de "category" para "category_slug"
  imgs_id: string[];
}

export async function getProducts(page: number = 1, limit: number = 10, filter: string = '') {
  return get<IProduct[]>(`${BASE_URL}?page=${page}&limit=${limit}${filter != ''? `&filter=${filter}` : ''}`);
}

export async function createProduct(data: IProduct) {
  const response = await post<IProduct>(BASE_URL, {
    body: JSON.stringify(data),
  });
  return response;
}

export function deleteProduct(slug: string): Promise<{ message: string }> {
     return del<{ message: string }>(`${BASE_URL}${slug != '' ? `?slug=${slug}` : ''}`);
}