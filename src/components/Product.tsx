'use client'

import React, { useEffect, useState } from "react";
import Toast from "./toastLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye, faI, faImages, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { InputMagic } from "./InputMagic";
import { moneyBRL } from "@/utils/formatValues";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import FlashMessage from "./flashMessage";
import { SizeConfig } from "./SizeConfig";
import { QuantityConfig } from "./QuantityConfig";
import useProduct from "@/store/useProduct";
import { type Product } from "@/types/Product";
import { useGetCategory } from "@/hooks/useCreateCategory";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, MenuButton } from "@headlessui/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ViewConfigs } from "./ViewProductConfig";
import { priceUnit } from "@/hooks/useQuantitySize";

export function Product({
     data,
     create = false,
}: { data?: Product, create?: boolean }) {

  const store = useProduct();

  const itemFinished = priceUnit();

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
      store.setProduct(data.category, 'category');
      store.setProduct(data.count, 'count');
    }
  }, [create, data]);

  const renderSetPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3); // Garante apenas 3 arquivos
      const newPhotosSrcs: string[] = [];

      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      const fileList = dataTransfer.files;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotosSrcs.push(reader.result as string);

          // Verifica se já leu todos os arquivos
          if (newPhotosSrcs.length === files.length) {
            store.setProduct(newPhotosSrcs, 'photosSrcs');
          }
        };
        reader.readAsDataURL(file);
      });
      store.setProduct(fileList, 'photos'); // Salva apenas os arquivos limitados
    }
  };

  const removedPhotos = (index: number) => {
    const updateSrcs = store.product.photosSrcs.filter((_, i) => i !== index);
    const photos = store.product.photos ?? new DataTransfer().files;

    const dataTransfer = new DataTransfer();
    Array.from(photos)
      .filter((_, i) => i !== index)
      .forEach((file) => dataTransfer.items.add(file));
    const updatedFiles = dataTransfer.files;

    store.setProduct(updateSrcs, 'photosSrcs');
    store.setProduct(updatedFiles, 'photos');
  }

  const [indexPhoto, setIndexPhoto] = useState<number>(0);

  useEffect(() => {
    const index = (store.product.photosSrcs.length - 1);
    if (index < indexPhoto) {
      setIndexPhoto(index);
    } else {
      setIndexPhoto(0);
    }
  }, [store.product.photosSrcs.length]);

  const [localDescription, setLocalDescription] = useState<string>(store.product.description);

  const replacements = [
    { search: '/*', value: '<b>' },
    { search: '*/', value: '</b>' },
    { search: '~/', value: '<i>' },
    { search: '/~', value: '</i> ' },
    { search: '<a', value: '<a target="_blank"' },
    { search: '>>', value: '<i class="fa-solid fa-check text-sm"></i>' },
  ];

  const applyReplacements = (text: string, reverse = false) => {
    return replacements.reduce((acc, { search, value }) => {
      const from = reverse ? value : search;
      const to = reverse ? search : value;
      return acc.replaceAll(from, to);
    }, text);
  };

  const handleSetDescription = (e: React.ChangeEvent<HTMLTextAreaElement> | string) => {
    const description = typeof e === 'string' ? e : e.target.value;
    setLocalDescription(description);
    store.setProduct(applyReplacements(description), 'description');
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement> | string, field: keyof Product) => {
    const valor = typeof e === 'string' ? e : e.target.value;
    store.setProduct(valor, field);
  }

  const handleResetProduct = () => {
    store.rmProduct();
    setLocalDescription('');
  };

  const handleProductSubmit = async () => {
    setLoading(true);
    
    try {
      const hasEmptyField = Object.entries(store.product).some(([_, value]) => 
        value === '' || value === null || value === 0
      );
      
      const isValidConfig = (config: any) => {
        try {
          const parsedConfig = JSON.parse(config.config);
          const isValidConfigStructure = Array.isArray(parsedConfig) && parsedConfig.length > 0;
          
          if (config.meter_2) {
            return config.price_min_meter !== "" && config.price_max_meter !== "" && isValidConfigStructure;
          }
          
          return isValidConfigStructure;
        } catch {
          return false;
        }
      };

      const hasInvalidConfigs = store.product.configs.some(config => !isValidConfig(config));

      console.log(store.product);

      if (hasEmptyField) {
        setError({ message: "Ops, verifique se todos os campos estão preenchidos.", type: "error" });
        throw new Error("Ops, verifique se todos os campos estão preenchidos.");
      }

      if (hasInvalidConfigs) {
        setError({ message: "Ops, preencheu as configurações corretamente?", type: "error" });
        throw new Error("Ops, verifique se todos os campos estão preenchidos.");
      }

      console.log(store.product)

      const response = await handleCreateProduct({
        name       : store.product.name,
        description: store.product.description,
        category   : store.product.category,
        configs    : store.product.configs,
      }, store.product.photos as FileList);
      
      if (response) {
        setError({ message: "Produto criado com sucesso.", type: "success" });
        store.rmProduct();
        setLocalDescription('');
      } else {
        setError({ message: "Tivemos um erro ao criar o produto.", type: "error" });
        throw new Error("Tivemos um erro ao criar o produto.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-auto md:w-full max-w-[1350px] flex flex-col gap-5 p-2 flex-1 min-h-0">
      {/* Evento de Loading */}
      {loading && (
        <Toast />
      )}
      <FlashMessage show={error ? true : false} type={typeof error === "object" ? error.type : 'warning'} message={typeof error === "object" ? error.message : 'Opa, não obtivemos um retorno válido.'} onClick={() => setError(false)} />

      <div className="grid grid-cols-[320px_1fr] gap-5 flex-1 min-h-0">
        <div className="col-span-1 bg-white p-4 border-2 border-neutral-100 shadow-lg rounded-lg flex flex-col gap-3 overflow-y-auto scrollbar-none">
          <p className="text-2xl text-neutral-600 font-medium">Criar produto</p>
          <label className="px-4 py-7 text-left text-neutral-700 border border-neutral-200 rounded-lg flex flex-col items-center gap-1 cursor-pointer">
            <input
              className="hidden"
              type="file"
              accept="image/jpg, image/jpeg, image/webp"
              multiple
              onChange={(e) => renderSetPhotos(e)}
              id="" />
              <FontAwesomeIcon className="text-2xl" icon={faImages} />
              <span>Adicione fotos</span>
          </label>
          <p className="text-sm font-medium text-neutral-600">Adicione até 3 fotos</p>
          <input
            type="text"
            value={store.product.name}
            onChange={(e)=> handleFieldChange(e, 'name')}
            className="p-4 border border-neutral-200 text-left rounded-lg"
            placeholder="Nome do produto" />
          <Listbox value={store.product.category} onChange={value => handleFieldChange(value, 'category')}>
            <ListboxButton className={`p-4 border border-neutral-200 text-left rounded-lg`}>
              <span>{dataCategory?.find(data => data.slug === store.product.category)?.label || 'Categoria'}</span>
            </ListboxButton>
            <ListboxOptions className={`p-1 border border-neutral-200 rounded-lg shadow-md max-h-72 overflow-auto flex-none`}>
              {dataCategory?.map(category => (
                <ListboxOption key={category.slug} value={category.slug} className={`py-3 px-3.5 hover:bg-neutral-100 rounded-lg cursor-pointer`}>
                  <span>{category.label}</span>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
          <textarea
            className={`p-4 border border-neutral-200 text-left rounded-lg resize-none h-60 flex-none`}
            placeholder="Descrição"
            value={localDescription}
            onChange={(e) => handleSetDescription(e.currentTarget.value)}
            id=""></textarea>
          <SizeConfig />
          <QuantityConfig />
          <div className="flex gap-3">
            <button
              onClick={handleProductSubmit}
              className="flex-1 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg hover:shadow-sm font-semibold text-white transition">
                Criar
            </button>
            <button
              onClick={handleResetProduct}
              className="flex-1 p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg shadow-lg hover:shadow-sm font-semibold text-white transition">
                Limpar
            </button>
          </div>
          <div className="flex">
            <button
              onClick={handleResetProduct}
              className="flex-1 p-4 text-sky-600 border-2 border-sky-600 hover:border-sky-700 rounded-lg shadow-lg hover:shadow-sm font-semibold transition">
                Ver produtos
            </button>
          </div>
        </div>

        <div className="bg-white p-4 border-2 border-neutral-100 shadow-lg rounded-lg">
          <p className="py-0.5 font-semibold text-neutral-700">Prévia</p>
          <div className="grid grid-cols-[1fr_300px] gap-3">
            {/* grid de imagems */}
            <div className="relative grid gap-2">
              <div className={`h-[520px] bg-neutral-200 overflow-hidden flex items-center justify-center`}>
                {store.product.photosSrcs.length > 0 && (
                  <img
                    src={`${store.product.photosSrcs[indexPhoto]}`}
                    className="min-w-full min-h-full object-cover"
                    alt="" />
                )}
                {store.product.photosSrcs.length == 0 && (
                  <FontAwesomeIcon className="text-8xl text-neutral-500 animate-pulse" icon={faImages} />
                )}
              </div>
              <div className={`absolute bottom-0 left-0 grid grid-cols-9 gap-3 p-3 ${store.product.photosSrcs.length > 0 ? 'bg-white' : ''} bg-opacity-70`}>
                {store.product.photosSrcs.map((img, i) => (
                <div
                  onClick={() => setIndexPhoto(i)}
                  key={`${i}-img`}
                  className="relative bg-neutral-100 rounded-md h-20 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-neutral-200 hover:border-neutral-800 transition col-span-2">
                  <img
                      src={`${img}`}
                      className="min-w-full min-h-full object-cover"
                      alt="" />
                  <span
                    onClick={() => removedPhotos(i)}
                    className="absolute text-xs font-medium py-1 px-2 rounded-full bg-neutral-500 hover:bg-red-600 cursor-pointer text-white bottom-1 right-1 transition">Remover</span>
                </div>
                ))}
              </div>
            <ViewConfigs />
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <p className="text-2xl">{store.product.name || 'Nome do Produto'}</p>
                <p className="text-sm">{dataCategory?.find(data => data.slug === store.product.category)?.label || 'Categoria'}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-neutral-500">100 unidades por</p>
                <p className="text-4xl font-light">{itemFinished?.priceTotal ? moneyBRL(itemFinished.priceTotal) : moneyBRL(0)}</p>
              </div>
              <div>
                <pre className="whitespace-break-spaces font-sans flex-col gap-2"
                  dangerouslySetInnerHTML={{ __html: store.product.description ?? '' }}
                  />
                {!store.product.description && (
                <pre className="whitespace-break-spaces font-sans flex-col gap-2">Este é um espaço reservado para criar uma descrição comercial do seu produto.
                  Aqui, você pode inserir estilos usando HTML ou símbolos, confira abaixo alguns disponíveis.
                  <li>Utilize <strong>/* Texto */</strong> para usar o <strong>negrito.</strong></li>
                  <li>Utilize <strong>~/ Texto /~</strong> para usar o <em>itálico.</em></li>
                  <li>Utilize <strong>&gt;&gt;</strong> para inserir <strong><i className="fa-solid fa-check text-sm"></i></strong></li>
                </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
