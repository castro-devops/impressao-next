import { createCategory } from "@/services/sessionService";
import { useState } from "react";

interface Category {
  label: string;
}

export function useCreateCategory() {
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [data, setData] = useState<Category | null>(null);

     const handleCreateCategory = async (label:string) => {
          setIsLoading(true);
          setError(null);

          try {
               const response = await createCategory({ label: label });
               console.log(response);
               setData(response);
          } catch (error) {
               setError('Erro ao criar uma nova categoria.');
          } finally {
               setIsLoading(false);
          }
     };

     return { isLoading, error, data, handleCreateCategory };
}