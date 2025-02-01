import { get, post } from "@/utils/api";

const BASE_URL = '/api/v1/category';

export function getCategory() {
     return get<{ label: string, slug: string }[]>(BASE_URL);
}

export function createCategory(data: { label: string }) {
     return post<{ label: string }>(BASE_URL, data);
}