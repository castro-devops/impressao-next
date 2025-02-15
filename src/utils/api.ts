import { NextResponse } from "next/server";

export async function apiFetch<T>(url: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        ...options.headers,
      },
      ...options,
    });

    if(!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function get<T>(url: string, headers?: Record<string, string>) {
  return await apiFetch<T>(url, {
    method: 'GET',
    headers: {
      ...headers
      }
    });
}

export async function post<T>(url: string, options: { headers?: Record< string, string>, body: BodyInit}) {
  console.log('options:', options);
  const response = await apiFetch<T>(url, {
    method: 'POST',
    ...options
  });
  return response;
}

export async function put<T>(url: string, options: { headers?: Record<string, string>, body: BodyInit}) {
  return await apiFetch<T>(url, {
    method: 'PUT',
    ...options
  });
}

export async function del<T>(url: string, headers?: Record<string, string>) {
  return await apiFetch<T>(url, {
    method: 'DELETE',
    headers: {
      ...headers
    }
  });
}