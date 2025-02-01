'use client';

import Image from 'next/image';
import logo from '@/assets/svg/logo-casadaimpressao-full.svg';

export default function Header () {
     return (
          <header className="bg-primary-800 py-4 px-10 flex justify-center">
               <section className='w-full max-w-[1124px] flex justify-between'>
                    <a href="/"><Image src={logo} alt="Logo" width={200} height={50} /></a>
               </section>
          </header>
     );
}
