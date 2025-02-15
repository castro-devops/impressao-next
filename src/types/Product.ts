type ProductState = {
  editMagic   : boolean;
  product     : Product;
  setEditMagic: (value: boolean) => void;
  setProduct  : (value: string [] | string | number | FileList | null, field: keyof Product) => void;
  rmProduct   : () => void;
  rmField     : (field: keyof Product) => void;
  setConfig   : (value: Partial<ProductConfig>) => void;
  rmConfig    : (id: number) => void;
};

type Product = {
  id         : number;
  photos     : FileList | null;
  photosSrcs : string[];
  name       : string;
  description: string;
  quantity   : number;
  price      : number | string;
  category   : string;
  imgs_id?   : string;
  configs    : ProductConfig[];
}

type ProductConfig = {
  id    : number;
  label : string;
  type  : 'quantity' | 'size' | 'custom';
  config: string;
}

export type { ProductState, Product, ProductConfig };
