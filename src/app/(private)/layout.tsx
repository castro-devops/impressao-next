import '../globals.css';

export const metadata = {
  title: 'Casa da Impressão - Categorias',
  description: 'Busque ou crie novas categorias para seus produtos.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`relative bg-neutral-50 h-dvh`}>
          <div className='relative max-w-[1224px] mx-auto mt-10 h-[100%] flex flex-col gap-5 p-1'>
            <h1 className='text-3xl text-center'>Categorias</h1>
            {children}
          </div>
      </body>
    </html>
  )
}
