'use client'

import useProduct from "@/store/useProduct";
import { useEffect, useState } from "react";
import { CheckBox } from "./CheckBox";
import { formatToBrazilianCurrency, moneyToNumber } from "@/utils/formatValues";
import { ProductConfig } from "@/types/Product";

interface ConfigItem {
  id: number;
  quantity?: number;
  alt?: number;
  lar?: number;
  pmin?: number;
  pmax?: number;
}

interface Config {
  id: number;
  type: 'size' | 'quantity';
  label: string;
  meter_2?: boolean;       
  price_min_meter?: number;
  price_max_meter?: number;
  config: ConfigItem[];
}

export function ViewConfigs() {
  const store = useProduct();

  const configs: ProductConfig[] = Array.isArray(store.product.config)
  ? store.product.config.map((config) => ({
      ...config, // Mantém todas as propriedades do ProductConfig
      config: config.config ? JSON.parse(config.config) : [], // Parse do config se existir
    }))
  : []; // Caso store.product.config não seja um array, iniciamos com um array vazio

  const [parsedConfigs, setParsedConfigs] = useState<Config[]>([]);

  const [checkedQuantity, setCheckedQuantity] = useState<number | null>(null);
  const [checkedSize, setCheckedSize] = useState<number | null>(null);

  useEffect(() => {
    if (configs && Array.isArray(configs)) { // Confirma que configs é um array
      const newParsedConfigs = configs.map((config) => ({
        ...config,
        config: Array.isArray(config.config) ? config.config : [], // Ajuste aqui: garantir que config seja um array
      }));

      // Verificar se parsedConfigs já é igual ao novo valor
      if (JSON.stringify(parsedConfigs) !== JSON.stringify(newParsedConfigs)) {
        console.log("Before processing:", parsedConfigs);
        setParsedConfigs(newParsedConfigs);
      }
    }
    console.log(configs);
  }, [configs, parsedConfigs]);


  if (parsedConfigs.length === 0) {
    return <div>Loading...</div>; // Ou qualquer outro comportamento para quando não houver configs
  }

  const handleChecker = (field: "size" | "quantity", id: number) => {
    if (field === "quantity") {
      setCheckedQuantity(id);

      // Verificar se store.product.config é um array
      if (Array.isArray(store.product.config)) {
        const updatedConfigs = store.product.config.map((config: ProductConfig) => {
          const parsedConfig: ConfigItem[] = JSON.parse(config.config);

          const updatedConfig = parsedConfig.map((item) => ({
            ...item,
            checked: item.id === id,
          }));

          return {
            ...config,
            config: JSON.stringify(updatedConfig),
          };
        });

        const updatedQuantityConfig = updatedConfigs.find(
          (config) => config.type === "quantity"
        );

        if (updatedQuantityConfig) {
          store.setConfig(updatedQuantityConfig);
        }
      }
    }

    if (field === "size") {
      setCheckedSize(id);

      // Verificar se store.product.configs é um array
      if (Array.isArray(store.product.config)) {
        const updatedConfigs = store.product.config.map((config: ProductConfig) => {
          const parsedConfig: ConfigItem[] = JSON.parse(config.config);

          const updatedConfig = parsedConfig.map((item) => ({
            ...item,
            checked: item.id === id,
          }));

          return {
            ...config,
            config: JSON.stringify(updatedConfig),
          };
        });

        const updatedSizeConfig = updatedConfigs.find(
          (config) => config.type === "size"
        );

        if (updatedSizeConfig) {
          store.setConfig(updatedSizeConfig);
        }
      }
    }
  };

  // useEffect(() => {
  //   // Garantir que pelo menos um item esteja sempre selecionado
  //   const initialCheckedQuantity = parsedConfigs
  //     .flatMap((config) => config.config)
  //     .find((item) => item.quantity)?.id;

  //   const initialCheckedSize = parsedConfigs
  //     .flatMap((config) => config.config)
  //     .find((item) => item.alt)?.id;

  //   if (initialCheckedQuantity && checkedQuantity === null) {
  //     setCheckedQuantity(initialCheckedQuantity);

  //     // Garantir que o primeiro item da configuração "quantity" seja selecionado
  //     const updatedConfigs = Array.isArray(store.product.config)
  //       ? store.product.config.map((config: ProductConfig) => {
  //           const parsedConfig: ConfigItem[] = JSON.parse(config.config);
            
  //           // Sempre selecionar o primeiro item
  //           const updatedConfig = parsedConfig.map((item: ConfigItem, index) => ({
  //             ...item,
  //             checked: index === 0,  // Marcar o primeiro item como "checked"
  //           }));

  //           return {
  //             ...config,
  //             config: JSON.stringify(updatedConfig),
  //           };
  //         })
  //       : []; // Caso store.product.config não seja um array, inicializar com um array vazio.

  //     const updatedQuantityConfig = updatedConfigs.find(
  //       (config) => config.type === 'quantity'
  //     );

  //     if (updatedQuantityConfig) {
  //       store.setConfig(updatedQuantityConfig);
  //     }
  //   }

  //   if (initialCheckedSize && checkedSize === null) {
  //     setCheckedSize(initialCheckedSize);

  //     // Garantir que o primeiro item da configuração "size" seja selecionado
  //     const updatedConfigs = Array.isArray(store.product.config)
  //       ? store.product.config.map((config: ProductConfig) => {
  //           const parsedConfig: ConfigItem[] = JSON.parse(config.config);

  //           // Sempre selecionar o primeiro item
  //           const updatedConfig = parsedConfig.map((item: ConfigItem, index) => ({
  //             ...item,
  //             checked: index === 0,  // Marcar o primeiro item como "checked"
  //           }));

  //           return {
  //             ...config,
  //             config: JSON.stringify(updatedConfig),
  //           };
  //         })
  //       : []; // Caso store.product.config não seja um array, inicializar com um array vazio.

  //     const updatedSizeConfig = updatedConfigs.find(
  //       (config) => config.type === 'size'
  //     );

  //     if (updatedSizeConfig) {
  //       store.setConfig(updatedSizeConfig);
  //     }
  //   }
  // }, [parsedConfigs, checkedQuantity, checkedSize]);


  return (
    <div className="flex flex-col gap-3">
      {configs && configs.length > 0 ? (
        configs
          .slice()
          .reverse()
          .map((configGroup) => (
            <div key={configGroup.id} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">{configGroup?.label ?? 'Teste'}</p>
                {configGroup.type === "size" && configGroup.meter_2 && (
                  <span className="py-2 px-3 border border-neutral-400 hover:border-neutral-700 rounded-full cursor-pointer transiton text-sm">
                    Personalizado
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {parsedConfigs
                  .find((parsedConfig) => parsedConfig.id === configGroup.id)
                  ?.config.map((config) => (
                    <div
                      key={config.id}
                      className="border border-neutral-300 p-4 rounded-xl flex-1"
                    >
                      {config.quantity ? (
                        <SessionQuantity
                          id={config.id}
                          quantity={config.quantity}
                          isChecked={checkedQuantity === config.id}
                          onCheck={() => handleChecker("quantity", config.id)}
                        />
                      ) : (
                        <SessionSize
                          id={config.id}
                          alt={config.alt || 0.001}
                          lar={config.lar || 0.001}
                          min={config.pmin || 0.001}
                          max={config.pmax || 0.001}
                          isChecked={checkedSize === config.id}
                          onCheck={() => handleChecker("size", config.id)}
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))
      ) : (
        <p>No configurations available</p> // Exibir uma mensagem se configs estiver vazio ou indefinido
      )}
    </div>
  );

}

function SessionQuantity({
  id,
  quantity,
  isChecked,
  onCheck,
}: {
  id: number;
  quantity: number;
  isChecked: boolean;
  onCheck: (checked: boolean) => void;
}) {
  return (
    <div className="flex justify-between">
      <div className="flex-1">
        <p>{quantity > 1 ? `${quantity} unidades` : "1 unidade"}</p>
      </div>
      <CheckBox checked={isChecked} onChange={onCheck} onlymark={true} />
    </div>
  );
}

function SessionSize({
  id,
  alt,
  lar,
  min,
  max,
  isChecked,
  onCheck,
}: {
  id: number;
  alt: number;
  lar: number;
  min: number;
  max: number;
  isChecked: boolean;
  onCheck: (checked: boolean) => void;
}) {
  const toCentimeter = (value: string | number) => {
    const valueNumeric = moneyToNumber(value) * 100;
    const centimeter = formatToBrazilianCurrency(valueNumeric, 1);
    return centimeter;
  };

  const toMeter = (value: number | string) => {
    const valueNumeric = moneyToNumber(value) * 1;
    const meter = formatToBrazilianCurrency(valueNumeric);
    return meter;
  };

  return (
    <div className="flex justify-between">
      <div className="flex-1">
        <p>
          {moneyToNumber(lar) < 1
            ? `${toCentimeter(lar)} cm`
            : `${toMeter(lar)} m`}{" "}
          x{" "}
          {moneyToNumber(alt) < 1
            ? `${toCentimeter(alt)} cm`
            : `${toMeter(alt)} m`}
        </p>
      </div>
      <CheckBox checked={isChecked} onChange={onCheck} onlymark={true} />
    </div>
  );
}
