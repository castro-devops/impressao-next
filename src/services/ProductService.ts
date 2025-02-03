import { get, post, discard } from "@/utils/api";

const BASE_URL = '/api/v1/products';

interface IProduct {
     name: string,
     description?: string,
     category: string,
     price: number,
     quantity: number,
}

export function createProduct(data: IProduct) {
     return post<IProduct>(BASE_URL, data);
}

export function deleteProduct(slug: string): Promise<{ message: string }> {
     console.log(slug);
     return discard<{ message: string }>(`${BASE_URL}${slug != '' ? `?slug=${slug}` : ''}`);
}