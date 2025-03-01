import useProduct from "@/store/useProduct";
import { moneyToNumber, numberDecimal } from "@/utils/formatValues";
import { useEffect, useRef, useState } from "react";


interface IParsedConfig {
  id: number;
  alt: string | number;
  lar: string | number;
  pmin: string | number;
  pmax: string | number;
  quantity?: number;
  checked?: boolean;
}

interface ProductConfig {
  id: number;
  type: string;
  config: string;
  meter_2?: boolean;
  price_min_meter?: number;
  price_max_meter?: number;
}

export function priceUnit() {

  const store = useProduct();
  const [configs, setConfigs] = useState(
    store.product.configs.map((config: ProductConfig) => ({
     ...config,
      config: JSON.parse(config.config),
    }))
  );

  const { list, minQuantity, maxQuantity } = useQuantityOrganization();
  const { parsedConfig, updateParsedConfig } = useSizeOrganization();

    function calcularPrecoUnitario(Q: number, P_max: number, P_min: number, Q_min: number, Q_max: number) {
      if (isNaN(Q) || isNaN(P_max) || isNaN(P_min) || isNaN(Q_min) || isNaN(Q_max)) {
          return NaN;
      }

      const denominador = Q_max - Q_min;
      if (denominador === 0) {
          return P_max; // Ou outro valor apropriado
      }

      return P_max - ((Q - Q_min) / denominador) * (P_max - P_min);
  }

  const valueFinish = list.map((item: IParsedConfig) => {
    if (item.checked) {
      const quantity = item.quantity ?? 0;
      const sizeChecked = parsedConfig.find((p: IParsedConfig) => p.checked);

      if (sizeChecked) {
        const pmax = Number(sizeChecked.pmax);
        const pmin = Number(sizeChecked.pmin);
        const qmin = typeof minQuantity === "object" ? minQuantity.quantity : minQuantity;
        const qmax = typeof maxQuantity === "object" ? maxQuantity.quantity : maxQuantity;

        if (isNaN(quantity) || isNaN(pmax) || isNaN(pmin) || isNaN(qmin) || isNaN(qmax)) {
          console.error("Erro: Algum dos valores está NaN!");
        }

        const price = calcularPrecoUnitario(quantity, pmax, pmin, qmin, qmax);
        const priceTotal = price * quantity;
        return {
          price,
          priceTotal,
          quantity
        }
      }
    }
    return undefined;
  });
  return valueFinish.find((item: any) => item !== undefined);
}

function useQuantityOrganization() {
  const store = useProduct();

  const [config, setConfig] = useState(() => store.product.configs.find(config => config.type === 'quantity'));
  const [list, setList] = useState(() => config?.config ? JSON.parse(config.config) : []);
  const [minQuantity, setMinQuantity] = useState<{id: number, quantity: number} | number>(0);
  const [maxQuantity, setMaxQuantity] = useState<{id: number, quantity: number} | number>(0);

  useEffect(() => {
    const updateConfig = store.product.configs.find(config => config.type === 'quantity');
    setConfig(updateConfig);
    setList(updateConfig?.config ? JSON.parse(updateConfig.config).sort((a: IParsedConfig, b: IParsedConfig) => a.quantity! - b.quantity!) : []);
  }, [store.product.configs]);

  useEffect(() => {
    setMinQuantity(list[0] || 0);
    setMaxQuantity(list[list.length - 1] || 0);
  }, [list]);

  return { list, minQuantity, maxQuantity };
}

function useSizeOrganization() {
  const store = useProduct();

  const [config, setConfig] = useState<ProductConfig | undefined>(() => store.product.configs.find(config => config.type === 'size'));
  const [parsedConfig, setParsedConfig] = useState<IParsedConfig[]>(() => config?.config ? JSON.parse(config.config) : []);

  const prevConfigRef = useRef<string | null>(null);

  useEffect(() => {
    const updateConfig = store.product.configs.find(config => config.type === 'size');
    if (updateConfig) {
      const upParsed: IParsedConfig[] = JSON.parse(updateConfig.config);

      setConfig(updateConfig);
      if (updateConfig.meter_2) {
        const newParsedConfigs: IParsedConfig[] = upParsed.map(parsedConfigItem => ({
          ...parsedConfigItem,
          pmin: moneyToNumber(parsedConfigItem.alt) * moneyToNumber(parsedConfigItem.lar) * moneyToNumber(updateConfig.price_min_meter!),
          pmax: moneyToNumber(parsedConfigItem.alt) * moneyToNumber(parsedConfigItem.lar) * moneyToNumber(updateConfig.price_max_meter!),
        }));
        updateParsedConfig(updateConfig, newParsedConfigs);
      } else {
        const newParsedConfigs = upParsed.map(parsedConfigItem => {
          const pmin = moneyToNumber(parsedConfigItem.pmin);
          const pmax = moneyToNumber(parsedConfigItem.pmax);
          return {
            ...parsedConfigItem,
            pmin,
            pmax,
          };
        });
        updateParsedConfig(updateConfig, newParsedConfigs, updateConfig.id);
      }
    }
  }, [store.product.configs]);

  function updateParsedConfig(updateConfig: ProductConfig, newParsedConfigs: IParsedConfig[], productConfigId?: number) {

    const updatedParsedConfig = newParsedConfigs.map(config => ({
      ...config,
      pmin: config.pmin, // Já atribuído corretamente em newParsedConfigs
      pmax: config.pmax, // Já atribuído corretamente em newParsedConfigs
    }));

    setParsedConfig(updatedParsedConfig);

    const newConfigString = JSON.stringify(updatedParsedConfig);
    if (prevConfigRef.current !== newConfigString) {
      prevConfigRef.current = newConfigString; // Atualiza a referência
      store.setConfig({ 
        id: productConfigId ?? updateConfig.id,
        config: newConfigString 
      });
    }
  }


  return { parsedConfig, updateParsedConfig };
}

export { useSizeOrganization };
