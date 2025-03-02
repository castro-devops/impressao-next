import { get, post, del } from "@/utils/api";

const BASE_URL = '/api/v1/category';

export function getCategory(label: string = '') {
  return get<{ label: string, slug: string }[] | {error: string}>(`${BASE_URL}${label != '' ? `?label=${label}` : ''}`);
}

export function createCategory(data: { label: string }): Promise<{ label: string} | {error: string}> {
     return post<{ label: string } | {error: string}>(BASE_URL, {
      body: JSON.stringify(data)
     });
}

export function deleteCategory(slug: string): Promise<{ message: string } | {error: string}> {
     return del<{ message: string } | {error: string}>(`${BASE_URL}${slug != '' ? `?slug=${slug}` : ''}`);
}