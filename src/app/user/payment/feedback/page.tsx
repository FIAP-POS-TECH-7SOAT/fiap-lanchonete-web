"use client"
import { usePayment } from '@/hooks/usePayment';
import { Button } from '@nextui-org/react';
import { useRouter  } from 'next/navigation';
import React, { useCallback } from 'react';



export default function Feedback(){

  const {order,client } = usePayment();
  const router = useRouter();

  const handleResetOrder = useCallback(()=>{
    router.push('/user/identification')
  },[ router])

  return (
      <div className=" flex flex-col items-center justify-center min-h-screen  ">
        <div className='bg-zinc-900 p-8 rounded-lg shadow-md text-center min-w-80 w-2/4'>
          <h1 className="text-3xl font-semibold text-green-500 ">Pagamento Reconhecido!</h1>
          {/* <p className="text-lg mb-4">Seu pedido foi processado com sucesso.</p> */}
          <div className='my-4'>
            <p className="text-sm	 font-normal text-blue-600">
              Número do Pedido: 
              <span className="text-3xl font-bold block">{order.code}</span>
            </p>

          </div>
          {client && client.name &&
            <p className="text-xl mb-2">Obrigado, <span className="font-bold" id="userName">{client.name}</span>!</p>
          }

        </div>
        <Button color="danger" className="mt-4" onClick={handleResetOrder}>
          Reiniciar
        </Button>
      </div>
    );
}

