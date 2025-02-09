'use client'

import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
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
  config: {id: number, type?: string},
  remove: (id:number) => void,
  update: (id: number, type: string) => void,
  configs: {id: number, type?: string}[],
}

export default function ProductConfig() {

  // Inicializa e armazena as configurações renderizadas em tela
  const [configs, setConfigs] = useState<{id: number, type?: string}[]>([]);
  
  // Valida e adiciona caso passe na validação uma nova configuração em configs
  const addConfig = () => {
    const validType = types.filter(type => {
      if (type.value === 'quantity' && configs.some(c => c.type === 'quantity')) return false;
      if (type.value === 'size' && configs.some(c => c.type === 'size')) return false;
      if (configs.length === 6) return false;
      return true;
    });

    if (validType.length === 0) return;
    setConfigs(config => [{id: Date.now(), type: validType[0].value}, ...config]);
  }

  // Atualiza um tipo de configuração previamente criado
  const updateConfig = (id: number, type: string) => {
    setConfigs(prev =>
      prev.map(config =>
        config.id === id ? {...config, type} : config
      )
    );
  }

  // Remove uma configuração pelo id da lista de configurações
  const removeConfig = (id: number) => {
    setConfigs(prev => prev.filter(config => config.id !== id));
  }  

  useEffect(() => {
    console.log(configs);
  }, [configs])

  // Renderiza o campo de configurações em tela para o usuário
  return (
    <div className="flex flex-col gap-3 mb-5">
      {configs.map(config => (
        <BaseConfig
        key={config.id}
        config={config}
        remove={removeConfig}
        update={updateConfig}
        configs={configs}
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

function BaseConfig ({ config, remove, update, configs }: IBaseConfig) {

  return (
    <div className="rounded-2xl text-neutral-800 border border-neutral-300 p-5 flex flex-col gap-1">

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
        <Listbox value={config} onChange={value => update(config.id, 'size')}>
          <div className="relative mt-2 flex-1">
            <ListboxButton className="grid w-full border border-neutral-300 cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
              <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                <span className="block truncate">{types.find(type => type.value === config.type)?.label}</span>
              </span>
            </ListboxButton>
            
            <ListboxOptions
                transition
                className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
              >
                {types.filter(t => !configs.some(c => c.type === t.value)).map(item => (
                  <ListboxOption
                    key={item.value}
                    value={item}
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
    </div>
  );
}
