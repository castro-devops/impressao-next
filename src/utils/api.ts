/**
 * Método construtor default para requisições do lado 'Client'
 * @param url Url EndPoint
 * @param options Configurações da requisição [opcional]
 * @returns [response json do EndPoint]
 */
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
     const response = await fetch(url, {
          headers: {
               'Content-Type': 'application/json',
          },
          ...options,
     });

     if (!response.ok) throw new Error(`Erro: ${response.status}`);

     return response.json();
}

export async function get<T> (url: string): Promise<T> {
     return apiFetch(url);
}

export async function post<T> (url: string, data: any): Promise<T> {
     return apiFetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
     });
}

export async function put<T> (url: string, data: any): Promise<T> {
     return apiFetch(url, {
          method: 'PUT',
          body: JSON.stringify(data),
     });
}