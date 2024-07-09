"use client"
import { Button, Card, CardBody, Chip, Divider, ScrollShadow } from "@nextui-org/react"
import next from "next";
import { useCallback, useEffect, useState } from "react";

interface IProduct {
  id: string;
  name: string;
}

interface IOrderProduct {
  id: string;
  amount: number;
  product: IProduct;
}

interface IOrder {
  id: string;
  client_id: string;
  products: IOrderProduct[];
  status: string;
  created_at: string; // Use Date se for necessário manipular como objeto Date
  code: string;
  waitTime: string;
}
type StatusType = 'Recebido' | 'Em preparação' | 'Pronto' | 'Finalizado';
interface Status {
  [key: string]: { name:StatusType;type: string };
  Recebido: { name:StatusType;type: string };
  'Em preparação': { name:StatusType;type: string };
  Pronto: { name:StatusType;type: string };
  Finalizado: { name:StatusType;type: string };
}
export default function Page() {
  const status2 ={
    Recebido:{
      type:'primary',
      flow:{
        name:'Preparar',
        next:'Em preparação'
      }
    },
    'Em preparação':{
      type:'warning',
      flow:{
        name:'Entregar',
        next:'Pronto'
      }
    },
    Pronto:{
      type:'success',
      flow:{
        name:'Finalizar',
        next:'Finalizado'
      }
    },
    Finalizado:{
      type:'default',
    }
  }
    const status = [
     
      {
        name:'Recebido',
        type:'primary',
        
      },
      {
        name:'Em preparação',
        type:'warning',
        
      },
      {
        name:'Pronto',
        type:'success',
        
      },
      {
        name:'Finalizado',
        type:'default'
      },
    ]
    const [orders,setOrders] = useState<IOrder[]>([])
    useEffect(()=>{

      async function load(){
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/orders`)
        const toJson = await response.json();
        if(!response.ok){
          return null
        }
        
        
        setOrders(toJson)
        
      }
      load()
    },[])

    const handleUpdateStatus = useCallback(async (id:string,status:string)=>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/orders/status/${id}?status=${status}`,{
        method:'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
      })
      
      if(!response.ok){
        throw new Error('Erro ao atualizar')
      }

      setOrders(old=>{
      
        return old.map(item=>{
          if(item.id === id){
            return {
              ...item,
              status
            }
          }
          return item
        })
      })

    },[])

    return (
      <div className="flex gap-4 w-full p-4 h-screen">
        {
          status.map((item,index)=>(
           <>
           <ScrollShadow hideScrollBar className="w-full">
              <div key={item.name} className="flex-1 h-screen">
                <h1 className="text-2xl font-semibold mb-4 text-center">{item.name}</h1>
                  <div>
                    {
                      orders
                        .filter(order=>order.status===item.name)
                        .map(order=>(
                          <div key={order.id} className="flex-1 mb-4">
                            <Card>
                              <CardBody className="flex flex-cols gap-4 p-4">
                                <Chip variant="solid" color={(status2 as any)[item.name].type}>Order: {order.code}</Chip>
                                {order.products.map((productOrder,index)=>(
                                <>
                                  <div key={productOrder.id} className="flex gap-4 justify-between">
                                    <p> {productOrder.product.name}</p>
                                    <p>Qtd: {productOrder.amount}</p>
                                  </div>
                                  {index < order.products.length -1 && <Divider orientation="horizontal" className="w-full"/>}
                                </>
                                ))}
                              </CardBody>
                              {
                                (status2 as any)[item.name]?.flow?.next &&
                                <Button 
                                  color={(status2 as any)[item.name].type}
                                  onClick={()=>handleUpdateStatus(order.id,(status2 as any)[item.name].flow.next)}
                                >
                                  {(status2 as any)[item.name].flow.name}
                                </Button>
                              }
                              
                            </Card>
                          </div>
                        ))
                    }
                </div>
              </div>
            </ScrollShadow>
              {index < status.length -1 && <Divider orientation="vertical" className="h-full"/>}
           </>
          ))
      }
          
      </div>
    )

}