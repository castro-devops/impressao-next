import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useState } from "react";

const types = [
  {label: 'Quantidade', value: 'quantity'},
  {label: 'Tamanho', value: 'size'},
]

function ProductConfig ({
}) {
  const [selected, setSelected] = useState(types[0]);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-neutral-300 p-5 flex flex-col gap-1">
      <div className="flex justify-between">
        <p className="text-lg text-neutral-800">Campo customizado</p>
        <FontAwesomeIcon icon={faPlus} onClick={() => setExpanded(!expanded)} className={`p-1.5 cursor-pointer rounded-full ${expanded && 'rotate-45'} transition`} />
      </div>
      {expanded && <div className="flex items-center gap-2">
        <span className="leading-none flex-1">Tipo de campo</span>
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative mt-2 flex-1">
              <ListboxButton className="grid w-full border border-neutral-300 cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                  <span className="block truncate">{selected.label}</span>
                </span>
              </ListboxButton>

              <ListboxOptions
                transition
                className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
              >
                {types.map((type) => (
                  <ListboxOption
                    key={type.value}
                    value={type}
                    className="group relative py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden hover:bg-neutral-100 transiton cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{type.label}</span>
                    </div>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                    </span>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
        </Listbox>
      </div>}
    </div>
  )
}

function QuantityConfig () {
  return (
    <h1>Quantidade</h1>
  )
}

function SizeConfig () {
  return <h1></h1>
}

function CustomConfig () {

}

export default ProductConfig;
export { QuantityConfig, SizeConfig, CustomConfig };