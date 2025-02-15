'use client'

import useProduct from "@/store/useProduct";
import { type ProductConfig } from "@/types/Product";
import { moneyBRL } from "@/utils/formatMoney";
import { faClose, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { useEffect, useState } from "react"

const types = [
  {label: 'Quantidade', value: 'quantity'},
  {label: 'Tamanho', value: 'size'},
  {label: 'Personalizado', value: 'custom'}
]

const units = [
  {label: 'm²', value: 'meter'},
  {label: 'cm²', value: 'centimeter'}
]

interface IBaseConfig {
  config : {id: number, type?: string},
  remove : (id:number) => void,
  update : (id: number, type: 'quantity' | 'size' | 'custom') => void,
  configs: {id: number, type?: string}[],
}

export default function ProductConfig() {

  // Inicializa e armazena as configurações renderizadas em tela
  const [configs, setConfigs] = useState<{id: number, type?: string}[]>([]);

  const store = useProduct();
  
  // Valida e adiciona caso passe na validação uma nova configuração em configs
  const addConfig = () => {
    const validType = types.filter((type): type is {label: string; value: 'quantity' | 'size' | 'custom' } => {
      if (type.value === 'quantity' && store.product.configs.some(c => c.type === 'quantity')) return false;
      if (type.value === 'size' && store.product.configs.some(c => c.type === 'size')) return false;
      if (store.product.configs.length === 6) return false;

      return true;
    });

    if (validType.length === 0) return;
    const newId = Date.now();
    store.setConfig({id: newId, type: validType[0].value, label: validType[0].label});
  }

  // Atualiza um tipo de configuração previamente criado
  const updateConfig = (id: number, type: 'quantity' | 'size' | 'custom') => {
    store.setConfig({id: id, type: type, label: types.find(t => t.value === type)?.label});
  }

  // Remove uma configuração pelo id da lista de configurações
  const removeConfig = (id: number) => {
    store.rmConfig(id);
  }

  // Renderiza o campo de configurações em tela para o usuário
  return (
    <div className="flex flex-col gap-3 mb-5">
      {store.product.configs.map(config => (
        <BaseConfig
        key={config.id}
        config={config}
        remove={removeConfig}
        update={updateConfig}
        />
      ))}
      <div className="rounded-2xl text-neutral-800 border-2 border-dashed border-neutral-300 hover:border-neutral-500 p-5 flex flex-col gap-1 cursor-pointer transition"
        onClick={addConfig}>
        <div className="flex items-center justify-between">
          <p className="text-lg">Adicionar configuração</p>
          <FontAwesomeIcon icon={faPlus}/>
        </div>
      </div>  
    </div>
  );
}

function BaseConfig ({ config, remove, update }: IBaseConfig) {

  const store = useProduct();

  const returnField = () => {
    if (config.type === 'quantity') return <QuantityConfig config={config} />
    if (config.type === 'size') return <SizeConfig />
  }

  return (
    <div className="rounded-2xl text-neutral-800 border border-neutral-300 p-5 flex flex-col gap-1 bg-white">

      <div className="flex items-center justify-between">
        <p className="text-lg">Configurar {types.find(type => type.value === config.type)?.label}</p>
        <FontAwesomeIcon 
        icon={faClose}
        className="cursor-pointer text-red-500 hover:text-red-700"
        onClick={() => remove(config.id)} 
      />
      </div>

      <div className="grid grid-cols-2 gap-2 items-center">
        <span className="leading-none flex-1">Tipo de campo</span>
        <Listbox value={config.type} onChange={(value: 'quantity' | 'size' | 'custom') => update(config.id, value || 'custom')}>
          <div className="relative mt-2 flex-1">
            <ListboxButton className="grid w-full border border-neutral-300 cursor-pointer grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
              <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                <span className="block truncate">{types.find(type => type.value === config.type)?.label}</span>
              </span>
            </ListboxButton>
            
            <ListboxOptions
                transition
                className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
              >
                {types.filter(t => !store.product.configs.some(c => c.type === t.value)).map(item => (
                  <ListboxOption
                    key={item.value}
                    value={item.value}
                    className="group relative py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden hover:bg-neutral-100 transiton cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                        {item.label}
                      </span>
                    </div>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white"></span>
                  </ListboxOption>
                ))
                }
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      {returnField()}

    </div>
  );
}

function QuantityConfig({ config }: {config: ProductConfig}) {

  const store = useProduct();
  const [entries, setEntries] = useState<{ id: number; quantity: string; price: string }[]>(() => {
    try {
      return JSON.parse(config.config) || [];
    } catch {
      return [];
    }
  });

  const addEntry = () => {
    if (entries.length < 6) {
      setEntries((prevEntries) => {
        const newEntries = [...prevEntries, { id: Date.now(), quantity: "", price: moneyBRL(0) }];
        store.setConfig({ id: config.id, config: JSON.stringify(newEntries) });
        return newEntries;
      });
    }
  };

  const updateEntry = (index: number, field: "quantity" | "price", value: string) => {
    setEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[index][field] = field === "price" ? moneyBRL(value) : value;
      store.setConfig({ id: config.id, config: JSON.stringify(newEntries) });
      return newEntries;
    });
  };

  const removeEntry = (id: number) => {
    setEntries((prevEntries) => {
      const newEntries = prevEntries.filter(entry => entry.id !== id);
      store.setConfig({ id: config.id, config: JSON.stringify(newEntries) });
      return newEntries;
    });
  };

  return (
    <>
    <div className="grid grid-cols-2 gap-2 items-center">
      <span>Intervalo</span>
      <input type="number" min={10} step={10} className="rounded-md bg-white py-1.5 pr-2 pl-3 border border-neutral-300" placeholder="10...20...30..." />
    </div>
    <p className="text-xs font-medium text-neutral-600">O intervalo define o saldo de quantidade que o cliente poderá personalizar caso queira uma quantidade fora do padrão. O valor final será calculado com base no padrão mais aproximado que o cliente definir.</p>

    <div className="grid grid-cols-2 gap-2 my-2">
    {entries.map((entry, index) => (
      <div key={index} className="relative grid gap-2 border-2 border-neutral-200 rounded-2xl p-2">
        <input type="text"
        placeholder="Quantidade"
        value={entry.quantity}
        onChange={(e) => updateEntry(index, "quantity", e.target.value)}
        className="rounded-md bg-white py-1.5 pr-2 pl-3 border border-neutral-300" />
        
        <input type="text"
        placeholder="R$ 0,00"
        value={entry.price}
        onChange={(e) => updateEntry(index, "price", e.target.value)}
        className="rounded-md bg-white py-1.5 pr-2 pl-3 border border-neutral-300" />
        <button className="absolute -top-2 -right-2 bg-white shadow-md flex w-fit p-2 rounded-full text-neutral-500 border border-neutral-300 hover:text-red-500 hover:border-red-500 cursor-pointer transition" onClick={() => removeEntry(entry.id)}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    ))}
    </div>

    <button
      onClick={addEntry}
      className="flex items-center gap-2 justify-center text-neutral-600">
      {entries.length < 6 ? (
        <>
        <span>Adicionar valor</span>
        <span className="w-7 flex items-center justify-center rounded-full border border-neutral-400 aspect-square"><FontAwesomeIcon icon={faPlus} /></span>
        </>
        ) : (
        <>
        </>
      )}
    </button>

    <pre className="mt-4 p-2 border border-gray-300 rounded bg-gray-100">
      {JSON.stringify(entries, null, 2)}
    </pre>
    <button className="p-2.5">Confirmar configuração</button>
    </>
  );
}





function SizeConfig() {

  const [unit, setUnit] = useState<{label: string, value: string}>({label: 'm²', value: 'meter'});
  const [price, setPrice] = useState(moneyBRL(0));
  const [defaults, setDefaults] = useState<{id: number, alt: number, lar: number, price: number}[]>([]);

  const updateDefault = (index: number, field: "alt" | "lar" | "price", value: string) => {
    if (field == 'alt') {
      const newDefaults = [...defaults];
      newDefaults[index].alt = Number(value);
      setDefaults(newDefaults);
    }
    if (field == 'lar') {
      const newDefaults = [...defaults];
      newDefaults[index].lar = Number(value);
      setDefaults(newDefaults);
    }
  }

  const addDefault = () => {
    if (defaults.length < 6) {
      setDefaults([...defaults, { id: Date.now(), alt: 0, lar: 0, price: 0 }]);
    }
  }

  const removeDefault = (id: number) => {
    setDefaults(def => def.filter(d => d.id !== id));
  }

  return (
    <>
    <div className="grid grid-cols-2 gap-2 items-center">
      <span>Preço {unit.label}</span>
      <input type="text" value={price} onChange={input => setPrice(moneyBRL(input.target.value))} className="rounded-md bg-white py-1.5 pr-2 pl-3 border border-neutral-300" placeholder="R$ 0,00" />
    </div>
    <p className="text-xs font-medium text-neutral-600">No tamanho personalizado o cliente tem o mínimo de tamanho em 1cm²</p>
    <div className="grid grid-cols-2 gap-2 my-2">
    {defaults.map((def, index) => (
      <div key={index} className="relative grid gap-2 border-2 border-neutral-200 rounded-2xl p-2">
        <input type="number"
        step={0.1}
        min={1}
        value={def.alt}
        onChange={(e) => updateDefault(index, "alt", e.target.value)}
        className="rounded-md bg-white py-1.5 pr-2 pl-3 border border-neutral-300" />
        
        <input type="number"
        step={0.1}
        min={1}
        value={def.lar}
        onChange={(e) => updateDefault(index, "lar", e.target.value)}
        className="rounded-md bg-white py-1.5 pr-2 pl-3 border border-neutral-300" />
        <button className="absolute -top-2 -right-2 bg-white shadow-md flex w-fit p-2 rounded-full text-neutral-500 border border-neutral-300 hover:text-red-500 hover:border-red-500 cursor-pointer transition" onClick={item => removeDefault(def.id)}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    ))}
    </div>
    <button
      onClick={addDefault}
      className="flex items-center gap-2 justify-center text-neutral-600">
      {defaults.length < 6 ? (
        <>
        <span>Adicionar valor</span>
        <span className="w-7 flex items-center justify-center rounded-full border border-neutral-400 aspect-square"><FontAwesomeIcon icon={faPlus} /></span>
        </>
        ) : (
        <>
        </>
      )}
    </button>
    </>
  )
}
