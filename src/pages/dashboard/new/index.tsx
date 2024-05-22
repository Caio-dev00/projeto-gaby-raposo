import { AuthContext } from '../../../contexts/AuthContext';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidV4 } from 'uuid';
import { FaListAlt } from "react-icons/fa";

import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../services/firebaseConnection';

import { HeaderDashboard } from "../../../components/headerDashboard";
import Input from "../../../components/input";
import Title from "../../../components/titleDahsboard";

import { FiTrash, FiTrash2, FiUpload } from 'react-icons/fi';
import { tamanhoProps } from '../variacoes';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export interface productProps {
  id: string;
  name: string;
  owner: string;
  price: string;
  size: string;
  status: string;
  categoria: string;
  description: string;
  image: ImageItemProps[];
  variations: Variations[];
}

export type Variations = {
  size: string;
  colors: Color[];
}

export interface Color {
  uid: string;
  url: string;
  previewUrl: string;
  imageUrl: string;
  name: string;
  estoque: number;
}

export interface categoryProps {
  name: string | number;
  id: string;
}

export interface colorProps {
  name: string;
  id: string;
  images: ImageItemProps[]

}

export interface sizeProps {
  name: string;
  id: string;
}

export interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

const schema = z.object({
  name: z.string().min(1, "O campo é obrigatorio!"),
  price: z.string().min(1, "O campo é obrigatorio!"),
  description: z.string().min(1, "O campo é obrigatorio!"),
})

type FormData = z.infer<typeof schema>

const listRef = collection(db, "categorias")
const listCoresRef = collection(db, "Cores")
const listTamanhoRef = collection(db, "Tamanhos")

export function New() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const { user } = useContext(AuthContext)
  const [category, setCategory] = useState<categoryProps[]>([])
  const [color, setColor] = useState<colorProps[]>([])
  const [size, setSize] = useState<sizeProps[]>([])
  const [productImage, setProductImage] = useState<ImageItemProps[]>([])

  const [loadCategory, setLoadCategory] = useState(true)
  const [loadColor, setLoadColor] = useState(true)
  const [loadSize, setLoadSize] = useState(true)

  const [categoria, setCategoria] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [colorSelected, setColorSelected] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [defaultSize, setDefaultSize] = useState<string>("Selecione o Tamanho");
  const [defaultColor, setDefaultColor] = useState<string | "Selecione a cor">("Selecione a cor");
  const [status, setStatus] = useState("Ativo")

  const location = useLocation();
  const navigate = useNavigate();
  const productId = new URLSearchParams(location.search).get("id")

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [variations, setVariations] = useState<Variations[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<Variations>({
    size: "",
    colors: [],
  });
  const [editVariations, setEditVariations] = useState<Variations[]>([])
  const [estoque, setEstoque] = useState<number>(0)
  const [productImagesFromDB, setProductImagesFromDB] = useState<ImageItemProps[]>([]);
  const [existingImages, setExistingImages] = useState<ImageItemProps[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<ImageItemProps[]>([]);
  const [categories, setCategories] = useState<categoryProps[]>([]);


  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;

      try {
        const productDoc = await getDoc(doc(db, "Produtos", productId));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          if (productData) {
            const productCompleto: productProps = {
              id: productDoc.id,
              name: productData.name,
              owner: productData.owner,
              categoria: productData.categoria,
              status: productData.status,
              price: productData.price,
              size: productData.size,
              description: productData.description,
              image: productData.images,
              variations: productData.variations
            };

            setName(productCompleto.name);
            setPrice(productCompleto.price);
            setDescription(productCompleto.description);
            setStatus(productCompleto.status);
            setEditVariations(productCompleto.variations);

            // Atualize o estado com o nome da categoria
            setSelectedCategory(productCompleto.categoria);
          }
        } else {
          console.log("Produto não encontrado");
          toast.success("Produto cadastrado!")
          navigate("/dashboard/new");
        }
      } catch (error) {
        console.log("Error ao buscar produto");
        toast.error("Erro ao cadastrar produto!")
        navigate("/dashboard/new");
      }
    }
    fetchProduct();
  }, [productId, navigate]);

  useEffect(() => {
    console.log('Variações salvas:', variations);
  }, [variations]);

  useEffect(() => {
    async function loadCategory() {
      await getDocs(listRef)
        .then((snapshot) => {
          const lista = [] as categoryProps[];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              name: doc.data().name
            })
          })

          if (snapshot.size === 0) {
            console.log("NENHUMA CATEGORIA ENCONTRADA");
            setCategory([{ id: '1', name: "FREELA" }])
            setLoadCategory(false)
            return;

          }
          setCategory(lista)
          setLoadCategory(false)
        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS CLIENTES", error);
          setLoadCategory(false);
          setCategory([{ id: '1', name: 'FREELA' }])
        })
    }


    async function loadCores() {
      await getDocs(listCoresRef)
        .then((snapshot) => {
          const lista = [] as colorProps[];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              name: doc.data().cor,
              images: doc.data().images

            })
          })

          if (snapshot.size === 0) {
            console.log("NENHUMA CATEGORIA ENCONTRADA");
            setLoadColor(false)
            return;

          }

          setColor(lista)
          setLoadColor(false)
        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS CLIENTES", error);
          setLoadColor(false);

        })
    }
    async function loadTamanho() {
      await getDocs(listTamanhoRef)
        .then((snapshot) => {
          const lista = [] as tamanhoProps[];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              name: doc.data().tamanho,
              owner: doc.data().owner,
            })
          })

          if (snapshot.size === 0) {
            console.log("NENHUM TAMANHO ENCONTRADO");
            setLoadSize(false)
            return;

          }

          setSize(lista)
          setLoadSize(false)
        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS CLIENTES", error);
          setLoadSize(false);
        })
    }

    loadCategory();
    loadCores();
    loadTamanho();
  }, [])

  async function loadCategories() {
    try {
      const categoriesSnapshot = await getDocs(listRef);
      const categoriesData = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao carregar as categorias:", error);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchProductImages() {
      if (!productId) return;

      try {
        const productDoc = await getDoc(doc(db, "Produtos", productId));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          if (productData && productData.images) {
            setProductImagesFromDB(productData.images);
            setExistingImages(productData.images);
          }
        } else {
          console.log("Produto não encontrado");
          toast.error("Produto não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar imagens do produto:", error);
        toast.error("Erro ao buscar imagens do produto!");
      }
    }

    fetchProductImages();
  }, [productId]);

  const handleDeleteImageFromDB = async (item: ImageItemProps) => {
    try {
      const updatedImages = productImagesFromDB.filter(image => image.name !== item.name);
      setProductImagesFromDB(updatedImages);

      // Update the state to track deleted images
      setDeletedImages([...deletedImages, item]);

      toast.success("Imagem excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir imagem do produto:", error);
      toast.error("Erro ao excluir imagem do produto!");
    }
  };

  async function handleFileEdit(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImages = Array.from(e.target.files);

      // Filtrar apenas as novas imagens
      const newImagesArray = selectedImages.filter(image => !existingImages.some(existingImage => existingImage.name === image.name));

      // Adicionar novas imagens ao estado
      setNewImages([...newImages, ...newImagesArray]);

      // Realizar o upload das novas imagens
      for (const image of newImagesArray) {
        if (image.type === "image/jpeg" || image.type === "image/png") {
          await handleUploadEdit(image);
        } else {
          alert("Envie apenas imagens jpeg ou png");
          return;
        }
      }
    }
  }

  async function handleUploadEdit(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

    try {
      const snapshot = await uploadBytes(uploadRef, image);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      setProductImage((images) => [...images, {
        name: uidImage,
        uid: currentUid,
        previewUrl: URL.createObjectURL(image),
        url: downloadUrl,
      }]);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
    }
  }

  async function onSubmit(data: FormData) {
    try {
      // Extrair tamanhos únicos das variações
      const sizesArray = Array.from(new Set(variations.map(variation => variation.size)));
  
      const newProduct = {
        name: data.name.toUpperCase(),
        categoria: category[categoria].name,
        price: data.price,
        description: data.description,
        status: status,
        created: new Date(),
        owner: user?.name,
        size: sizesArray, // Armazena os tamanhos únicos
        id: user?.uid,
        images: productImage,
        variations: variations // Salvar variações diretamente
      };
  
      await addDoc(collection(db, "Produtos"), newProduct);
  
      reset();
      toast.success("Produto Cadastrado!");
      setProductImage([]);
      setColorSelected('');
      navigate('/dashboard');
      console.log("PRODUTO CADASTRADO COM SUCESSO!");
    } catch (error) {
      console.error("ERRO AO CADASTRAR PRODUTO", error);
      toast.error("Erro ao cadastrar o produto!");
    }
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0]

      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image)
      } else {
        alert("Envie uma imagem jpeg ou png")
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

    // Você precisa aguardar a resolução da Promise aqui
    try {
      const snapshot = await uploadBytes(uploadRef, image);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      const imageItem = {
        name: uidImage,
        uid: currentUid,
        previewUrl: URL.createObjectURL(image),
        url: downloadUrl
      };

      setProductImage((images) => [...images, imageItem]);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
    }
  }

  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `images/${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath)

    try {
      await deleteObject(imageRef)
      setProductImage(productImage.filter((image) => image.url !== item.url))
    } catch (error) {
      console.log("ERROR AO DELETAR")
    }
  }

  const handleDeleteVariation = (index: number) => {
    const newVariations = [...variations];
    newVariations.splice(index, 1);
    setVariations(newVariations);
  };

  const handleDeleteVariationEdit = async (index: number) => {
    try {
      const productDoc = await getDoc(doc(db, "Produtos", productId!));

      if (productDoc.exists()) {
        const productData = productDoc.data();

        if (productData && productData.variations && productData.variations.length > 0) {

          if (productData.variations.length > 1) {
            const updatedVariations = [...productData.variations];
            updatedVariations.splice(index, 1);

            await updateDoc(doc(db, "Produtos", productId!), {
              variations: updatedVariations
            });

            toast.success("Variação excluída com sucesso!");

            setEditVariations(updatedVariations);
          } else {
            toast.error("É necessário manter pelo menos uma variação cadastrada!");
          }
        } else {
          toast.error("Nenhuma variação encontrada para excluir!");
        }
      } else {
        toast.error("Produto não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao excluir variação:", error);
      toast.error("Erro ao excluir variação!");
    }
  };


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChangeCategory(e: any): void {
    setCategoria(e.target.value)
    console.log(categoria)
  }

  function handleOptionChange(e: ChangeEvent<HTMLInputElement>) {
    setStatus(e.target.value)
    console.log(status)
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
    setPrice(e.target.value)
  }

  function handleDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setDefaultSize(size);

    setSelectedVariation((prevVariation) => ({
      ...prevVariation,
      size: size,
    }));
  };


  const handleColorChange = (name: string) => {
    setColorSelected(name);
    setDefaultColor(name);
  };

  const editSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Atualiza os detalhes do produto
      await updateDoc(doc(db, "Produtos", productId!), {
        name: name,
        price: price,
        description: description,
        status: status,
        categoria: selectedCategory || categoria
      });

      // Atualiza as imagens do produto (adicionando as novas e removendo as excluídas)
      const updatedImages = [...existingImages, ...productImage].filter(image => !deletedImages.some(deletedImage => deletedImage.name === image.name));
      await updateDoc(doc(db, "Produtos", productId!), {
        images: updatedImages,
      });

      // Atualiza as variações do produto
      await updateDoc(doc(db, "Produtos", productId!), {
        variations: editVariations,
      });

      // Clear the deleted images state
      setDeletedImages([]);

      toast.success("Produto editado!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      toast.error("Erro ao editar produto!");
      navigate("/dashboard");
    }
  };

  const handleSaveVariation = () => {
    if (!selectedSize || !colorSelected || estoque <= 0) {
      return;
    }
  
    const selectedColorObj = color.find((c) => c.name === colorSelected);
  
    if (selectedColorObj && selectedColorObj.images.length > 0) {
      const selectedColorImage = selectedColorObj.images[0];
  
      // Verificar se já existe uma variação com o tamanho selecionado
      const existingVariationIndex = variations.findIndex((variation) => variation.size === selectedSize);
  
      if (existingVariationIndex >= 0) {
        // Se a variação com o tamanho já existe, adicionar a nova cor a essa variação
        variations[existingVariationIndex].colors.push({
          uid: uuidV4(),
          name: colorSelected,
          imageUrl: selectedColorImage.url,
          previewUrl: selectedColorImage.previewUrl,
          url: selectedColorImage.url,
          estoque: estoque,
        });
      } else {
        // Se a variação com o tamanho não existe, criar uma nova variação
        const newVariation = {
          size: selectedSize,
          colors: [{
            uid: uuidV4(),
            name: colorSelected,
            imageUrl: selectedColorImage.url,
            previewUrl: selectedColorImage.previewUrl,
            url: selectedColorImage.url,
            estoque: estoque,
          }]
        };
  
        setVariations([...variations, newVariation]);
      }
  
      // Limpar estado de seleção de variação e estoque
      setSelectedVariation({ size: "", colors: [] });
      setDefaultSize("Selecione o Tamanho");
      setDefaultColor("Selecione a cor");
      setSelectedSize("");
      setColorSelected("");
      setEstoque(0);
    } else {
      console.error(`Imagem não encontrada para a cor ${colorSelected}`);
    }
  };

  const handleSaveVariationEdit = async () => {
    try {
      if (!selectedSize || !colorSelected || estoque <= 0) {
        return;
      }

      const selectedColorObj = color.find((c) => c.name === colorSelected);

      if (selectedColorObj && selectedColorObj.images.length > 0) {
        const selectedColorImage = selectedColorObj.images[0];

        const newVariation = {
          size: selectedSize,
          colors: [
            {
              uid: uuidV4(),
              name: colorSelected,
              imageUrl: selectedColorImage.url,
              previewUrl: selectedColorImage.previewUrl,
              url: selectedColorImage.url,
              estoque: estoque,
            }
          ]
        };

        // Adicione a nova variação ao estado de variações editadas
        const updatedVariations = [...editVariations, newVariation];
        setEditVariations(updatedVariations);

        // Limpe o estado de seleção de variação e estoque
        setSelectedVariation({ size: "", colors: [] });
        setDefaultSize("Selecione o Tamanho");
        setDefaultColor("Selecione a cor");
        setSelectedSize("");
        setColorSelected("");
        setEstoque(0);

        toast.success("Variação adicionada com sucesso!");
      } else {
        console.error(`Imagem não encontrada para a cor ${colorSelected}`);
      }
    } catch (error) {
      console.error("Erro ao adicionar variação:", error);
      toast.error("Erro ao adicionar variação!");
    }
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>, variationIndex: number, colorIndex: number) => {
    const newVariations = [...editVariations];
    newVariations[variationIndex].colors[colorIndex].estoque = parseInt(e.target.value);
    setEditVariations(newVariations);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div>
      <HeaderDashboard />

      <div className="ml-[300px] pt-[1px] px-[16px] max-md:ml-0">
        {productId ? (
          <Title name={"Editar Produto"}>
            <FaListAlt size={25} color="#FFF" />
          </Title>
        ) : (
          <Title name={"Cadastrar Produto"}>
            <FaListAlt size={25} color="#FFF" />
          </Title>
        )}


        {productId ? (
          <div className='bg-white p-10 rounded-md shadow-md'>
            <div className='flex'>
              <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                <div className="absolute cursor-pointer ">
                  <FiUpload size={30} color="#000" />
                </div>
                <div className="cursor-pointer ">
                  <input
                    className="opacity-0 cursor-pointer"
                    onChange={handleFileEdit}
                    type="file"
                    accept="image/*"
                    multiple
                  />
                </div>
              </button>

              {productImage.map(item => (
                <div className='h-32 flex items-center justify-center relative ' key={item.name}>
                  <button className="absolute flex text-black" onClick={() => handleDeleteImage(item)}>
                    <FiTrash2 size={24} color="#FFF" />
                  </button>
                  <img
                    src={item.previewUrl}
                    className="rounded-lg w-full h-32 object-cover ml-2 "
                  />
                </div>
              ))}
            </div>
            <h1 className='text-xl font-semibold my-8'>Imagens do produto:</h1>
            <div className='flex items-centerr my-3'>
              {productImagesFromDB.map(item => (
                <div key={item.uid} className="flex items-center">
                  <div className='flex flex-col'>
                    <img src={item.url} alt={item.name} className="w-24 h-24 object-cover mr-4 rounded-lg" />
                    <button className='flex items-center' onClick={() => handleDeleteImageFromDB(item)}>Excluir<FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={editSubmit} className='flex flex-col'>
              {/* Permitir que o usuário adicione novas imagens */}
              <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">


              </div>
              <label>Nome do Produto:</label>
              <input
                className='block w-full rounded-md border-2 border-gray-400 py-3 px-2 text-gray-600 md:text-sm'
                placeholder="Editar nome do produto"
                value={name}
                onChange={handleNameChange}
                type='text'
              />
              <div className='flex flex-col w-full'>
                <label>Preço:</label>
                <input
                  className='block w-full rounded-md border-2 border-gray-400 py-3 px-2 text-gray-600 md:text-sm'
                  placeholder="Editar preço do produto"
                  value={price}
                  onChange={handlePriceChange}
                  type='text'
                />
              </div>

              <label>Editar Categoria:</label>
              <select
                className='w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
                value={selectedCategory || ''}
                onChange={handleCategoryChange}
              >
                <option disabled value="">Selecione a categoria</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.name} selected={item.name === selectedCategory}>
                    {item.name}
                  </option>
                ))}
              </select>

              <h1 className='my-1 text-xl font-semibold'>Variação do Produto:</h1>

              <label className='my-2'>Status</label>
              <div>
                <input
                  type="radio"
                  name="radio"
                  value="Ativo"
                  onChange={handleOptionChange}
                  checked={status === 'Ativo'}
                />
                <span className="ml-1 mr-1">Ativo</span>

                <input
                  type="radio"
                  name="radio"
                  value="Inativo"
                  onChange={handleOptionChange}
                  checked={status === 'Inativo'}
                />
                <span className="ml-1">Inativo</span>
              </div>
              <label className='mt-4'>Descrição do produto</label>
              <textarea
                className='w-full border-2 rounded-md h-24 px-2'
                value={description}
                onChange={handleDescriptionChange}
                placeholder='Editar descrição do produto...'
              />
              <button type='submit' className='bg-wine-black w-48 mt-5 p-2 rounded-md hover:bg-wine-light hover:scale-[1.02] duration-300'>
                <span className='text-white font-bold'>Salvar alterações</span>
              </button>
            </form>

            <h1 className='font-semibold text-xl mt-10'>Editar Variações</h1>
            {editVariations.map((variation, index) => (
              <div key={index} className="flex flex-col w-auto bg-wine-black mt-2 rounded-md pl-5 py-3">
                <span className='text-white font-semibold mb-1'>Variação {index + 1}</span>
                <span className='text-white'>
                  <span className='font-semibold'>Tamanho:</span> {variation.size}
                </span>

                {variation.colors.map((color, colorIndex) => (
                  <span key={colorIndex} className='text-white'>
                    <span className='font-semibold'>Cor:</span> {color.name}
                  </span>
                ))}
                <div className='flex w-full justify-between'>
                  {variation.colors.map((color, colorIndex) => (
                    <div className='flex items-center' key={color.uid}>
                      <span className='text-white font-semibold pr-1'>Qtd:</span>
                      <input
                        className='block w-14 rounded-md border-2 border-gray-400 p-1 text-gray-600 md:text-sm my-2'
                        type="number"
                        placeholder='ex: 55'
                        value={color.estoque}
                        onChange={(e) => handleStockChange(e, index, colorIndex)}
                      />
                    </div>
                  ))}
                  <div className='flex mr-5'>
                    <button onClick={() => handleDeleteVariationEdit(index)}>
                      <FiTrash2 size={22} color='#FFF' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <h1 className='mt-10 mb-2 text-xl font-semibold'>Adicionar variação:</h1>
            {/* ---SELECIONE O TAMANHO--- */}
            <label>Selecione o Tamanho</label>
            {
              loadSize ? (
                <input type="text" disabled={true} value="Carregando..." />
              ) : (
                <select
                  className='w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
                  value={defaultSize}
                  onChange={(event) => handleSizeSelect(event.target.value)}>
                  <option disabled value="Selecione o Tamanho">Selecione o Tamanho</option>
                  {size.map((item) => {
                    return (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    )
                  })}
                </select>
              )
            }

            {/* ---SELECIONE A COR--- */}
            <label>Selecione a cor</label>
            {
              loadColor ? (
                <input type="text" disabled={true} value="Carregando..." />
              ) : (
                <select
                  className='w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
                  value={defaultColor}
                  onChange={(event) => handleColorChange(event.target.value)}>
                  <option disabled value="Selecione a cor">Selecione a cor</option>
                  {color.map((item) => {
                    return (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    )
                  })}
                </select>
              )
            }

            <label>Estoque:</label>
            <input
              className='block w-full rounded-md border-2 border-gray-400 py-3 px-2 text-gray-600 md:text-sm'
              type="number"
              placeholder='ex: 55'
              value={estoque}
              onChange={(e) => setEstoque(parseInt(e.target.value))}
            />
            {/* Renderiza as variações */}
            {variations.map((variation, index) => (
              <div key={index} className="flex flex-col w-auto bg-wine-black mt-2 rounded-md p-1">
                <span className='text-white font-semibold mb-1'>Variação {index + 1}</span>
                {variation.colors.map((color, colorIndex) => (
                  <span key={colorIndex} className='text-white'>
                    <span className='font-semibold'>Cor:</span> {color.name}
                  </span>
                ))}
                <span className='text-white mt-1'><span className='font-semibold'>Tamanho:</span> {variation.size}</span>
                <div className='flex justify-between'>
                  {variation.colors.map((item, index) => (
                    <span key={index} className='text-white mt-1'><span className='font-semibold'>Estoque:</span>{item.estoque}</span>
                  ))}
                  <button onClick={() => handleDeleteVariation(index)}>
                    <FiTrash2 size={20} color='#FFF' />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={handleSaveVariationEdit} className='bg-wine-black w-48 mt-5 p-2 rounded-md hover:bg-wine-light hover:scale-[1.02] duration-300'>
              <span className='text-white font-bold'>Adicionar variação</span>
            </button>
          </div>
        ) : (
          //FORMULARIO CADASTRO
          <div className='bg-white p-10 rounded-md shadow-md'>
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
              <button
                className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                <div className="absolute cursor-pointer">
                  <FiUpload size={30} color="#000" />
                </div>
                <div className="cursor-pointer">
                  <input
                    className="opacity-0 cursor-pointer"
                    onChange={handleFile}
                    type="file"
                    accept="image/*" />
                </div>
              </button>

              {productImage.map(item => (
                <div className='w-full h-32 flex items-center justify-center relative' key={item.name}>
                  <button className="absolute" onClick={() => handleDeleteImage(item)}>

                    <FiTrash size={24} color="#FFF" />
                  </button>
                  <img
                    src={item.previewUrl}
                    className="rounded-lg w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
              <label>Nome do Produto:</label>
              <Input
                placeholder=""
                name='name'
                type='text'
                error={errors.name?.message}
                register={register}
              />
              <div className='flex flex-col w-full'>
                <label className='mt-4'>Selecione a Categoria</label>
                {
                  loadCategory ? (
                    <input type="text" disabled={true} value="Carregando..." />
                  ) : (
                    <select
                      className='w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
                      value={categoria}
                      onChange={handleChangeCategory}>
                      {category.map((item, index) => {
                        return (
                          <option key={index} value={index}>
                            {item.name}
                          </option>
                        )
                      })}
                    </select>
                  )
                }
                <label>Preço:</label>
                <Input
                  placeholder="ex: 99,90"
                  name='price'
                  type='text'
                  error={errors.price?.message}
                  register={register}
                />
              </div>

              <label className='mt-4'>Status</label>
              <div>
                <input
                  type="radio"
                  name="radio"
                  value="Ativo"
                  onChange={handleOptionChange}
                  checked={status === 'Ativo'}
                />
                <span className="ml-1 mr-1">Ativo</span>

                <input
                  type="radio"
                  name="radio"
                  value="Inativo"
                  onChange={handleOptionChange}
                  checked={status === 'Inativo'}
                />
                <span className="ml-1">Inativo</span>
              </div>
              <label className='mt-4'>Descrição do produto</label>
              <textarea
                className='w-full border-2 rounded-md h-24 px-2'
                placeholder='Adicionar descrição do produto...'
                {...register('description')}
              />
              <h1 className='my-5 text-xl font-semibold'>Variações do Produto:</h1>
              {/* ---SELECIONE O TAMANHO--- */}
              <label>Selecione o Tamanho</label>
              {
                loadSize ? (
                  <input type="text" disabled={true} value="Carregando..." />
                ) : (
                  <select
                    className='w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
                    value={defaultSize}
                    onChange={(event) => handleSizeSelect(event.target.value)}>
                    <option disabled value="Selecione o Tamanho">Selecione o Tamanho</option>
                    {size.map((item) => {
                      return (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      )
                    })}
                  </select>
                )
              }

              {/* ---SELECIONE A COR--- */}
              <label>Selecione a cor</label>
              {
                loadColor ? (
                  <input type="text" disabled={true} value="Carregando..." />
                ) : (
                  <select
                    className='w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
                    value={defaultColor}
                    onChange={(event) => handleColorChange(event.target.value)}>
                    <option disabled value="Selecione a cor">Selecione a cor</option>
                    {color.map((item) => {
                      return (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      )
                    })}
                  </select>
                )
              }

              <label>Estoque:</label>
              <input
                className='block w-full rounded-md border-2 border-gray-400 py-3 px-2 text-gray-600 md:text-sm'
                type="number"
                placeholder='ex: 55'
                value={estoque}
                onChange={(e) => setEstoque(parseInt(e.target.value))}
              />
              {/* Renderiza as variações */}
              {variations.map((variation, index) => (
                <div key={index} className="flex flex-col w-auto bg-wine-black mt-2 rounded-md p-1">
                  <span className='text-white font-semibold mb-1'>Variação {index + 1}</span>
                  {variation.colors.map((color, colorIndex) => (
                    <span key={colorIndex} className='text-white'>
                      <span className='font-semibold'>Cor:</span> {color.name}
                    </span>
                  ))}
                  <span className='text-white mt-1'><span className='font-semibold'>Tamanho:</span> {variation.size}</span>
                  <div className='flex justify-between'>
                    {variation.colors.map((item, index) => (
                      <span key={index} className='text-white mt-1'><span className='font-semibold'>Estoque:</span>{item.estoque}</span>
                    ))}
                    <button onClick={() => handleDeleteVariation(index)}>
                      <FiTrash2 size={20} color='#FFF' />
                    </button>
                  </div>

                </div>
              ))}
              <button type='submit' className='bg-wine-black w-48 mt-5 p-2 rounded-md hover:bg-wine-light hover:scale-[1.02] duration-300'>
                <span className='text-white font-bold'>Cadastrar Produto</span>
              </button>
            </form>
            <button onClick={handleSaveVariation} className='bg-wine-black w-48 mt-5 p-2 rounded-md hover:bg-wine-light hover:scale-[1.02] duration-300'>
              <span className='text-white font-bold'>Salvar variação</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
