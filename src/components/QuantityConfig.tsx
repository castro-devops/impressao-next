'use client'

import useProduct from "@/store/useProduct";
import { faClose, faGear, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

type TQuantity = {
  id: number;
  quantity: number;
}

function QuantityConfig() {
  const store = useProduct();
  const [configs, setConfigs] = useState(store.product.configs?.find(c => c.type === 'quantity'));
  const [list, setList] = useState<TQuantity[]>(configs? JSON.parse(configs.config) : []);

  useEffect(() => {
    const newConfigs = store.product.configs.find(config => config.type === 'quantity');
    setConfigs(newConfigs);
    setList(newConfigs ? JSON.parse(newConfigs.config) : []);
  }, [store.product.configs]);

  const handleAddQuantity = () => {
    const newConfig = [
      ...list,
      {
        id: Date.now(),
        quantity: 1
      }
    ];
    setList(newConfig);
    store.setConfig({id: configs!.id, config: JSON.stringify(newConfig)});
  }

  const handleUpdateQuantity = (id: number, field: keyof TQuantity, value: string) => {
    const updatedList = list.map(item => item.id === id ? { ...item, [field]: Number(value) } : item);
    setList(updatedList);
    store.setConfig({id: configs!.id, config: JSON.stringify(updatedList)});
  }

  const removeQuantity = (id: number) => {
    const newConfig = list.filter(item => item.id !== id);
    setList(newConfig);
    store.setConfig({id: configs!.id, config: JSON.stringify(newConfig)});
  }

  return (
    <div className="p-2 border border-neutral-200 text-left rounded-lg flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Quantidade</p>
        <FontAwesomeIcon className="text-neutral-400 animate-pulse" icon={faGear} />
      </div>
      {list.map((field, i) => (
        <QuantityItem
          index={i}
          field={field}
          updateField={handleUpdateQuantity}
          removeField={removeQuantity}
          key={field.id}
        />
      ))}
      {list.length < 6 && (
        <div
          onClick={handleAddQuantity}
          className="col-auto border-2 border-neutral-200 hover:border-neutral-700 text-left rounded-lg flex items-stretch overflow-hidden cursor-pointer transition"
        >
          <span className="bg-neutral-200 h-full p-3 text-neutral-500 font-semibold text-sm leading-none flex items-center">
            {list.length + 1}º
          </span>
          <span className="flex-1 flex items-center justify-center gap-3 select-none">
            Adicionar
            <FontAwesomeIcon icon={faPlus} />
          </span>
        </div>
      )}
    </div>
  );
}


function QuantityItem({ index, field, updateField, removeField }: {
  index: number;
  field: TQuantity;
  updateField: (id: number, field: keyof TQuantity, value: string) => void;
  removeField: (id: number) => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="col-auto border border-neutral-200 text-left rounded-lg flex items-stretch overflow-hidden">
        <span className="bg-neutral-200 h-full p-3 text-neutral-500 font-semibold text-sm leading-none flex items-center">
          {index + 1}º
        </span>
        <input
          type="number"
          value={field.quantity}
          onChange={(e) => updateField(field.id, "quantity", e.target.value)}
          step={1}
          min={1}
          className="p-2 w-full outline-none"
          placeholder="100... 200... 300..."
        />
        <span
          onClick={() => removeField(field.id)}
          className="bg-neutral-200 h-full p-3 text-neutral-500 font-semibold text-sm leading-none flex items-center cursor-pointer hover:text-red-500 transition"
        >
          <FontAwesomeIcon icon={faClose} />
        </span>
      </div>
    </div>
  );
}

export { QuantityConfig };
