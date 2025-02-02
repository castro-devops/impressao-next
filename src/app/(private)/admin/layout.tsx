import '../../globals.css';

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
        className={`relative lg:bg-neutral-50 py-10 h-dvh`}>
          <div className='relative max-w-[1224px] mx-auto h-[100%] flex flex-col gap-5 p-1'>
            {children}
          </div>
      </body>
    </html>
  )
}
