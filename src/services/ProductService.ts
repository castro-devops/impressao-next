import { get, post, del } from "@/utils/api";

const BASE_URL = '/api/v1/products';

interface IProduct {
     name        : string,
     description?: string,
     category    : string,
     price       : number,
     imgs_id     : string,
     quantity    : number,
}

export async function createProduct(data: IProduct) {
  const response = await post<IProduct>(BASE_URL, {
    body: JSON.stringify(data)
  });
  return response;
}

export function deleteProduct(slug: string): Promise<{ message: string }> {
     return del<{ message: string }>(`${BASE_URL}${slug != '' ? `?slug=${slug}` : ''}`);
}