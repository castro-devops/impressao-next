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
  category   : string;
  imgs_id?   : string;
  configs    : ProductConfig[];
} & Record<string, any>;

type ProductConfig = {
  id    : number;
  label : string;
  type  : 'quantity' | 'size' | 'custom';
  config: string;
} & Record<string, any>;

export type { ProductState, Product, ProductConfig };
