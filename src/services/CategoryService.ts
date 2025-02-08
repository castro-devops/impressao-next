import { get, post, del } from "@/utils/api";

const BASE_URL = '/api/v1/category';

export function getCategory(label: string = '') {
  return get<{ label: string, slug: string }[]>(`${BASE_URL}${label != '' ? `?label=${label}` : ''}`);
}

export function createCategory(data: { label: string }) {
     return post<{ label: string }>(BASE_URL, {
      body: JSON.stringify(data)
     });
}

export function deleteCategory(slug: string): Promise<{ message: string }> {
     console.log(slug);
     return del<{ message: string }>(`${BASE_URL}${slug != '' ? `?slug=${slug}` : ''}`);
}