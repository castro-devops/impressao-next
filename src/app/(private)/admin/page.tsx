'use client';

import { useRouter } from "next/navigation";
import { auth } from "@/services/FirebaseConfig";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Toast from "@/components/toastLoading";

export default function Admin () {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  

  const [
  signInWithEmailAndPassword,
  user,
  loading,
  error,
  ] = useSignInWithEmailAndPassword(auth);

  const handleLogin = async () => {
    setLoadingLogin(true);
      const userCredentials = await signInWithEmailAndPassword(email, password);
      if (userCredentials?.user) {

const token = await userCredentials.user.getIdToken();
  try {
    const response = await fetch("/api/v1/auth", {
        method: "POST",
        headers: {
              "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    })

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
        throw new Error(`Erro ao definir cookie: ${response.statusText}`);
    }

    // Se o fetch foi bem-sucedido, faz o redirecionamento
    router.push('/admin/category');
  } catch (error) {
        // Captura qualquer erro que ocorrer no fetch ou na resposta
        console.log('Erro no login ou na configuração do cookie:', error);
  } finally {
    setLoadingLogin(false);
  }
  }
}
  
  if (error) {
  return (
      <div>
      <p>Error: {error.message}</p>
      </div>
  );
  }
  if (user) {
      router.push('/admin/category');
  }

  return (
      <div className="h-full flex items-center justify-center">
        {loadingLogin && <Toast />}
            <div className="px-7 bg-white min-h-96 w-full flex flex-col gap-10">
                <h1 className="text-3xl">Configurações</h1>
                <div className="flex flex-col gap-4">
                      <div className="relative flex items-center bg-white border border-neutral-600 rounded-lg shadow-lg text-sm">
                          <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-neutral-600 ml-3" />
                          <input
                                className="p-3 flex-1 bg-transparent outline-none text-lg"
                                type="text"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="usuario@email.com"
                          />
                      </div>
                      <div className="relative flex items-center bg-white border border-neutral-600 rounded-lg shadow-lg text-sm">
                          <FontAwesomeIcon icon={faLock} className="w-4 h-4 text-neutral-600 ml-3" />
                          <input
                                className="p-3 flex-1 bg-transparent outline-none placeholder:text-2xl text-lg"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                          />
                      </div>
                      <button onClick={handleLogin}
                          className="p-3 bg-blue-500 text-lg font-medium text-white rounded-lg shadow-lg">
                          Entrar
                      </button>
                </div>
                <p className="text-neutral-400">Developer by Breno Castro</p>
            </div>
      </div>
  )
}