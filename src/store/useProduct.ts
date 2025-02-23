import { create } from 'zustand';
import { ProductState, Product, ProductConfig } from '@/types/Product';
import { moneyBRL } from '@/utils/formatValues';

const initialConfigs: ProductConfig[] = [{
  id: Date.now(),
  label: "Quantidade",
  type: "quantity",
  config: "",
}, {
  id: Date.now() + 1,
  label: "Tamanho",
  type: "size",
  config: "",
}]

const initialProduct: Product = {
  id         : Date.now(),
  photos     : null,
  photosSrcs : [],
  name       : '',
  description: '',
  category   : '',
  configs    : initialConfigs,
};

const useProduct = create<ProductState>(
    (set) => ({
      editMagic: false,
      product: initialProduct,

      setEditMagic: (value: boolean) => set({ editMagic: value }),

      setProduct: (value, field) =>
        set((state) => ({
          product: { ...state.product, [field]: value },
        })),

      rmField: (field: keyof Product) =>
        set((state) => {
          const newProduct = { ...state.product };
          delete newProduct[field];
          return { product: newProduct };
        }),

      rmProduct: () => {
        set({ product: { ...initialProduct } });
      },
      
      setConfig: (value: Partial<ProductConfig>) => {
        
        set((state) => ({
          product: {
            ...state.product,
            configs: state.product.configs.some((config) => config.id === value.id)
              ? state.product.configs.map(config => 
                config.id === value.id ? { ...config, ...value } : config
              )
              : [...state.product.configs,
                {
                  id: value.id!,
                  label: value.label || '',
                  type: value.type || 'custom',
                  config: value.config || '',
                },
              ],
          },
          }));
      },

      rmConfig: (id: number) =>
        set((state) => ({
          product: {
            ...state.product,
            configs: state.product.configs.filter((config) => config.id !== id),
          },
        })),
    })
);

export default useProduct;
