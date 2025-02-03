import { createProduct } from "@/services/ProductService";
import { useState } from "react";

interface IProduct {
    name: string;
    description?: string;
    category: string;
    price: number;
    quantity: number;
}

export function useCreateProduct() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<{ message: string; status: number } | null>(null);
    const [data, setData] = useState<IProduct | null>(null);

    const handleCreateProduct = async (productData: IProduct) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await createProduct(productData);
            console.log(response);
            setData(response);
            return true;
        } catch (err) {
            setError({ message: "Erro ao criar um novo produto.", status: 500 });
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, data, handleCreateProduct };
}