'use client';

export default function Toast () {
  return (
    <div className="fixed z-10 w-dvw h-hv inset-0 flex bg-slate-600 bg-opacity-15 items-center justify-center">
      <div className="animate-spin w-16 h-16 rounded-full border-4 border-neutral-300 border-t-blue-500">
      </div>
    </div>
  )
}