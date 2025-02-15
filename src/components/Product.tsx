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
import ProductConfig from "./ProductConfig";
import useProduct from "@/store/useProduct";
import { type Product } from "@/types/Product";
import { useGetCategory } from "@/hooks/useCreateCategory";

export function Product({
     data,
     create = false,
}: { data?: Product, create?: boolean }) {

  const store = useProduct();

  const { isLoading: loadingCategory, error: errorCategory, data: dataCategory, handleGetCategory } = useGetCategory();
  const { isLoading: loadingCreate, error: errorCreate, data: dataCreate, handleCreateProduct }     = useCreateProduct();

  useEffect(() => {
    handleGetCategory();
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<{message: string, type: "error" | "warning" | "success" | "info"} | false>(false);

  useEffect(() => {
    store.setEditMagic(create);
    if (data) {
      store.setProduct(data.name, 'name');
      store.setProduct(data.description, 'description');
      store.setProduct(data.quantity, 'quantity');
      store.setProduct(data.price, 'price');
      store.setProduct(data.category, 'category');
    }
  }, [create, data]);

  const renderSetPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      store.setProduct(files, 'photos');
      const newPhotosSrcs: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotosSrcs.push(reader.result as string);
          if (newPhotosSrcs.length === files.length) {
            store.setProduct(newPhotosSrcs, 'photosSrcs');
          }
        }
        reader.readAsDataURL(file);
      });
    }
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement> | string, field: keyof Product) => {
    let valor = typeof e === "string" ? e : e.target.value;
    if (field == 'price') { valor = moneyBRL(valor); }

    store.setProduct(valor, field);
  }

  const handleProductSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await handleCreateProduct({
        name       : store.product.name,
        description: store.product.description,
        quantity   : Number(store.product.quantity),
        price      : moneyToNumber(store.product.price),
        category   : store.product.category,
        configs    : store.product.configs,
      }, store.product.photos as FileList);
      
      if (response) {
        setError({ message: "Produto criado com sucesso.", type: "success" });
        store.rmProduct();
      } else {
        throw new Error("Erro ao criar um novo produto.");
      }
    } catch (error) {
      setError({ message: "Erro ao criar um novo produto.", type: "error" });
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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
              {store.product.photosSrcs.map((image, index) => (
                  <CarouselItem key={`item - ${index}`} className="">
                        <img className="w-full h-full object-cover" key={image} src={image} alt="" />
                  </CarouselItem>
              ))}
              </CarouselContent>
              {store.editMagic && (
                  <label className="p-5 bg-blue-500 absolute bottom-2 right-2 leading-none aspect-square rounded-full text-white shadow-lg shadow-gray-500 hover:shadow-sm hover:shadow-gray-700 focus:shadow-md focus:shadow-gray-700 transition cursor-pointer">
                        <FontAwesomeIcon icon={faPlus} />
                        <input type="file" name="productPhotos[]" accept="image/png, image/jpeg" id="productPhotos" className="hidden" multiple onChange={renderSetPhotos} />
                  </label>)}
        </Carousel>
        <section className="lg:flex-1 lg:p-5">
          <section className="mt-10 lg:mt-0 mb-5 flex flex-col items-center gap-2.5">
          <InputMagic type="select"
          edit={store.editMagic}
          options={dataCategory!}
          placeholder="Selecione a categoria"
          value={Array.isArray(dataCategory) ? dataCategory.filter((item) => item.slug == store.product.category)[0] : ''}
          onChange={(e) => store.setProduct(e.slug, 'category')}  />

              <InputMagic type="text" className="text-3xl" value={store.product.name} edit={store.editMagic} onChange={e => store.setProduct(e.target.value, 'name')} placeholder="Nome do produto" />
          </section>
          <section className="mt-3 flex flex-col gap-8">
              <section>
                    <InputMagic value={store.product.quantity} edit={store.editMagic} type="quantity" onChange={e => handleFieldChange(e, 'quantity')} placeholder="Quantidade" />
                    <InputMagic value={store.product.price || 0} className="text-4xl leading-none" edit={store.editMagic} type="money" onChange={e => handleFieldChange(e, 'price')} />
              </section>
              <section>
                  <p className="text-2xl text-neutral-700">Descrição</p>
                  <InputMagic value={store.product.description} edit={store.editMagic} onChange={e => handleFieldChange(e, 'description')} placeholder="Descrição do produto" />
              </section>
          </section>
          <button
            onClick={handleProductSubmit}
            className="bg-blue-500 w-full lg:w-auto p-3 mt-3 rounded-lg shadow-md font-medium text-white"
            disabled={loadingCreate} // Desabilita o botão durante o carregamento
          >
              Criar novo produto
          </button>
          <button
            onClick={() => store.rmProduct()}
            className="bg-yellow-500 ml-4 w-full lg:w-auto p-3 mt-3 rounded-lg shadow-md font-medium text-white"
            disabled={loadingCreate} // Desabilita o botão durante o carregamento
          >
              Limpar
          </button>
        </section>
      </div>
      <div className="w-full lg:w-1/2">
      
        <ProductConfig />

      </div>
      <button
          onClick={() => store.setEditMagic(!store.editMagic)}
          className={`fixed bottom-4 right-4 p-4 aspect-square rounded-full text-sm font-medium text-white border-2 border-white drop-shadow-md leading-none transition cursor-pointer ${store.editMagic ? 'bg-orange-500' : 'bg-blue-500'}`}
      >
          {store.editMagic ? <FontAwesomeIcon icon={faPen} /> : <FontAwesomeIcon icon={faEye} />}
      </button>
    </div>
  )
}
