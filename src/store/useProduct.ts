import { create } from 'zustand';
import { ProductState, Product, ProductConfig, ImagesOnProduct } from '@/types/Product';

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
    product_imgs: [],
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
  setProduct: (value: string | Partial<Product>, field: keyof Product) =>
    set((state) => ({
      ...state,
      product: {
        ...state.product,
        [field]: value,
      },
    })),
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
        config: undefined, // Resetado ao limpar o produto
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
      console.log('value', value);
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
        config: undefined,
      },
    })),
  setProductActive: (id: string, active: boolean) =>
    set((state) => ({
      ...state,
      product: state.product.id === id ? { ...state.product, active } : state.product,
    })),
  addImageToProduct: (productId: string, image: ImagesOnProduct) =>
    set((state) => ({
      ...state,
      product:
        productId === state.product.id
          ? {
              ...state.product,
              product_imgs: [...state.product.product_imgs, image],
            }
          : state.product,
    })),
  removeImageFromProduct: (productId: string, imageId: string) =>
    set((state) => ({
      ...state,
      product:
        productId === state.product.id
          ? {
              ...state.product,
              product_imgs: state.product.product_imgs.filter((img) => img.image_id !== imageId),
            }
          : state.product,
    })),
}));

export default useProductStore;