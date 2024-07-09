
"use client"

import { ScrollShadow, Tab, Tabs } from "@nextui-org/react";

import { CiFries } from "react-icons/ci";
import { FaHamburger } from "react-icons/fa";
import { LuCupSoda } from "react-icons/lu";
import { IItemsProduct, ProductItem } from "./components/ProductItem";
import { useCallback, useEffect, useState } from "react";
import { Summary } from "./components/Summary";
import { formatToBRL } from "@/utils/formatCurrency";
import { useRouter } from "next/navigation";
import { usePayment } from "@/hooks/usePayment";

interface ICreateOrder {
  products: {
    id: string;
    amount: number;
  }[];
  client_id: string | null;
}
export interface ICart {
  id:string;
  image:string;
  name:string;
  price:number;
  amount:number;
  subTotal:string;
}
export default function Products() {
  
  const [hamburgers,setHamburgers]= useState<IItemsProduct[]>([])
  const [accompaniment,setAccompaniment]= useState<IItemsProduct[]>([])
  const [drinks,setDrinks]= useState<IItemsProduct[]>([])
  const [desserts,setDesserts]= useState<IItemsProduct[]>([])

  const {client, addPayment,addOrder,cart,addCart} = usePayment()
  const router = useRouter()
  useEffect(()=>{

    async function load(){
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/products?category=Lanche`)
      const toJson = await response.json();
      if(!response.ok){
        return null
      }
      
      
      setHamburgers(toJson)
      
    }
    load()
  },[])

  const handleCreateOrder = useCallback(async ()=>{
   try {
    const products = cart.map(item=>({
      id:item.id,
      amount:item.amount
    }))

    const data = {
      products,
      client_id:client?.id,
    }
    const response = await fetch(process.env.NEXT_PUBLIC_APP_URL + '/orders',{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body:JSON.stringify(data),
    })
    const toJson = await response.json();
    if(!response.ok){
      throw new Error(toJson)
    }
    const {order, ...rest} = toJson
    addOrder(order)
    addPayment(rest)
    router.push('./payment')
   } catch (error) {
    
   }
  },[addOrder, addPayment, cart, client, router])

  const handleAddCart = useCallback((product:IItemsProduct)=>{

    
      const productIndex = cart.findIndex(item=>item.id ===product.id);
      if(productIndex>=0){
        const updatedCart = cart.map((item, index) => {
          if (index === productIndex) {
            const amount = item.amount + 1
            return {
              ...item,
              amount,
              subTotal: formatToBRL(item.price * amount)
            };
          }
          return item;
        });
    
        addCart(updatedCart);
      }else{
        const newItem:ICart={
          id:product.id,
          image:product.image,
          name:product.name,
          price:product.price,
          amount:1,
          subTotal:formatToBRL(product.price)
        }
        addCart([...cart,newItem])
      }
      
  },[addCart, cart])

  const handleIncreaseItemCart = useCallback((product_id:string)=>{

    
      const productIndex = cart.findIndex(item=>item.id ===product_id);
      if(productIndex>=0){
        const updatedCart = cart.map((item, index) => {
          if (index === productIndex) {
            const amount = item.amount + 1
            return {
              ...item,
              amount,
              subTotal: formatToBRL(item.price * amount)
            };
          }
          return item;
        });
    
        addCart(updatedCart);
      }
      
      
    
  },[addCart, cart])
  const handleDecreaseItemCart = useCallback((product_id:string)=>{

    
      const productIndex = cart.findIndex(item=>item.id ===product_id);
      if(productIndex>=0){
        
        if(cart[productIndex].amount - 1 <= 0){
          console.log('aqui',cart.filter(item=>item.id!==cart[productIndex].id));
          
          addCart(cart.filter(item=>item.id!==cart[productIndex].id))

        }
        const updatedCart = cart.map((item, index) => {
          if (index === productIndex) {
            const amount = item.amount - 1
            return {
              ...item,
              amount,
              subTotal: formatToBRL(item.price * amount)
            };
          }
          return item;
        });
    
        addCart(updatedCart)
      }
      
      
    
  },[addCart, cart])
  const handleRemovrItemCart = useCallback((product_id:string)=>{

    
      const productIndex = cart.findIndex(item=>item.id ===product_id);
      if(productIndex>=0){
        return cart.splice(productIndex,1)

      }
      addCart(cart)
      
    
  },[addCart, cart])

  const handleAccompaniment= useCallback(()=>{
    const toJson:any = [
      {
        "id": "3b9fae2b-1b2e-4293-946f-502d837cc94a",
        "name": "Batata Frita",
        "category": "Acompanhamento",
        "price": 10.0,
        "description": "BATATAS FRITAS CROCANTES",
        "image": "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2023/05/batata_frita_destaque_ilustrativo_zona_sul.jpg"
      },
      {
        "id": "7e83d234-8e4f-4b8a-8d36-7a29127f6df9",
        "name": "Cebola Frita",
        "category": "Acompanhamento",
        "price": 8.5,
        "description": "ANEL DE CEBOLA EMPANADO E FRITO",
        "image": "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2023/05/batata_frita_destaque_ilustrativo_zona_sul.jpg"
      },
      {
        "id": "b3fd1d23-1a5f-45a0-985f-c79b16a5bbf0",
        "name": "Batata Rústica",
        "category": "Acompanhamento",
        "price": 12.0,
        "description": "BATATAS RÚSTICAS COM ERVAS",
        "image": "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2023/05/batata_frita_destaque_ilustrativo_zona_sul.jpg"
      },
      {
        "id": "2d9cb834-12e4-4a36-89c9-80b12a5e17f3",
        "name": "Batata Doce Frita",
        "category": "Acompanhamento",
        "price": 11.0,
        "description": "BATATAS DOCES FRITAS CROCANTES",
        "image": "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2023/05/batata_frita_destaque_ilustrativo_zona_sul.jpg"
      },
      {
        "id": "d497c6b7-8884-44c4-8d2a-284fb9058e6e",
        "name": "Mandioquinha Frita",
        "category": "Acompanhamento",
        "price": 10.5,
        "description": "MANDIOQUINHAS FRITAS CROCANTES",
        "image": "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2023/05/batata_frita_destaque_ilustrativo_zona_sul.jpg"
      },
      {
        "id": "27f7cbe8-16e4-4f8b-b8da-8789fd6a87c3",
        "name": "Mozzarella Sticks",
        "category": "Acompanhamento",
        "price": 14.0,
        "description": "PALITOS DE MUSSARELA EMPANADOS E FRITOS",
        "image": "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2023/05/batata_frita_destaque_ilustrativo_zona_sul.jpg"
      },
      {
        "id": "ac71a8eb-3c0c-4b6c-9fd3-1c6d43cbb3a2",
        "name": "Batata Canoinha",
        "category": "Acompanhamento",
        "price": 13.0,
        "description": "BATATAS CANOINHA ASSADAS COM ALECRIM",
        "image": "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2023/05/batata_frita_destaque_ilustrativo_zona_sul.jpg"
      },
      {
        "id": "fa2d7d5f-df13-4c8a-a74c-6fbc9e594817",
        "name": "Bolinhos de Queijo",
        "category": "Acompanhamento",
        "price": 9.0,
        "description": "BOLINHOS DE QUEIJO EMPANADOS E FRITOS",
        "image": "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2023/05/batata_frita_destaque_ilustrativo_zona_sul.jpg"
      },
      {
        "id": "db47c2d6-8a8b-4df8-91cc-2e4a5de44d2e",
        "name": "Batata Frita com Cheddar e Bacon",
        "category": "Acompanhamento",
        "price": 15.0,
        "description": "BATATAS FRITAS COBERTAS COM CHEDDAR E BACON",
        "image": "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2023/05/batata_frita_destaque_ilustrativo_zona_sul.jpg"
      },
      {
        "id": "cce1e5b4-8e3a-4c62-9f30-e7ad3e7a5e4a",
        "name": "Onion Rings",
        "category": "Acompanhamento",
        "price": 8.0,
        "description": "ANÉIS DE CEBOLA EMPANADOS E FRITOS",
        "image": "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2023/05/batata_frita_destaque_ilustrativo_zona_sul.jpg"
      }
    ]
    
    
    
    setAccompaniment(toJson)
  },[])

  const handleDrinks= useCallback(()=>{
    const toJson:any = [
      {
        "id": "d1a1c326-9836-46b2-8b24-71fcfbad9f1d",
        "name": "Coca-Cola",
        "category": "Bebida",
        "price": 5.0,
        "description": "REFRIGERANTE DE COLA 350ML",
        "image": "https://www.receiteria.com.br/wp-content/uploads/receitas-de-sucos.jpg"
      },
      {
        "id": "fc9d8eaf-4f8a-4722-84cc-d06d564a273b",
        "name": "Fanta Laranja",
        "category": "Bebida",
        "price": 5.0,
        "description": "REFRIGERANTE DE LARANJA 350ML",
        "image": "https://www.receiteria.com.br/wp-content/uploads/receitas-de-sucos.jpg"
      },
      {
        "id": "0f87c317-5cb5-4e68-8cbb-9fd1e1d87654",
        "name": "Sprite",
        "category": "Bebida",
        "price": 5.0,
        "description": "REFRIGERANTE DE LIMÃO 350ML",
        "image": "https://www.receiteria.com.br/wp-content/uploads/receitas-de-sucos.jpg"
      },
      {
        "id": "c2d1a1e1-1e92-4c29-8c2e-05f8c6d2c1a4",
        "name": "Guaraná Antarctica",
        "category": "Bebida",
        "price": 5.0,
        "description": "REFRIGERANTE DE GUARANÁ 350ML",
        "image": "https://www.receiteria.com.br/wp-content/uploads/receitas-de-sucos.jpg"
      },
      {
        "id": "1a59d1bc-2a34-4c70-8e79-1f8b9edc8b5f",
        "name": "Suco de Laranja",
        "category": "Bebida",
        "price": 6.0,
        "description": "SUCO DE LARANJA NATURAL 300ML",
        "image": "https://www.receiteria.com.br/wp-content/uploads/receitas-de-sucos.jpg"
      },
      {
        "id": "e8f9d2ba-4c4a-46b2-b5a3-1b8d8e6c5d3d",
        "name": "Suco de Morango",
        "category": "Bebida",
        "price": 6.5,
        "description": "SUCO DE MORANGO NATURAL 300ML",
        "image": "https://www.receiteria.com.br/wp-content/uploads/receitas-de-sucos.jpg"
      },
      {
        "id": "3e5d9e5b-5a4b-4b6a-8c4a-1a7f5d2e3e3f",
        "name": "Suco de Abacaxi",
        "category": "Bebida",
        "price": 6.0,
        "description": "SUCO DE ABACAXI NATURAL 300ML",
        "image": "https://www.receiteria.com.br/wp-content/uploads/receitas-de-sucos.jpg"
      },
      {
        "id": "b1f8d2b5-1e3a-4a3b-8e7a-1e2d8d3a7c5e",
        "name": "Suco de Manga",
        "category": "Bebida",
        "price": 6.5,
        "description": "SUCO DE MANGA NATURAL 300ML",
        "image": "https://www.receiteria.com.br/wp-content/uploads/receitas-de-sucos.jpg"
      },
      {
        "id": "7d8e9b5e-2f3d-4e4a-8e6b-1f8a9d2e1d4b",
        "name": "Água Mineral",
        "category": "Bebida",
        "price": 3.0,
        "description": "ÁGUA MINERAL SEM GÁS 500ML",
        "image": "https://www.receiteria.com.br/wp-content/uploads/receitas-de-sucos.jpg"
      },
      {
        "id": "0e4f1a2b-5d4c-4a2e-8b3b-1a2d9d4c6e5f",
        "name": "Chá Gelado",
        "category": "Bebida",
        "price": 5.5,
        "description": "CHÁ GELADO DE LIMÃO 300ML",
        "image": "https://www.receiteria.com.br/wp-content/uploads/receitas-de-sucos.jpg"
      }
    ]
    
    
    
    setDrinks(toJson)
  },[])
  const handleDesserts= useCallback(()=>{
    const toJson:any = [
      {
        "id": "f1a2d3e4-5b6c-7d8e-9f0a-1b2c3d4e5f6a",
        "name": "Sorvete de Chocolate",
        "category": "Sobremesa",
        "price": 8.0,
        "description": "SORVETE DE CHOCOLATE COM CALDA DE CHOCOLATE",
        "image": "https://www.estadao.com.br/resizer/oFDrDp3xgfze9zuyNaR5gnyURVA=/arc-anglerfish-arc2-prod-estadao/public/FIVYQFU6J5ND3PYRA6XQHR4NW4.jpg"
      },
      {
        "id": "a2b3c4d5-6e7f-8g9h-0i1j-2k3l4m5n6o7p",
        "name": "Bolo de Cenoura",
        "category": "Sobremesa",
        "price": 6.5,
        "description": "BOLO DE CENOURA COM COBERTURA DE CHOCOLATE",
        "image": "https://www.estadao.com.br/resizer/oFDrDp3xgfze9zuyNaR5gnyURVA=/arc-anglerfish-arc2-prod-estadao/public/FIVYQFU6J5ND3PYRA6XQHR4NW4.jpg"
      },
      {
        "id": "b3c4d5e6-7f8g-9h0i-1j2k-3l4m5n6o7p8q",
        "name": "Pudim de Leite",
        "category": "Sobremesa",
        "price": 7.0,
        "description": "PUDIM DE LEITE CONDENSADO",
        "image": "https://www.estadao.com.br/resizer/oFDrDp3xgfze9zuyNaR5gnyURVA=/arc-anglerfish-arc2-prod-estadao/public/FIVYQFU6J5ND3PYRA6XQHR4NW4.jpg"
      },
      {
        "id": "c4d5e6f7-8g9h-0i1j-2k3l-4m5n6o7p8q9r",
        "name": "Torta de Limão",
        "category": "Sobremesa",
        "price": 7.5,
        "description": "TORTA DE LIMÃO COM MERENGUE",
        "image": "https://www.estadao.com.br/resizer/oFDrDp3xgfze9zuyNaR5gnyURVA=/arc-anglerfish-arc2-prod-estadao/public/FIVYQFU6J5ND3PYRA6XQHR4NW4.jpg"
      },
      {
        "id": "d5e6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s",
        "name": "Cheesecake de Morango",
        "category": "Sobremesa",
        "price": 9.0,
        "description": "CHEESECAKE DE MORANGO COM CALDA DE MORANGO",
        "image": "https://www.estadao.com.br/resizer/oFDrDp3xgfze9zuyNaR5gnyURVA=/arc-anglerfish-arc2-prod-estadao/public/FIVYQFU6J5ND3PYRA6XQHR4NW4.jpg"
      },
      {
        "id": "e6f7g8h9-0i1j-2k3l-4m5n-6o7p8q9r0s1t",
        "name": "Brigadeiro",
        "category": "Sobremesa",
        "price": 2.5,
        "description": "DOCE DE CHOCOLATE COM GRANULADO",
        "image": "https://www.estadao.com.br/resizer/oFDrDp3xgfze9zuyNaR5gnyURVA=/arc-anglerfish-arc2-prod-estadao/public/FIVYQFU6J5ND3PYRA6XQHR4NW4.jpg"
      },
      {
        "id": "f7g8h9i0-1j2k-3l4m-5n6o-7p8q9r0s1t2u",
        "name": "Mousse de Maracujá",
        "category": "Sobremesa",
        "price": 5.5,
        "description": "MOUSSE DE MARACUJÁ CREMOSO",
        "image": "https://www.estadao.com.br/resizer/oFDrDp3xgfze9zuyNaR5gnyURVA=/arc-anglerfish-arc2-prod-estadao/public/FIVYQFU6J5ND3PYRA6XQHR4NW4.jpg"
      },
      {
        "id": "g8h9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v",
        "name": "Brownie",
        "category": "Sobremesa",
        "price": 8.5,
        "description": "BROWNIE DE CHOCOLATE COM NOZES",
        "image": "https://www.estadao.com.br/resizer/oFDrDp3xgfze9zuyNaR5gnyURVA=/arc-anglerfish-arc2-prod-estadao/public/FIVYQFU6J5ND3PYRA6XQHR4NW4.jpg"
      },
      {
        "id": "h9i0j1k2-3l4m-5n6o-7p8q-9r0s1t2u3v4w",
        "name": "Petit Gâteau",
        "category": "Sobremesa",
        "price": 10.0,
        "description": "BOLO DE CHOCOLATE COM SORVETE DE BAUNILHA",
        "image": "https://www.estadao.com.br/resizer/oFDrDp3xgfze9zuyNaR5gnyURVA=/arc-anglerfish-arc2-prod-estadao/public/FIVYQFU6J5ND3PYRA6XQHR4NW4.jpg"
      },
      {
        "id": "i0j1k2l3-4m5n-6o7p-8q9r-0s1t2u3v4w5x",
        "name": "Tiramisu",
        "category": "Sobremesa",
        "price": 11.0,
        "description": "TIRAMISU TRADICIONAL ITALIANO",
        "image": "https://www.estadao.com.br/resizer/oFDrDp3xgfze9zuyNaR5gnyURVA=/arc-anglerfish-arc2-prod-estadao/public/FIVYQFU6J5ND3PYRA6XQHR4NW4.jpg"
      }
    ]
      
    setDesserts(toJson)
  },[])

  const handleSelectionChange = useCallback((key:string | number)=>{
    switch (key) {
      case 'accompaniment':
        handleAccompaniment()
        break;
      case 'drinks':
        handleDrinks()
        break;
      case 'desserts':
        handleDesserts()
        break;
    
      default:
        break;
    }
  },[handleAccompaniment, handleDesserts, handleDrinks])
  return (
    <div className="flex h-screen p-4">
      
      <div className="flex w-full flex-col ">
        <ScrollShadow hideScrollBar>
            <Tabs 
              aria-label="Options" 
              color="primary" 
              variant="solid" 
              onSelectionChange={handleSelectionChange}
              fullWidth
              
              classNames={{
                base:'sticky top-0 z-50',
                
              }}
              
            >
              <Tab
                key="hamburgers"
                title={
                  <div className="flex items-center space-x-2 ">
                    <FaHamburger />
                    <span>Lanche</span>
                  </div>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  
                    {
                      hamburgers.map(item=>(
                        <ProductItem key={item.id} product={item} onClickItem={handleAddCart}/>
                      ))
                    }
                </div>
              </Tab>
              <Tab
                key="accompaniment"
                title={
                  <div className="flex items-center space-x-2">
                    <CiFries />

                    <span>Acompanhamento</span>
                  </div>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {
                    accompaniment.map(item=>(
                      <ProductItem key={item.id} product={item}/>
                    ))
                  }

                </div>
              </Tab>
              <Tab
                key="drinks"
                title={
                  <div className="flex items-center space-x-2">
                    <LuCupSoda />

                    <span>Bebidas</span>
                  </div>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {
                    drinks.map(item=>(
                      <ProductItem key={item.id} product={item}/>
                    ))
                  }

                </div>
              </Tab>
              <Tab
                key="desserts"
                title={
                  <div className="flex items-center space-x-2">
                    <LuCupSoda />

                    <span>Bebidas</span>
                  </div>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {
                    desserts.map(item=>(
                      <ProductItem key={item.id} product={item}/>
                    ))
                  }

                </div>
              </Tab>
            </Tabs>
        </ScrollShadow>
      </div> 
      <div className="p-4">
        <Summary 
          cart={cart} 
          onDecreaseItem={handleDecreaseItemCart} 
          onIncreaseItem={handleIncreaseItemCart} 
          onRemoveItem={handleRemovrItemCart}
          onFinish={handleCreateOrder}
        />
      </div>
    </div> 
  );
}

 