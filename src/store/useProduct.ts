import { create } from 'zustand';
import { ProductState, Product, ProductConfig } from '@/types/Product';

const initialConfigs: ProductConfig[] = [{
  id: Date.now(),
  label: "Quantidade",
  type: "quantity",
  config: "[]",
}, {
  id: Date.now() + 1,
  label: "Tamanho",
  type: "size",
  meter_2: false,
  config: "[]",
}]

const useProductStore = create<ProductState>((set) => ({
  editMagic: false,
  product: {
    id: '',
    name: '',
    slug: '',
    description: '',
    category_slug: '',
    created_at: new Date(),
    active: true,
    categories: {
      id: '',
      label: '',
      slug: '',
      created_at: new Date(),
      active: true,
    },
    config: initialConfigs,
    photos: null,
    photosSrcs: undefined,
  },
  setEditMagic: (value: boolean) => set((state) => ({ ...state, editMagic: value })),
  setProduct: (value, field: keyof Product) =>{
    set((state) => ({
      product: {
        ...state.product,
        [field]: value,
      },
    }))},
  rmProduct: () =>
    set(() => ({
      product: {
        id: '',
        name: '',
        slug: '',
        description: '',
        category_slug: '',
        created_at: new Date(),
        active: true,
        product_imgs: [],
        categories: {
          id: '',
          label: '',
          slug: '',
          created_at: new Date(),
          active: true,
        },
        config: initialConfigs, // Resetado ao limpar o produto
        photos: null,
        photosSrcs: undefined,
      },
    })),
  rmField: (field: keyof Product) =>
    set((state) => ({
      ...state,
      product: {
        ...state.product,
        [field]: undefined,
      },
    })),
  setConfig: (value: Partial<ProductConfig>) =>
    set((state) => {
      const updatedConfig = state.product.config
        ? // Se houver configurações, buscamos a configuração que tenha o mesmo id (ou outro critério de identificação)
          state.product.config.map((configItem) => 
            configItem.id === value.id // Se o id do item corresponder, atualizamos esse item
              ? { ...configItem, ...value } // Mescla o item existente com o novo valor
              : configItem // Caso contrário, mantemos o item original
          )
        : [value as ProductConfig]; // Se não houver configurações, criamos um novo array com o valor fornecido

      return {
        ...state,
        product: {
          ...state.product,
          config: updatedConfig, // Atualiza a configuração com o array modificado
        },
      };
    }),
  rmSpecificConfig: (value: Partial<ProductConfig>) =>
    set((state) => ({
      ...state,
      product: {
       ...state.product,
        config: state.product.config?.filter((configItem) => configItem.id!== value.id),
      },
    })),
  rmConfig: () =>
    set((state) => ({
      ...state,
      product: {
        ...state.product,
        config: initialConfigs,
      },
    })),
}));

export default useProductStore;