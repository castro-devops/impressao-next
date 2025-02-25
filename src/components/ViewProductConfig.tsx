'use client'

import useProduct from "@/store/useProduct";
import { useEffect, useState } from "react";
import { CheckBox } from "./CheckBox";
import { formatToBrazilianCurrency, moneyBRL, moneyToNumber } from "@/utils/formatValues";

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
  label: string;
  type: string;
  meter_2?: boolean;
  config: ConfigItem[];
}

export function ViewConfigs() {
  const store = useProduct();
  const configs = store.product.configs;
  const [parsedConfigs, setParsedConfigs] = useState<Config[]>(
    configs.map((config) => ({
      ...config,
      config: JSON.parse(config.config),
    }))
  );

  const [checkedQuantity, setCheckedQuantity] = useState<number | null>(null);
  const [checkedSize, setCheckedSize] = useState<number | null>(null);

  useEffect(() => {
    setParsedConfigs(
      configs.map((config) => ({
        ...config,
        config: JSON.parse(config.config),
      }))
    );
  }, [configs]);

  const handleChecker = (field: "size" | "quantity", id: number) => {
    if (field === "quantity") {
      setCheckedQuantity(id);
      const updatedConfigs = store.product.configs.map((config) => {
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
    if (field === "size") {
      setCheckedSize(id);

      const updatedConfigs = store.product.configs.map((config) => {
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
  };

  useEffect(() => {
    // Garantir que pelo menos um item esteja sempre selecionado
    const initialCheckedQuantity = parsedConfigs
      .flatMap((config) => config.config)
      .find((item) => item.quantity)?.id;

    const initialCheckedSize = parsedConfigs
      .flatMap((config) => config.config)
      .find((item) => item.alt)?.id;

    if (initialCheckedQuantity && checkedQuantity === null) {
      setCheckedQuantity(initialCheckedQuantity);
      const updatedConfigs = store.product.configs.map((config) => {
        const parsedConfig = JSON.parse(config.config);
        const updateConfig = config.type === 'quantity' && parsedConfig.checked !== true
          ? parsedConfig.map((item: ConfigItem) => ({...item, checked: true}))
          : parsedConfig.map((item: ConfigItem) => ({...item, checked: false}));
          return {
            ...config,
            config: JSON.stringify(updateConfig),
          }
      });
      console.log('parsed', parsedConfigs, updatedConfigs);
      const updatedQuantityConfig = updatedConfigs.find(config => config.type === 'quantity');
      if (updatedQuantityConfig) {
        store.setConfig(updatedQuantityConfig);
      }
    }
    if (initialCheckedSize && checkedSize === null) {
      setCheckedSize(initialCheckedSize);
      const updatedConfigs = store.product.configs.map((config) => {
        const parsedConfig = JSON.parse(config.config);
        const updateConfig = config.type === 'size' && parsedConfig.checked !== true
          ? parsedConfig.map((item: ConfigItem) => ({...item, checked: true}))
          : parsedConfig.map((item: ConfigItem) => ({...item, checked: false}));
          return {
            ...config,
            config: JSON.stringify(updateConfig),
          }
      });
      const updatedSizeConfig = updatedConfigs.find(config => config.type === 'size');
      if (updatedSizeConfig) {
        store.setConfig(updatedSizeConfig);
      }
    }
  }, [parsedConfigs, checkedQuantity, checkedSize]);

  return (
    <div className="flex flex-col gap-3">
      {configs
        .slice()
        .reverse()
        .map((configGroup) => (
          <div key={configGroup.id} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">{configGroup.label}</p>
              {configGroup.type === "size" && configGroup.meter_2 && (
                <span className="py-2 px-3 border border-neutral-400 hover:border-neutral-700 rounded-full cursor-pointer transiton text-sm">
                  Personalizado
                </span>
              )}
            </div>
            <div className={`grid grid-cols-2 gap-3`}>
              {parsedConfigs
                .find((parsedConfig) => parsedConfig.id === configGroup.id)
                ?.config.map((config) => (
                  <div
                    key={config.id}
                    className="border border-neutral-300 p-2 rounded-xl flex-1"
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
        ))}
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
        <p>{moneyBRL(min)}</p>
      </div>
      <CheckBox checked={isChecked} onChange={onCheck} onlymark={true} />
    </div>
  );
}
