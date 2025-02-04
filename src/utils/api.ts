/**
 * Método construtor default para requisições do lado 'Client'
 * @param url Url EndPoint
 * @param options Configurações da requisição [opcional]
 * @returns [response json do EndPoint]
 */
export async function apiFetch<T>(url: string, options?: RequestInit, contentType?: string): Promise<T> {
    const response: Response = await fetch(url, {
        headers: {
            'Content-Type': contentType ?? 'application/json',
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export async function get<T> (url: string): Promise<T> {
     return apiFetch(url);
}

export async function post<T>(url: string, data: any): Promise<T> {
  return apiFetch(url, {
    method: "POST",
    body: data,
  });
}

export async function put<T> (url: string, data: any): Promise<T> {
     return apiFetch(url, {
          method: 'PUT',
          body: JSON.stringify(data),
     });
}

export async function discard<T>(url: string, body?: unknown): Promise<T> {
    try {
        const response = await apiFetch<T>(url, {
            method: 'DELETE',
            body: body ? JSON.stringify(body) : undefined,
        });

        return response; // Já é do tipo T
    } catch (error) {
        console.error("Erro ao realizar DELETE:", error);
        throw error;
    }
}