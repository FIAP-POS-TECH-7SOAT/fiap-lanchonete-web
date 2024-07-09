"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/products`);
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);


  const handleImageUpload = async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/products/upload/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      // Atualizar a lista de produtos após o upload
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/products`);
      const data = await response.json();
      setProducts(data);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Produtos</h1>
      <Link href="products/new">
        <Button className="mb-4">Cadastrar Produto</Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            {product.image && <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-4" />}
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p>{product.category}</p>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <Link href={`products/${product.id}`}>
              <Button className="mt-4">Editar</Button>
            </Link>
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageUpload(product.id, event)}
                className="mb-2"
              />
              <Button className="w-full" onClick={() => document.getElementById(`upload-${product.id}`)?.click()}>
                Upload Imagem
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
