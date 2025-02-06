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

export function createProduct(data: IProduct) {
     return post<IProduct>(BASE_URL, {
      body: JSON.stringify(data)
     });
}

export function deleteProduct(slug: string): Promise<{ message: string }> {
     console.log(slug);
     return del<{ message: string }>(`${BASE_URL}${slug != '' ? `?slug=${slug}` : ''}`);
}