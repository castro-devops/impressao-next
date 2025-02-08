'use client'
import { useEffect, useState } from "react";
import Toast from "./toastLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { InputMagic } from "./InputMagic";
import { moneyBRL, moneyToNumber } from "@/utils/formatMoney";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import FlashMessage from "./flashMessage";
import { useGetCategory } from "@/hooks/useCreateCategory";
import ProductConfig from "./ProductConfig";

type TData = {
     name        : string,
     description?: string,
     quantity    : number | string,
     price       : number | string | null,
     category    : string,
}

interface IData {
  name        : string,
  description?: string,
  quantity    : number,
  price       : number,
  category    : string,
}

export function Product({
     data,
     create = false,
}: { data?: TData, create?: boolean }) {
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [photosSrcs, setPhotosSrcs] = useState<string[]>([]);
  const [editMagic, setEditMagic] = useState<boolean>(create);

  const { isLoading: loadingCategory, error: errorCategory, data: dataCategory, handleGetCategory } = useGetCategory();


  const { isLoading: loadingCreate, error: errorCreate, data: dataCreate, handleCreateProduct } = useCreateProduct();

 useEffect(() => {
    (async () => {
      try {
        await handleGetCategory();
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    })();
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string, type: "error" | "warning" | "success" | "info"} | false>(false);

  const [product, setProduct] = useState<TData>({
    name       : data?.name || '',
    description: data?.description || '',
    quantity   : data?.quantity || '',
    price      : data?.price || '',
    category   : data?.category || '',
  });

  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 5000);
  }, [error]);

  useEffect(() => {
    if (errorCategory) {
      setError({ message: errorCategory.message || 'Ops, tivemos um problema ao carregar as categorias.', type: 'error' });
    }
  }, [errorCategory]);

  useEffect(() => {
    if (errorCreate) {
      setError({ message: errorCreate.message || 'Ops, tivemos um erro ao criar o produto', type: 'error' });
    }
  }, [errorCreate]);

  useEffect(() => {
    if (product.price !== moneyBRL(product.price || 0)) {
      setProduct((prev) => ({
        ...prev,
        price: moneyBRL(prev.price || 0),
      }));
    }
  }, [product.price]);


  const renderSetPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      setPhotos(files);
      const newPhotosSrcs: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotosSrcs.push(reader.result as string);
          if (newPhotosSrcs.length === files.length) {
            setPhotosSrcs(newPhotosSrcs);
          }
        }
        reader.readAsDataURL(file);
      });
    }
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement> | string, field: keyof TData) => {
    let value = typeof e === "string" ? e : e.target.value;
    if (field == 'price') { value = moneyBRL(value); }
    setProduct({
      ...product,
      [field]: value
    });
  }

  const handleProductSubmit = async () => {
    setLoading(true);
    // Converter o preço para número
    const convertedPrice = moneyToNumber(product.price!);
    const convertedQuantity = moneyToNumber(product.quantity!);

    // Atualizar o produto com o preço convertido
    const updatedProduct: TData = {
      ...product,
      quantity: convertedQuantity,
      price: convertedPrice,
    };

    // Verificar se o produto está válido
    if (isValidProduct(updatedProduct)) {
      const validProduct: IData = {
        name       : updatedProduct.name,
        description: updatedProduct.description,
        category   : updatedProduct.category,
        price      : updatedProduct.price,
        quantity   : Number(updatedProduct.quantity),
      };

      const response = await handleCreateProduct(validProduct, photos!);
      setPhotos(null),
      setPhotosSrcs([]);
      setProduct({name: '', category: '', description: '', price: 'R$ 0,00', quantity: 1});
      setError({message: 'Produto cadastrado com sucesso!', type: 'success'});
      setLoading(false);
    } else {
      setLoading(false);
      setError({message: 'Os campos precisam ser preenchidos corretamente', type: 'error'});
    }
  };

  const isValidProduct = (product: TData): product is IData => {
    return (
      (product.name !== '' && typeof product.name === 'string') &&
      (typeof product.description === 'string' || typeof product.description === 'undefined') &&
      (product.category !== '' && typeof product.category === 'string') &&
      (product.price !== null && typeof product.price === 'number') &&
      (Number(product.quantity) > 0 && typeof Number(product.quantity) === 'number') &&
      (photos !== null)
    );
  };

  useEffect(() => {
    setLoading(loadingCreate);
  }, [loadingCreate]);


  return (
    <div className="w-auto md:w-full max-w-[1224px] flex flex-col gap-2">
      {/* Evento de Loading */}
      {loading && (
        <Toast />
      )}
      <FlashMessage show={error ? true : false} type={typeof error === "object" ? error.type : 'warning'} message={typeof error === "object" ? error.message : 'Opa, não obtivemos um retorno válido.'} onClick={() => setError(false)} />

      <div className="flex flex-col lg:flex-row lg:gap-5">
        <Carousel opts={{ align: 'start', loop: true, }} className="aspect-square rounded-3xl overflow-hidden bg-neutral-300 lg:h-[596PX]">
              <CarouselContent className="aspect-square">
              {photosSrcs.map((image, index) => (
                  <CarouselItem key={`item - ${index}`} className="">
                        <img className="w-full h-full object-cover" key={image} src={image} alt="" />
                  </CarouselItem>
              ))}
              </CarouselContent>
              {(
                  <label className="p-5 bg-blue-500 absolute bottom-2 right-2 leading-none aspect-square rounded-full text-white shadow-lg shadow-gray-500 hover:shadow-sm hover:shadow-gray-700 focus:shadow-md focus:shadow-gray-700 transition cursor-pointer">
                        <FontAwesomeIcon icon={faPlus} />
                        <input type="file" name="productPhotos[]" accept="image/png, image/jpeg" id="productPhotos" className="hidden" multiple onChange={renderSetPhotos} />
                  </label>)}
        </Carousel>
        <section className="lg:flex-1 lg:p-5">
          <InputMagic type="select"
          edit={editMagic}
          options={dataCategory!}
          placeholder="Selecione a categoria"
          value={Array.isArray(dataCategory) ? dataCategory.filter((item) => item.slug == product.category)[0] : ''}
          onChange={(e) => handleFieldChange(e.slug, 'category')}  />
          <section className="mt-10 lg:mt-0 mb-5 flex items-center gap-2.5">
              <InputMagic type="text" className="text-3xl" value={product.name} edit={editMagic} onChange={e => handleFieldChange(e, 'name')} placeholder="Nome do produto" />
          </section>
          
          <section className="mt-3 flex flex-col gap-8">
              <section>
                    <InputMagic value={product.quantity} edit={editMagic} type="quantity" onChange={e => handleFieldChange(e, 'quantity')} placeholder="Quantidade" />
                    <InputMagic value={product.price || 0} className="text-4xl leading-none" edit={editMagic} type="money" onChange={e => handleFieldChange(e, 'price')} />
              </section>
              <section>
                  <p className="text-2xl text-neutral-700">Descrição</p>
                  <InputMagic value={product.description} edit={editMagic} onChange={e => handleFieldChange(e, 'description')} placeholder="Descrição do produto" />
              </section>
          </section>
          <button
            onClick={handleProductSubmit}
            className="bg-blue-500 p-3 mt-3 rounded-lg shadow-md font-medium text-white"
            disabled={loadingCreate} // Desabilita o botão durante o carregamento
          >
              Criar novo produto
          </button>
        </section>
      </div>
      <div className="w-1/2">
        <ProductConfig />
      </div>
      <button
          onClick={() => setEditMagic(!editMagic)}
          className={`fixed bottom-4 right-4 p-4 aspect-square rounded-full text-sm font-medium text-white border-2 border-white drop-shadow-md leading-none transition cursor-pointer ${editMagic ? 'bg-orange-500' : 'bg-blue-500'}`}
      >
          {editMagic ? <FontAwesomeIcon icon={faPen} /> : <FontAwesomeIcon icon={faEye} />}
      </button>
    </div>
  )
}
