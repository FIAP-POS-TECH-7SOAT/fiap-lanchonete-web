"use client"
import { useState, useEffect } from 'react';
import { useRouter,useParams } from 'next/navigation';
import { Input, Button, Textarea } from '@nextui-org/react';

interface Product {
  id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
}

const ProductForm = () => {
  const [product, setProduct] = useState<Product>({
    name: '',
    category: '',
    price: 0,
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const param = useParams();
  const router = useRouter();
 
  
  const id = param.id

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchProduct = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/products/${id}`);
        const data = await response.json();
        setProduct(data);
      };

      fetchProduct();
    }
  }, [id]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImage(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const method = id === 'new' ? 'POST' : 'PUT';
    const url = id === 'new' ? `${process.env.NEXT_PUBLIC_APP_URL}/products/` : `${process.env.NEXT_PUBLIC_APP_URL}/products/${id}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();
    if (image && id !== 'new') {
      const formData = new FormData();
      formData.append('file', image);

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/products/upload/${id}`, {
        method: 'PATCH',
        body: formData,
      });
    }

    router.push('./');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{id === 'new' ? 'Cadastrar Produto' : 'Editar Produto'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Nome"
            placeholder="Nome do produto"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            fullWidth
          />
        </div>
        <div className="mb-4">
          <Input
            label="Categoria"
            placeholder="Categoria"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            fullWidth
          />
        </div>
        <div className="mb-4">
          <Input
            label="Preço"
            type="number"
            placeholder="Preço"
            value={String(product.price)}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
            fullWidth
          />
        </div>
        <div className="mb-4">
          <Textarea
            label="Descrição"
            placeholder="Descrição do produto"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            fullWidth
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
        </div>
        <Button type="submit" fullWidth>
          {id === 'new' ? 'Cadastrar Produto' : 'Salvar Alterações'}
        </Button>
      </form>
    </div>
  );
};

export default ProductForm;
