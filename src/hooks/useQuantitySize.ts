import useProduct from "@/store/useProduct";
import { moneyToNumber, } from "@/utils/formatValues";
import { useEffect, useRef, useState } from "react";


interface IParsedConfig {
  id: string;
  alt: string | number;
  lar: string | number;
  pmin: string | number;
  pmax: string | number;
  quantity: number; // Agora quantity é obrigatoriamente um número
  checked?: boolean;
}

export type ProductConfig = {
  id: string;
  product_id: string;
  meter_2?: boolean;
  price_min_meter?: number;
  price_max_meter?: number;
  config: string;
};

export function priceUnit() {
  const store = useProduct();
  const config = store.product.config;

  if (!config) {
    return { price: 0, priceTotal: 0, quantity: 0 }; // Valores padrão
  }

  const { list, minQuantity, maxQuantity } = useQuantityOrganization(config);
  const { parsedConfigs: sizeConfig, updateParsedConfig } = useSizeOrganization(config);

  const calcularPrecoUnitario = (Q: number, P_max: number, P_min: number, Q_min: number, Q_max: number) => {
    if ([Q, P_max, P_min, Q_min, Q_max].some(isNaN)) return NaN;
    const denominador = Q_max - Q_min;
    return denominador === 0 ? P_max : P_max - ((Q - Q_min) / denominador) * (P_max - P_min);
  };

  const valueFinish = list
    .filter(item => item.checked)
    .map(item => {
      const quantity = item.quantity;
      const sizeChecked = sizeConfig.find(p => p.checked);

      if (!sizeChecked) return undefined;

      const { pmax, pmin } = sizeChecked;
      const qmin = typeof minQuantity === "object" ? minQuantity.quantity : 0;
      const qmax = typeof maxQuantity === "object" ? maxQuantity.quantity : 0;

      const price = calcularPrecoUnitario(quantity, Number(pmax), Number(pmin), qmin, qmax);
      return {
        price,
        priceTotal: price * quantity,
        quantity,
      };
    });

  const validItem = valueFinish.find(item => item !== undefined);
  return validItem || { price: 0, priceTotal: 0, quantity: 0 }; // Retorna um valor seguro
}


function useQuantityOrganization(config: ProductConfig) {
  const parsedConfig: IParsedConfig[] = config.config ? JSON.parse(config.config) : []; // Parseando o JSON

  const [list, setList] = useState<IParsedConfig[]>(() => 
    parsedConfig.sort((a, b) => a.quantity - b.quantity)
  );

  const [minQuantity, setMinQuantity] = useState<{ id: string; quantity: number } | number>(0);
  const [maxQuantity, setMaxQuantity] = useState<{ id: string; quantity: number } | number>(0);

  useEffect(() => {
    setMinQuantity(list[0] || 0);
    setMaxQuantity(list[list.length - 1] || 0);
  }, [list]);

  return { list, minQuantity, maxQuantity };
}

function useSizeOrganization(config: ProductConfig) {
  const parsedConfig: IParsedConfig[] = config.config ? JSON.parse(config.config) : []; // Parseando o JSON

  const [parsedConfigs, setParsedConfigs] = useState<IParsedConfig[]>(parsedConfig);

  const prevConfigRef = useRef<string | null>(null);

  useEffect(() => {
    if (config?.meter_2) {
      const newParsedConfigs = parsedConfigs.map(parsedConfigItem => ({
        ...parsedConfigItem,
        pmin: config.price_min_meter
          ? moneyToNumber(parsedConfigItem.alt) * moneyToNumber(parsedConfigItem.lar) * moneyToNumber(config.price_min_meter)
          : 0,
        pmax: config.price_max_meter
          ? moneyToNumber(parsedConfigItem.alt) * moneyToNumber(parsedConfigItem.lar) * moneyToNumber(config.price_max_meter)
          : 0,
      }));

      updateParsedConfig(newParsedConfigs);
    }
  }, [config]);

  function updateParsedConfig(newParsedConfigs: IParsedConfig[]) {
    setParsedConfigs(newParsedConfigs);
    const store = useProduct();

    const newConfigString = JSON.stringify(newParsedConfigs);
    if (prevConfigRef.current !== newConfigString) {
      prevConfigRef.current = newConfigString;
      store.setConfig({
        config: newConfigString, // Atualiza a propriedade `config` no Zustand
        meter_2: config.meter_2, // Preserva os campos adicionais
        price_min_meter: config.price_min_meter,
        price_max_meter: config.price_max_meter,
      });
    }
  }

  return { parsedConfigs, updateParsedConfig };
}

export { useSizeOrganization };
