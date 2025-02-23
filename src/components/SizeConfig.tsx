'use client'

import useProduct from "@/store/useProduct";
import { moneyBRL, numberDecimal } from "@/utils/formatValues";
import { faGear, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react"
import {CheckBox} from "@/components/CheckBox";

type TItemsSize = {
  id: number;
  lar: string;
  alt: string;
  pmin: string;
  pmax: string;
};

function SizeConfig() {
  const store = useProduct();
  const [isChecked, setIsChecked] = useState(store.product.meter_2 || false);

  const existingConfig = store.product.configs?.find(c => c.type === 'size');

  const [configsId] = useState(existingConfig?.id ?? Date.now());

  const [configs, setConfigs] = useState<TItemsSize[]>(() => {
    return existingConfig ? JSON.parse(existingConfig.config) : [];
  });

  const handleAddItem = () => {
    if (configs.length < 3) {
      store.setConfig({
        id: configsId,
        config: JSON.stringify([
          store.product.configs.find(config => config.id == configsId)?.config,
          {
            id: Date.now(),
            lar: '',
            alt: '',
            pmin: '',
            pmax: ''
          }
        ]),
      });
    }
  };

  const handleUpdateItem = (id: number, field: keyof TItemsSize, value: string) => {
    setConfigs(prevConfigs =>
      prevConfigs.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setConfigs(prevConfigs => prevConfigs.filter(item => item.id !== id));
  };

  return (
    <div className="p-2 border border-neutral-200 text-left rounded-lg flex flex-col gap-4">
      {console.log(store.product)}
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Tamanho</p>
        <FontAwesomeIcon className="text-neutral-400 animate-pulse" icon={faGear} />
      </div>
      <div className="flex justify-between">
        <label>Venda por m²</label>
        <CheckBox checked={isChecked} onChange={setIsChecked} />
      </div>

      {isChecked ? (
        <>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={store.product.configs.find(config => config.id = 1)?.price_min_meter}
            className="p-2 border border-neutral-200 text-left rounded-lg"
            placeholder="Preço m² min."
            onChange={(e) => store.setConfig({ id: configsId, price_min_meter: moneyBRL(e.target.value) })}
          />
          <input
            type="text"
            value={store.product.configs.find(config => config.id = 1)?.price_max_meter}
            className="p-2 border border-neutral-200 text-left rounded-lg"
            placeholder="Preço m² máx."
            onChange={(e) => store.setConfig({ id: configsId, price_max_meter: moneyBRL(e.target.value) })}
          />
        </div>
        <SizeItemListMeter list={configs} addItem={handleAddItem} updateItem={handleUpdateItem} removeItem={handleRemoveItem} />
        </>
      ) : (
        <SizeItemList list={configs} addItem={handleAddItem} updateItem={handleUpdateItem} removeItem={handleRemoveItem} />
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
