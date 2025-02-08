'use client'
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useEffect } from "react";

type TInputMagic = {
     edit       ?: boolean,
     className  ?: string,
     type       ?: "text" | "select" | "money" | "number" | "quantity" | "checkbox",
     placeholder?: string,
     value      ?: 
          | string
          | number
          | { label: string; slug: string }
          | undefined;
     disabled?: boolean,
     options ?: { label: string; slug: string }[];
     onChange?: (e: any) => void;
}

export function InputMagic({
    edit = false,
    className,
    type = "text",
    placeholder = "Campo mágico",
    value = undefined,
    disabled = false,
    options = [],
    onChange,
}: TInputMagic) {

  useEffect(() => {
    console.log(value);
  }, [value])

    if (!edit) {
        if (type === "money") {
            return <p className="text-4xl leading-none">{String(value)}</p>;
        }
        if (type === "select") {
          if (typeof value === "object" && value !== null && "label" in value) {
              return <p className="text-lg mb-1 text-neutral-400">{value.label}</p>;
          }
          return <p className="text-lg mb-1 text-neutral-400">{String(value)}</p>;
        }
        if (type === "checkbox") {
            return <p>{value ? "Sim" : "Não"}</p>;
        }
        if (type === "quantity") {
          return (
               <p>
                    {Number(value) > 1 ? `${value} unidades por` : "1 unidade por"}
               </p>
          );
          }
        return <p className={className}>{String(value)}</p>;
    }

    // Modo edição - Input renderizado conforme o tipo
    return (
        <div className="relative flex items-center bg-slate-100 rounded-md flex-1 w-full">
            {type === "money" ? (
               <input type="text" className={`w-full outline-none bg-transparent ${className}`} value={String(value)} onChange={onChange} />
            ) : type === "checkbox" ? (
                <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={onChange}
                    disabled={disabled}
                />
            ) : type === "select" ? (
              <Listbox value={value} onChange={onChange}>
                <ListboxButton className={`w-full text-neutral-400 outline-none text-left bg-transparent ${className} text-2xl`}>
                  <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                    <span className="block truncate">{typeof value === "object" && value !== null && "label" in value ? value.label : 'Selecione uma categoria'}</span>
                  </span>
                </ListboxButton>
                <ListboxOptions
                  transition
                  className="absolute z-10 top-full mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                >
                  {Array.isArray(options) && options.map((type) => (
                    <ListboxOption
                      key={type.slug}
                      value={type}
                      className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                    >
                      <div className="flex items-center">
                        <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{type.label}</span>
                      </div>
    
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                      </span>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            ) : (
                <input
                    type={type}
                    onChange={onChange}
                    className={`w-full outline-none bg-transparent ${className} text-2xl`}
                    value={String(value)}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            )}
            <FontAwesomeIcon icon={faEdit} className="mr-2 text-slate-400" />
        </div>
    );
}