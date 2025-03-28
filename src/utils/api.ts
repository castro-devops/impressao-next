export async function apiFetch<T>(url: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json() as T; // Forçando a tipagem explícita
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function post<T>(url: string, options: { headers?: Record<string, string>, body: BodyInit }): Promise<T> {
  console.log('options:', options);
  return await apiFetch<T>(url, {
    method: 'POST',
    ...options,
  });
}

export async function get<T>(url: string, headers?: Record<string, string>): Promise<T> {
  return await apiFetch<T>(url, {
    method: 'GET',
    headers: {
      ...headers,
    },
  });
}

export async function put<T>(url: string, options: { headers?: Record<string, string>, body: BodyInit }): Promise<T> {
  return await apiFetch<T>(url, {
    method: 'PUT',
    ...options,
  });
}

export async function del<T>(url: string, headers?: Record<string, string>): Promise<T> {
  return await apiFetch<T>(url, {
    method: 'DELETE',
    headers: {
      ...headers,
    },
  });
}