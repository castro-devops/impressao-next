'use client';

import { useEffect, useState } from "react";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from "@/services/FirebaseConfig";
import { useRouter } from "next/navigation";
import { Product } from "@/components/Product";
import { useCreateProduct } from "@/hooks/useCreateProduct";

export default function Novo() {

  const router = useRouter();
  const [signOut, loading, error] = useSignOut(auth);

  const userLogout = async () => {
    const success = await signOut();
    if (success) {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
    router.push('/');
  }

  return (
    <div className="relative h-full p-4 flex flex-col gap-5">
      {/* Barra de navegação */}
      <div className="relative bg-white flex justify-stretch rounded-lg shadow-sm text-center">
        <a href="/" className="py-3 flex-1 transition border-b-2 border-transparent hover:border-blue-500">Shop</a>
        <a href="/admin/product" className="py-3 flex-1 transition border-b-2 border-transparent hover:border-blue-500">Produtos</a>
        <a href="/admin/category" className="py-3 flex-1 transition border-b-2 border-transparent hover:border-blue-500">Categorias</a>
        <a onClick={userLogout} className="py-3 flex-1 transition border-b-2 border-transparent hover:border-blue-500">Sair</a>
      </div>

      {/* Preview do produto */}
      <Product create={true} />
    </div>
  );
}
