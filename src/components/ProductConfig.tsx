import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { use, useState } from "react";
import { InputMagic } from "./InputMagic";
import { moneyBRL } from "@/utils/formatMoney";

const types = [
  {label: 'Quantidade', value: 'quantity'},
  {label: 'Tamanho', value: 'size'},
  {label: 'Personalizado', value: 'custom'},
]

const units = [
  {label: 'm²', value: 'meter'},
  {label: 'cm²', value: 'centimeter'},
]

function ProductConfig ({
}) {

  const [configs, setConfigs] = useState<{ id: number }[]>([]);

  const addConfigs = () => {
    setConfigs(prevConfigs => [...prevConfigs, { id: Date.now() }]);
  }

  return (
    <div className="flex flex-col gap-3">
    {configs && configs.map(config => (
      <BaseConfig key={config.id} />
    ))}
    <div className="rounded-2xl text-neutral-800 border-2 border-dashed border-neutral-300 hover:border-neutral-500 p-5 flex flex-col gap-1 cursor-pointer transition" onClick={addConfigs}>
      <div className="flex items-center justify-between">
        <p className="text-lg">Adicionar configuração</p>
        <FontAwesomeIcon icon={faPlus}/>
      </div>
    </div>
    </div>
  )
}

function BaseConfig () {
  
  const [selected, setSelected] = useState(types[0]);
  const [expanded, setExpanded] = useState(false);
  return (
    <>
    <div className="rounded-2xl text-neutral-800 border border-neutral-300 p-5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="text-lg">Configurar campo</p>
        <FontAwesomeIcon icon={faClose}/>
      </div>
      <div className=" grid grid-cols-2 gap-2 items-center">
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
      </div>
      {selected.value === 'quantity' && <QuantityConfig />}
      {selected.value === 'size' && <SizeConfig />}
    </div>
    </>
  )
}

function QuantityConfig () {

  return (
    <>
    </>
  )
}

function SizeConfig () {
  const [selected, setSelected] = useState(units[0]);
  const [price, setPrice] = useState(moneyBRL(0));
  
  return (
    <>
    <div className="grid grid-cols-2 gap-2 items-center">
      <span className="leading-none flex-1">Unidade de medida</span>
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
                {units.map((unit) => (
                  <ListboxOption
                    key={unit.value}
                    value={unit}
                    className="group relative py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden hover:bg-neutral-100 transiton cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{unit.label}</span>
                    </div>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                    </span>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
        </Listbox>
    </div>
    <div className="relative grid grid-cols-2 gap-2 items-center mt-2">
      <p className="leading-none">Preço {selected.label}</p>
      <input type="text" value={price} onChange={e => setPrice(moneyBRL(e.target.value))} className="border border-neutral-300 cursor-pointer rounded-md bg-white py-1.5 px-3 text-left text-gray-90 sm:text-sm/6" />
    </div>
    <p className="text-sm text-neutral-600">O valor do m² será usado para calcular o preço do tamanho personalizado que o cliente selecionar.</p>
    </>
  )
}

function CustomConfig () {
  return <h1>Custom</h1>
}

export default ProductConfig;
export { QuantityConfig, SizeConfig, CustomConfig };