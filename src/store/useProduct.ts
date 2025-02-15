import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductState, Product, ProductConfig } from '@/types/Product';
import { moneyBRL } from '@/utils/formatMoney';

const initialProduct: Product = {
  id         : 0,
  photos     : null,
  photosSrcs : [],
  name       : '',
  description: '',
  quantity   : 1,
  price      : moneyBRL(0),
  category   : '',
  configs    : [],
};

const useProduct = create(
  persist<ProductState>(
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
        useProduct.persist.clearStorage();
        set({ product: initialProduct });
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
    }),
    { name: 'product' }
  )
);

export default useProduct;
