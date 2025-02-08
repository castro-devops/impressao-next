'use client'
import Header from "@/components/Header";
import TelegramForm from "@/components/MessageForm";
import { useState } from "react";

export default function Home() {
  return (
    <div>
      <Header />
      <a href="/admin">Administrativo</a>
    </div>
  )
}