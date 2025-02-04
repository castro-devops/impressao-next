import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { InputMagic } from "./InputMagic";
import { moneyBRL } from "@/utils/formatMoney";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { useRouter } from "next/navigation";

type IData = {
     name: string,
     description?: string,
     quantity?: number,
     price?: number | string,
     category: string,
}

export function Product({
     data,
     create = false,
}: { data?: IData, create?: boolean }) {

     const { isLoading: createLoading, error: createError, handleCreateProduct } = useCreateProduct();
     const router = useRouter();
     const [images, setImages] = useState<string[]>([]);
     const [editMagic, setEditMagic] = useState(create);
     const [product, setProduct] = useState({
          name: data?.name || '',
          description: data?.description || '',
          quantity: data?.quantity || 1,
          price: data?.price || 0,
          category: 'cadernos',
     });

     function handleChange(e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }, field: string) {
          let { value } = e.target;

          if (field === "price") {
               let formattedValue = moneyBRL(value);
               setProduct((prev) => ({ ...prev, [field]: formattedValue }));
          } else {
               setProduct((prev) => ({ ...prev, [field]: value }));
          }
     }

     // Formata o preço na primeira renderização
     useEffect(() => {
          handleChange({ target: { value: String(product.price) } }, "price")
     }, []);

     const handleProductSubmit = async () => {
          const formattedProduct = {
               ...product,
               quantity: Number(String(product.quantity).replace(/[^\d,]/g, "").replace(",", ".")) || 0,
               price: Number(String(product.price).replace(/[^\d,]/g, "").replace(",", ".")) || 0,
          };
          const success = await handleCreateProduct(formattedProduct);
          if (success) {
               setProduct({
                    name: '',
                    description: '',
                    quantity: 1,
                    price: 0,
                    category: 'cadernos',
               });
               router.push('/admin/product');
          } else {
               // Lidar com erro (opcional)
          }
     }

     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const files = event.target.files; // Obtém os arquivos selecionados

          if (files) {
               const fileArray = Array.from(files);
               const imageUrls: string[] = [];

               // Cria URLs para as imagens
               fileArray.forEach((file) => {
               const reader = new FileReader();

               reader.onloadend = () => {
                    if (reader.result) {
                    imageUrls.push(reader.result as string); // Adiciona a URL da imagem ao array
                    if (imageUrls.length === fileArray.length) {
                    setImages(imageUrls); // Atualiza o estado com todas as imagens
                    }
                    }
               };

               reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados (base64)
               });
          }
     };

     return (
          <div className="w-auto md:w-full max-w-[1224px] flex flex-col">
               <div className="flex flex-col lg:flex-row lg:gap-5">
                    <Carousel opts={{ align: 'start', loop: true, }} className="aspect-square rounded-3xl overflow-hidden bg-neutral-300 lg:h-[596PX]">
                         <CarouselContent className="aspect-square">
                         {images.map((image, index) => (
                              <CarouselItem key={`item - ${index}`} className="">
                                   <img className="w-full h-full object-cover" key={image} src={image} alt="" />
                              </CarouselItem>
                         ))}
                         </CarouselContent>
                         {editMagic && (
                              <label className="p-5 bg-blue-500 absolute bottom-2 right-2 leading-none aspect-square rounded-full text-white shadow-lg shadow-gray-500 hover:shadow-sm hover:shadow-gray-700 focus:shadow-md focus:shadow-gray-700 transition cursor-pointer">
                                   <FontAwesomeIcon icon={faPlus} />
                                   <input type="file" name="productPhotos[]" id="productPhotos" className="hidden" multiple onChange={handleFileChange} />
                              </label>)}
                    </Carousel>
                    <section className="lg:flex-1 lg:p-5">
                         <p className="text-lg mb-1 text-neutral-400">Agendas</p>
                         <section className="mt-10 lg:mt-0 mb-5 flex items-center gap-2.5">
                              <InputMagic type="text" className="text-3xl" value={product.name} edit={editMagic} onChange={e => handleChange(e, 'name')} placeholder="Nome do produto" />
                         </section>
                         <section className="mt-3 flex flex-col gap-8">
                              <section>
                                   <InputMagic value={product.quantity} edit={editMagic} type="quantity" onChange={e => handleChange(e, 'quantity')} placeholder="Quantidade" />
                                   <InputMagic value={product.price} className="text-4xl leading-none" edit={editMagic} type="money" onChange={e => handleChange(e, 'price')} />
                              </section>
                              <section>
                                   <p className="text-2xl text-neutral-700">Descrição</p>
                                   <InputMagic value={product.description} edit={editMagic} onChange={e => handleChange(e, 'description')} placeholder="Descrição do produto" />
                              </section>
                         </section>
                    </section>
               </div>

               {/* Exibe o Loading */}
               {createLoading && (
                    <div className="flex justify-center items-center mt-5">
                         <div className="animate-spin rounded-full border-t-4 border-blue-500 w-10 h-10"></div>
                         <span className="ml-2">Criando o produto...</span>
                    </div>
               )}

               {/* Exibe o erro */}
               {createError && (
                    <div className="mt-5 p-4 bg-red-200 text-red-700 rounded-lg">
                         <strong>Erro:</strong> {createError?.message || 'Ocorreu um erro ao criar o produto.'}
                    </div>
               )}

               {/* Botões */}
               <button
                    onClick={handleProductSubmit}
                    className="bg-blue-500 p-3 mt-3 rounded-lg shadow-md font-medium text-white"
                    disabled={createLoading} // Desabilita o botão durante o carregamento
               >
                    Criar novo produto
               </button>

               <button
                    onClick={() => setEditMagic(!editMagic)}
                    className={`fixed bottom-4 right-4 p-4 aspect-square rounded-full text-sm font-medium text-white border-2 border-white drop-shadow-md leading-none transition cursor-pointer ${editMagic ? 'bg-orange-500' : 'bg-blue-500'}`}
               >
                    {editMagic ? <FontAwesomeIcon icon={faPen} /> : <FontAwesomeIcon icon={faEye} />}
               </button>
          </div>
     )
}
