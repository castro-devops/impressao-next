'use client'

import { getCategory } from "@/services/CategoryService";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
const [category, setCategory] = useState<{ label: string, slug: string }[]>([]);

useEffect(() => {
  getCategory().then(setCategory).catch(console.error);
}, []);

console.log(category);

  return (
    <div>
      <h1>Olá mundo</h1>
      <Link href="/produto/novo">Novo produto</Link>
      <Link href="/category">Nova categoria</Link>

      <div>

      </div>
    </div>
  );
}
