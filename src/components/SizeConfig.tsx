'use client'

import useProduct from "@/store/useProduct";
import { moneyBRL, numberDecimal } from "@/utils/formatValues";
import { faGear, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react"
import {CheckBox} from "@/components/CheckBox";
import { ProductConfig } from "@/types/Product";

type TItemsSize = {
  id: number;
  lar: string;
  alt: string;
  pmin: string;
  pmax: string;
};

function SizeConfig() {
  const store = useProduct();
  const [configs, setConfigs] = useState(store.product.configs.find(config => config.type === 'size'));
  const [config, setConfig] = useState<TItemsSize[]>(configs ? JSON.parse(configs.config) : []);

  const [isChecked, setIsChecked] = useState<boolean>(configs ? configs.meter_2 || false : false);

  useEffect(() => {
    const newConfigs = store.product.configs.find(config => config.type === 'size');
    setConfigs(newConfigs);
    setConfig(newConfigs ? JSON.parse(newConfigs.config) : []);
    setIsChecked(newConfigs ? newConfigs.meter_2 || false : false);
  }, [store.product.configs]);

  const handleSetChecked = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    store.setConfig({id: configs!.id, config: JSON.stringify(config), meter_2: newChecked});
  }

  const handleAddItem = () => {
    const newConfig = [
      ...config,
      {
        id: Date.now(),
        lar: '',
        alt: '',
        pmin: '',
        pmax: '',
      }
    ];
    setConfig(newConfig);
    store.setConfig({id: configs!.id, config: JSON.stringify(newConfig)});
  }
  
  useEffect(() => {
    const resetConfig: TItemsSize[] = [];
    setConfig(resetConfig);
    if (configs) {
      store.setConfig({id: configs.id, config: JSON.stringify(resetConfig), meter_2: isChecked});
    }
  }, [isChecked]);
  

  const handleUpdateItem = (id: number, field: keyof TItemsSize, value: string) => {
    const updateConfig = config.map(item => item.id === id ? { ...item, [field]: value } : item);
    setConfig(updateConfig);
    store.setConfig({id: configs!.id, config: JSON.stringify(updateConfig)});
  }

  const handleRemoveItem = (id: number) => {
    const newList = config.filter(item => item.id !== id);
    setConfig(newList);
    store.setConfig({id: configs!.id, config: JSON.stringify(newList)});
  }

  const handleUpdateConfig = (field: keyof ProductConfig, value: string) => {
    store.setConfig({id: configs!.id, [field]: value });
  }

  return (
    <div className="p-2 border border-neutral-200 text-left rounded-lg flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Tamanho</p>
        <FontAwesomeIcon onClick={handleAddItem} className="text-neutral-400 animate-pulse" icon={faGear} />
      </div>
      <div className="flex justify-between">
        <label>Venda por m²</label>
        <CheckBox checked={isChecked} onChange={handleSetChecked} />
      </div>

      {isChecked ? (
        <>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={configs?.price_min_meter ?? ''}
            className="p-2 border border-neutral-200 text-left rounded-lg"
            placeholder="Preço m² min."
            onChange={(e) => handleUpdateConfig('price_min_meter', moneyBRL(e.target.value))}
          />
          <input
            type="text"
            value={configs!.price_max_meter}
            className="p-2 border border-neutral-200 text-left rounded-lg"
            placeholder="Preço m² máx."
            onChange={(e) => handleUpdateConfig('price_max_meter', moneyBRL(e.target.value))}
          />
        </div>
        <SizeItemListMeter list={config} addItem={handleAddItem} updateItem={handleUpdateItem} removeItem={handleRemoveItem} />
        </>
        ) : (
        <SizeItemList list={config} addItem={handleAddItem} updateItem={handleUpdateItem} removeItem={handleRemoveItem} />
        )}
    </div>
  );
}

function SizeItemListMeter({ list, addItem, updateItem, removeItem }: { 
  list: TItemsSize[], 
  addItem: () => void,
  updateItem: (id: number, field: keyof TItemsSize, value: string) => void,
  removeItem: (id: number) => void 
}){
  return (
    <>
      {list.map(item => (
        <SizeItemMeter key={item.id} item={item} updateItem={updateItem} removeItem={removeItem} />
      ))}
      {list.length < 3 && (
        <div
          className="p-2 border-2 border-neutral-200 hover:border-neutral-700 text-left rounded-lg flex items-center justify-center gap-3 cursor-pointer transition"
          onClick={addItem}
        >
          Novo tamanho
          <FontAwesomeIcon icon={faPlus} />
        </div>
      )}
    </>
  )
}

interface ISizeItem {
  item: TItemsSize;
  updateItem: (id: number, field: keyof TItemsSize, value: string) => void;
  removeItem: (id: number) => void;
}

function SizeItemMeter({ item, updateItem, removeItem }: ISizeItem) {
  return (
    <div className="flex flex-col gap-2 p-1 border rounded-lg border-neutral-400">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-auto border border-neutral-200 text-left rounded-lg flex items-center overflow-hidden">
          <input
            value={item.lar}
            onChange={e => updateItem(item.id, "lar", numberDecimal(e.target.value))}
            type="text"
            className="p-2 w-full outline-none"
            placeholder="Largura" />
          <span className="bg-neutral-200 h-full p-2 text-neutral-500 font-semibold text-sm leading-none flex items-center">m</span>
        </div>
        <div className="col-auto border border-neutral-200 text-left rounded-lg flex items-center overflow-hidden">
        <input
          value={item.alt}
          onChange={e => updateItem(item.id, "alt", numberDecimal(e.target.value))}
          type="text"
          className="p-2 w-full outline-none"
          placeholder="Altura" />
          <span className="bg-neutral-200 h-full p-2 text-neutral-500 font-semibold text-sm leading-none flex items-center">m</span>
        </div>
      </div>
      <button
        onClick={() => removeItem(item.id)}
        className="text-sm text-white font-medium p-1 rounded-md bg-pink-600 hover:bg-pink-700 transition"
      >
        Remover
      </button>
    </div>
  )
}

function SizeItemList({ list, addItem, updateItem, removeItem }: { 
  list: TItemsSize[], 
  addItem: () => void,
  updateItem: (id: number, field: keyof TItemsSize, value: string) => void,
  removeItem: (id: number) => void 
}) {
  return (
    <>
      {list.map(item => (
        <SizeItem key={item.id} item={item} updateItem={updateItem} removeItem={removeItem} />
      ))}
      
      {list.length < 3 && (
        <div
          className="p-2 border-2 border-neutral-200 hover:border-neutral-700 text-left rounded-lg flex items-center justify-center gap-3 cursor-pointer transition"
          onClick={addItem}
        >
          Novo tamanho
          <FontAwesomeIcon icon={faPlus} />
        </div>
      )}
    </>
  );
}

function SizeItem({ item, updateItem, removeItem }: ISizeItem) {
  return (
    <div className="flex flex-col gap-2 p-1 border rounded-lg border-neutral-400">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-auto border border-neutral-200 text-left rounded-lg flex items-center overflow-hidden">
          <input
            value={item.lar}
            onChange={e => updateItem(item.id, "lar", numberDecimal(e.target.value))}
            type="text"
            className="p-2 w-full outline-none"
            placeholder="Largura" />
          <span className="bg-neutral-200 h-full p-2 text-neutral-500 font-semibold text-sm leading-none flex items-center">m</span>
        </div>
        <div className="col-auto border border-neutral-200 text-left rounded-lg flex items-center overflow-hidden">
          <input
            value={item.alt}
            onChange={e => updateItem(item.id, "alt", numberDecimal(e.target.value))}
            type="text"
            className="p-2 w-full outline-none"
            placeholder="Largura" />
          <span className="bg-neutral-200 h-full p-2 text-neutral-500 font-semibold text-sm leading-none flex items-center">m</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          className="p-2 border border-neutral-200 text-left rounded-lg"
          value={item.pmin}
          onChange={e => updateItem(item.id, "pmin", moneyBRL(e.target.value))}
          placeholder="Preço min." 
        />
        <input
          type="text"
          className="p-2 border border-neutral-200 text-left rounded-lg"
          value={item.pmax}
          onChange={e => updateItem(item.id, "pmax", moneyBRL(e.target.value))}
          placeholder="Preço máx." 
        />
      </div>
      <button
        onClick={() => removeItem(item.id)}
        className="text-sm text-white font-medium p-1 rounded-md bg-pink-600 hover:bg-pink-700 transition"
      >
        Remover
      </button>
    </div>
  );
}


export { SizeConfig };
