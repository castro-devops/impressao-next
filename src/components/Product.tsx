'use client'

import React, { useEffect, useState } from "react";
import Toast from "./toastLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { moneyBRL } from "@/utils/formatValues";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import FlashMessage from "./flashMessage";
import { SizeConfig } from "./SizeConfig";
import { QuantityConfig } from "./QuantityConfig";
import useProduct from "@/store/useProduct";
import { type Product } from "@/types/Product";
import { useGetCategory } from "@/hooks/useCreateCategory";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ViewConfigs } from "./ViewProductConfig";
import { priceUnit } from "@/hooks/useQuantitySize";
import { useRouter } from "next/navigation";

export function Product({ data, create = false }: { data?: Product; create?: boolean }) {

  const store = useProduct();
  const router = useRouter();

  // Calcula o preço com base na configuração atual
  const itemFinished = priceUnit();

  // Hooks para criar e buscar categorias
  const { isLoading: loadingCategory, data: dataCategory, error: errorCategory, handleGetCategory } = useGetCategory();
  const { isLoading: loadingCreate, error: errorCreate, handleCreateProduct } = useCreateProduct();

  // Estados locais para gerenciar erros e carregamento
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type: "error" | "warning" | "success" | "info" } | false>(false);

  const validFields: Record<string, string> = {
    photos: "border-red-500",
    name: "border-red-500",
    category: "border-red-500",
    description: "border-red-500",
  };

  // Busca categorias ao carregar o componente
  useEffect(() => {
    const fetchData = async () => {
      const categories = await handleGetCategory();
      if ("error" in categories) {
        router.push("/admin/category");
      }
    };
    fetchData();
  }, []);

  const [indexPhoto, setIndexPhoto] = useState<number>(0);

  useEffect(() => {
    if (store.product.photosSrcs) {
      const index = store.product.photosSrcs.length - 1;
      if (index < indexPhoto) {
        setIndexPhoto(index);
      } else {
        setIndexPhoto(0);
      }
    }
  }, [store.product.photosSrcs?.length]);


  const [localDescription, setLocalDescription] = useState<string>(store.product.description || '');

  const replacements = [
    { search: '/', value: '<b>' },
    { search: '/', value: '</b>' },
    { search: '', value: '</i> ' },
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

    setFieldErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[field]; // Remove o campo específico
      return updatedErrors; // Retorna o novo objeto sem o erro do campo
    });
  };

  const removedPhotos = (index: number) => {
    // Verifica se photosSrcs não é undefined
    const updateSrcs = store.product.photosSrcs ? store.product.photosSrcs.filter((_, i) => i !== index) : [];
    
    // Usa um valor padrão para photos caso seja undefined
    const photos = store.product.photos ?? new DataTransfer().files;
    
    const dataTransfer = new DataTransfer();
    
    // Filtra as fotos e adiciona no DataTransfer
    Array.from(photos)
      .filter((_, i) => i !== index)
      .forEach((file) => dataTransfer.items.add(file));
    
    const updatedFiles = dataTransfer.files;

    // Passando um objeto parcial para manter a compatibilidade de tipos
    store.setProduct({ photosSrcs: updateSrcs }, 'photosSrcs');  // Passa como um objeto parcial
    store.setProduct({ photos: updatedFiles }, 'photos');  // Passa como um objeto parcial
  };


  const handleResetProduct = () => { store.rmProduct(); setLocalDescription(''); };

  // Sincroniza o estado inicial do produto no Zustand
  useEffect(() => {
    store.setEditMagic(create);
    if (data) {
      store.setProduct(data.name, "name");
      store.setProduct(data.description || '', "description");
      store.setProduct(data.category_slug, "category_slug");
      store.setConfig(data.config ?? {}); // Configuração inicial (vazia ou existente)
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
            store.setProduct({ photosSrcs: newPhotosSrcs }, 'photosSrcs');  // Passa como objeto parcial
          }
        };
        reader.readAsDataURL(file);
      });

      store.setProduct({ photos: fileList }, 'photos');  // Passa como objeto parcial
    }
  };


  // Função para lidar com a submissão do formulário
  const handleProductSubmit = async () => {
    setLoading(true);

    try {
      // Validação de campos obrigatórios
      const fieldErrorsTemp: Record<string, string> = {};
      Object.keys(validFields).forEach((field) => {
        if (!store.product[field as keyof Product]) {
          fieldErrorsTemp[field] = validFields[field];
        }
      });
      setFieldErrors(fieldErrorsTemp);

      const hasEmptyField = Object.keys(fieldErrorsTemp).length > 0;
      if (hasEmptyField) {
        setError({ message: "Ops, verifique se todos os campos estão preenchidos.", type: "error" });
        return;
      }

      // Validação do config
      const config = store.product.config;
      const isValidConfig = (config: any) => {
        if (!config) return false;
        try {
          const parsedConfig = JSON.parse(config.config);
          const isValidConfigStructure = Array.isArray(parsedConfig) && parsedConfig.length > 0;

          if (config.meter_2) {
            return config.price_min_meter !== undefined && config.price_max_meter !== undefined && isValidConfigStructure;
          }

          return isValidConfigStructure;
        } catch {
          return false;
        }
      };

      if (!isValidConfig(config)) {
        setError({ message: "Ops, preencheu as configurações corretamente?", type: "error" });
        return;
      }

      // Submete o produto para criação
      const response = await handleCreateProduct(
        {
          name: store.product.name,
          description: store.product.description,
          category_slug: store.product.category_slug,
          config: JSON.stringify(store.product.config), // Convertendo o config para string
        },
        store.product.photos as FileList
      );

      if (response) {
        setError({ message: "Produto criado com sucesso.", type: "success" });
        store.rmProduct();
      } else {
        setError({ message: "Tivemos um erro ao criar o produto.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setError({ message: "Erro ao processar a criação do produto.", type: "error" });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-auto md:w-full max-w-[1350px] flex flex-col gap-5 lg:flex-1 lg:min-h-0">
      {/* Evento de Loading */}
      {loading && (
        <Toast />
      )}
      <FlashMessage show={error ? true : false} type={typeof error === "object" ? error.type : 'warning'} message={typeof error === "object" ? error.message : 'Opa, não obtivemos um retorno válido.'} onClick={() => setError(false)} />

      <div className="grid lg:grid-cols-[320px_1fr] gap-5 flex-1 min-h-0">
        <div className="p-1 flex lg:hidden rounded-lg bg-white shadow-md border-2 border-neutral-200">
          <button className="toggle-btn flex-1 p-3" id="btn-create">Criar</button>
          <button className="toggle-btn flex-1 p-3" id="btn-preview">Visualizar</button>
        </div>

        <div className="col-span-1 bg-white p-4 border-2 border-neutral-100 shadow-lg rounded-lg flex flex-col gap-3 overflow-y-auto scrollbar-none">
          <p className="text-2xl text-neutral-600 font-medium">Criar produto</p>
          <label className={`px-4 py-7 text-left text-neutral-700 border ${fieldErrors.photos || 'border-neutral-200'} rounded-lg flex flex-col items-center gap-1 cursor-pointer`}>
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
            className={`p-4 border ${fieldErrors.name || 'border-neutral-200'} text-left rounded-lg`}
            placeholder="Nome do produto" />
          <Listbox value={store.product.category_slug} onChange={value => handleFieldChange(value, 'category_slug')}>
            <ListboxButton className={`p-4 border ${fieldErrors.category || 'border-neutral-200'} text-left rounded-lg`}>
              <span>{dataCategory?.find(data => data.slug === store.product.category_slug)?.label || 'Categoria'}</span>
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
            className={`p-4 border ${fieldErrors.description || 'border-neutral-200'} text-left rounded-lg resize-none h-60 flex-none`}
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
            <a
              href="/admin/product/view"
              className="flex-1 p-4 text-center text-sky-600 border-2 border-sky-600 hover:border-sky-700 rounded-lg shadow-lg hover:shadow-sm font-semibold transition">
                Ver produtos
            </a>
          </div>
        </div>

        <div className="bg-white p-4 border-2 border-neutral-100 shadow-lg rounded-lg">
          <p className="py-0.5 font-semibold text-neutral-700">Prévia</p>
          <div className="grid xl:grid-cols-[1fr_300px] gap-3">
            {/* grid de imagems */}
            <div className="flex flex-col gap-5">
            <div className="relative grid gap-2">
              <div className={`h-[240px] lg:h-[520px] bg-neutral-200 overflow-hidden flex items-center justify-center`}>
                {store.product.photosSrcs && store.product.photosSrcs.length > 0 && (
                  <img
                    src={`${store.product.photosSrcs[indexPhoto]}`}
                    className="min-w-full min-h-full object-cover"
                    alt="" />
                )}
                {store.product.photosSrcs && store.product.photosSrcs.length == 0 && (
                  <FontAwesomeIcon className="text-8xl text-neutral-500 animate-pulse" icon={faImages} />
                )}
              </div>
              <div className={`absolute bottom-0 left-0 grid grid-cols-3 lg:grid-cols-9 gap-3 p-3 ${store.product.photosSrcs && store.product.photosSrcs.length > 0 ? 'bg-white' : ''} bg-opacity-70`}>
                {store.product.photosSrcs && store.product.photosSrcs.map((img, i) => (
                <div
                  onClick={() => setIndexPhoto(i)}
                  key={`${i}-img`}
                  className="relative bg-neutral-100 rounded-md h-20 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-neutral-200 hover:border-neutral-800 transition col-span-1 lg:col-span-2">
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
            </div>
            <ViewConfigs />
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <p className="text-2xl">{store.product.name || 'Nome do Produto'}</p>
                <p className="text-sm">{dataCategory?.find(data => data.slug === store.product.category_slug)?.label || 'Categoria'}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-neutral-500">{itemFinished?.quantity 
                    ? itemFinished.quantity == 1 
                      ? '1 unidade por' 
                      : `${itemFinished.quantity} unidades por` 
                    : 'Sem unidade definida' 
                  }</p>
                <p className="text-4xl font-light">{itemFinished && 'priceTotal' in itemFinished 
                  ? moneyBRL(itemFinished.priceTotal) 
                  : moneyBRL(0)}</p>
              </div>
              <div>
                <pre className="whitespace-break-spaces font-sans flex-col gap-2"
                  dangerouslySetInnerHTML={{ __html: store.product.description ?? '' }}
                  />
                <pre className="mt-4 whitespace-break-spaces font-sans flex-col gap-2">
                  <li>Utilize <strong>/* Texto */</strong> para usar o <strong>negrito.</strong></li>
                  <li>Utilize <strong>~/ Texto /~</strong> para usar o <em>itálico.</em></li>
                  <li>Utilize <strong>&gt;&gt;</strong> para inserir <strong><i className="fa-solid fa-check text-sm"></i></strong></li>
                  <li>Você pode usar tags <b>HTML</b></li>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
