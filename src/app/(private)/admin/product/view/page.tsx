'use client';

import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from "@/services/FirebaseConfig";
import { useRouter } from "next/navigation";
import { useDeleteProduct, useGetProducts } from '@/hooks/useCreateProduct';
import { useEffect, useState } from 'react';
import { useGetCategory } from '@/hooks/useCreateCategory';
import Toast from '@/components/toastLoading';
import { useGetPhoto } from '@/hooks/useTelegram';
import { useProductConfig } from '@/hooks/useProductConfig';
import { moneyBRL } from '@/utils/formatValues';

interface IProductConfig {
  productId: string;
  sanitizedConfig?: {
    schema: Array<{
      config: Array<{ checked: boolean; quantity?: number; pmin?: number }>;
    }>;
  }
}

export default function View() {
  const router = useRouter();
  const [signOut, loading, error] = useSignOut(auth);
  const { data: allProducts, handleGetProducts, error: errorProducts } = useGetProducts();
  const { handleDeleteProduct: DeleteProduct, error: errorDelete, isLoading: loadingDelete } = useDeleteProduct();
  const { handleGetPhoto, isLoading, error: errorPhoto } = useGetPhoto();
  const { isLoading: loadingCategory, error: errorCategory, data: dataCategory, handleGetCategory } = useGetCategory();
  const { data: dataConfigProduct, error: errorConfigProduct, isLoading: loadingConfigProduct, handleGetConfig: handleConfigProduct } = useProductConfig();

  const [photoUrls, setPhotoUrls] = useState<{ [key: string]: string }>({});
  const [configs, setConfigs] = useState<{ [key: string]: IProductConfig | null }>({});

  useEffect(() => {
  async function fetchPhotos() {
    if (!allProducts) return;

    const urls: { [key: string]: string } = {};
    const configs: { [key: string]: IProductConfig | null } = {};
    const promises = allProducts.map(async (product: any) => {
      const fileId = JSON.parse(product.imgs_id)[0];
      const productId = product.id;

      try {
        const url = await handleGetPhoto(fileId);
        urls[fileId] = url;
        const configUnique = await handleConfigProduct(productId);
        configs[productId] = configUnique;
        console.log(configs[productId]);
      } catch (error) {
        console.error("Erro ao buscar a imagem:", error);
      }
    });

    await Promise.all(promises);
    setPhotoUrls(urls);
    setConfigs(configs);
    console.log(configs);
  }

  fetchPhotos();
}, [allProducts]);


  useEffect(() => {
    handleGetProducts();
    handleGetCategory();
  }, []);

  const handleDeleteProduct = async (slug: string) => {
    const response = await DeleteProduct(slug);
    console.log(response);
    handleGetProducts();
  }

  const userLogout = async () => {
    const success = await signOut();
    if (success) {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
    router.push('/');
  }

  return (
    <div className='relative h-full p-4 flex flex-col gap-3'>
      <div className="relative bg-white flex justify-stretch rounded-lg shadow-sm text-center">
        <a href="/" className="py-3 flex-1 transition border-b-2 border-transparent hover:border-blue-500">Shop</a>
        <a href="/admin/product" className="py-3 flex-1 transition border-b-2 border-transparent hover:border-blue-500">Produtos</a>
        <a href="/admin/category" className="py-3 flex-1 transition border-b-2 border-transparent hover:border-blue-500">Categorias</a>
        <a onClick={userLogout} className="py-3 flex-1 transition border-b-2 border-transparent hover:border-blue-500">Sair</a>
      </div>
    <div className='p-4 bg-white rounded-lg shadow-sm grid grid-cols-5 gap-3'>
      {loading ? (
        <Toast />
      ) : errorProducts ? (
        <p>Error loading products: {errorProducts.message}</p>
      ) : (
        allProducts && allProducts.map((product: any) => {
          const fileId = JSON.parse(product.imgs_id)[0];
          const productId = product.id;
          const quantity = configs[productId]?.sanitizedConfig?.schema[0]?.config.find((c: any) => c.checked)?.quantity || 0;
          const pmin = configs[productId]?.sanitizedConfig?.schema[1]?.config.find((p: any) => p.checked)?.pmin || 0;
          return (
            <div key={product.slug} className="border border-neutral-200 shadow-sm p-2 rounded-lg flex flex-col gap-3">
              <div className='h-48 bg-neutral-200 rounded-md'>
                <img
                  className='object-cover w-full h-full'
                  src={photoUrls[fileId] || '/placeholder-img.jpg'}
                  alt={product.name}
                />
              </div>
              <div className='flex flex-col flex-1'>
                <p className='text-lg'>{product.name}</p>
                <p className='text-sm text-neutral-500'>
                  Categoria {product.category && dataCategory?.find(c => c.slug === product.category)?.label || ''}
                </p>
                <pre className="whitespace-break-spaces font-sans flex-col gap-2 flex-shrink-0 flex-grow line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: product.description ?? '' }}
                  />
              </div>
              <div>
                <p>{quantity && quantity > 1 ? `${quantity} unidades` : `${quantity} unidade`}</p>
                <p className='text-2xl'>{pmin && pmin > 1 && moneyBRL(pmin)}</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Tem certeza que deseja excluir este produto?")) {
                    handleDeleteProduct(product.slug);
                  }
                }}
                className='text-sm font-semibold p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition'>Excluir</button>
            </div>
          );
        })
      )}
    </div>
    </div>
  );
}