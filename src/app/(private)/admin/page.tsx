'use client';

import { useRouter } from "next/navigation";
import { auth } from "@/services/FirebaseConfig";
import { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Toast from "@/components/toastLoading";
import FlashMessage from "@/components/flashMessage";

export default function Admin () {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<{message?: string, type?: string, show: boolean}>({ show: false });
  
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    if (user) {
      router.push('/admin/category');
    }
  }, [user, router]);

const handleLogin = async () => {

  if (!email || !password) {
    setErrorGlobal({
      message: `Por favor, preencha ${
        !email && !password
          ? "todos os campos"
          : email
          ? "a senha"
          : "o email para entrar"
      }.`,
      type: 'error',
      show: true
    });
    return;
  }

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
      window.location.href = '/admin/category';
    } catch (error) {
      // Captura qualquer erro que ocorrer no fetch ou na resposta
      setErrorGlobal({
        type: 'error',
        message: 'Erro no login ou na configuração do cookie.',
        show: true,
      });
      console.log('Erro no login ou na configuração do cookie:', error);
    } finally {
      setLoadingLogin(false);
    }
  } else {
    setErrorGlobal({
      type: 'error',
      message: 'Ops, tivemos um erro inesperado ao fazer login, verifique suas credenciais.',
      show: true,
    });
    setLoadingLogin(false);
  }
}

  if (user) {
    router.push('/admin/category');
  }

  return (
      <div className="h-full flex items-center justify-center">
        {loadingLogin && <Toast />}
            <div className="p-7 bg-white min-h-96 w-full flex flex-col gap-10 rounded-lg shadow-lg">
              <FlashMessage message={errorGlobal ? `${errorGlobal.message}` : ''} type="error" show={errorGlobal.show} onClick={() => setErrorGlobal({ show: false })} />
                <h1 className="text-3xl">Configurações</h1>
                <div className="flex flex-col gap-4">
                      <div className="relative flex items-center bg-white border border-neutral-600 rounded-lg shadow-lg text-sm">
                          <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-neutral-600 ml-3" />
                          <input
                                className="p-3 flex-1 bg-transparent outline-none text-lg"
                                type="text"
                                value={email}
                                onInput={e => setEmail((e.target as HTMLInputElement).value)}
                                placeholder="usuario@email.com"
                          />
                      </div>
                      <div className="relative flex items-center bg-white border border-neutral-600 rounded-lg shadow-lg text-sm">
                          <FontAwesomeIcon icon={faLock} className="w-4 h-4 text-neutral-600 ml-3" />
                          <input
                                className="p-3 flex-1 bg-transparent outline-none placeholder:text-2xl text-lg"
                                type="password"
                                value={password}
                                onInput={e => setPassword((e.target as HTMLInputElement).value)}
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