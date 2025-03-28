export type ProductState = {
  editMagic: boolean;
  product: Product;
  setProductActive: (id: string, active: boolean) => void;
  addImageToProduct: (productId: string, image: ImagesOnProduct) => void;
  removeImageFromProduct: (productId: string, imageId: string) => void;
  setEditMagic: (value: boolean) => void;
  setProduct: (value: string | Partial<Product>, field: keyof Product) => void;
  rmProduct: () => void;
  rmField: (field: keyof Product) => void;
  setConfig: (value: Partial<ProductConfig>) => void;
  rmConfig: (id: string) => void;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category_slug: string;
  created_at: Date;
  updated_at?: Date;
  active: boolean;
  cart_item?: CartItem;
  product_imgs: ImagesOnProduct[];
  config?: ProductConfig[];
  categories: Category;
  photos: FileList | null;
  photosSrcs?: string[];
};

export type ProductConfig = {
  id: number;
  label: string;
  type: 'size' | 'quantity';
  meter_2?: boolean;
  price_min_meter?: number;
  price_max_meter?: number;
  config: string;
};

export type ImagesOnProduct = {
  product_id: string;
  image_id: string;
  image: ProductImages;
};

export type ProductImages = {
  id: string;
  telegram_id: string;
  category_slug: string;
  categories: Category;
};

export type Category = {
  id: string;
  label: string;
  slug: string;
  created_at: Date;
  updated_at?: Date;
  active: boolean;
};

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  active: boolean;
};