'use client'

import Header from "@/components/Header";
import { getCategory } from "@/services/CategoryService";
import Link from "next/link";
import { useEffect, useState } from "react";
import '../globals.css';

export default function Home() {
const [category, setCategory] = useState<{ label: string, slug: string }[]>([]);

useEffect(() => {
  getCategory().then(setCategory).catch(console.error);
}, []);

console.log(category);

  return (
    <div>
      <Header />
      <Link href="/produto/novo">Novo produto</Link>
      <Link href="/admin">Adminitrativo</Link>

      <div>

      </div>
    </div>
  );
}
