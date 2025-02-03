import { moneyArrayBRL, moneyBRL } from "@/utils/formatMoney";
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";
import { InputNumberFormat, unformat } from '@react-input/number-format';

type TInputMagic = {
     edit       ?: boolean,
     className  ?: string,
     type       ?: "text" | "money" | "number" | "quantity" | "checkbox",
     placeholder?: string,
     value      ?: 
          | string
          | number
          | undefined;
     disabled?: boolean,
     options ?: { label: string; value: string | number }[];
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

    if (!edit) {
        if (type === "money") {
            return <p className="text-4xl leading-none">{value}</p>;;
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
        <div className="flex items-center bg-slate-100 rounded-md flex-1 w-full">
            {type === "money" ? (
               <input type="text" className={`w-full outline-none bg-transparent  ${className}`} value={value} onChange={onChange} />
            ) : type === "checkbox" ? (
                <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={onChange}
                    disabled={disabled}
                />
            ) : (
                <input
                    type={type}
                    onChange={onChange}
                    className={`w-full outline-none bg-transparent ${className}`}
                    value={String(value)}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            )}
            <FontAwesomeIcon icon={faEdit} className="mr-2 text-slate-400" />
        </div>
    );
}