"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/react';

import { formatToBRL } from '@/utils/formatCurrency';
import { useRouter } from 'next/navigation';
import { usePayment } from '@/hooks/usePayment';




export default function Payment(){
  const [timeRemaining, setTimeRemaining] = useState(180); // 180 = 3 minutes in seconds
  
  const {payment,order,addOrder} = usePayment();
  const router = useRouter()
  
  const handleCancelOrder =useCallback(()=>{
    console.log('pedido cancelado');
    router.push('/user/products');
    
  },[router])
  
  const verifyPaymentFinished = useCallback(async ()=> {
    try {
      if(!order){
        return;
      }
        
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/payments/${payment.payment.id}`);
        const {payment:paymentResponseJson,order:internalOrder} = await response.json();
        
        if(paymentResponseJson.status === "pending"){
          await new Promise(resolve => setTimeout(resolve, 5000));
          await verifyPaymentFinished();
        }
        addOrder(internalOrder)
        router.push('/user/payment/feedback')
        
    } catch (error) {
        console.error("Erro ao fazer chamada API:", error);
        // Trate o erro conforme necessário
    }
  },[addOrder, order, payment.payment.id, router])
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleCancelOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdown);
  }, [handleCancelOrder]);


  useEffect(()=>{
    verifyPaymentFinished()
  },[
    verifyPaymentFinished
  ])
  
  const formatTime = (seconds:number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-md text-center min-w-80 w-1/4">
        <div className='flex flex-col items-center' >
          <h1 className="text-2xl font-semibold mb-4">Pagamento</h1>
          <p className="text-lg mb-2">Total: {formatToBRL(payment.payment.total_amount||0)}</p>
          <div className="my-4">
            <img src={"data:image/png;base64,"+payment.payment_gateway.qr_code_base64} alt='' style={{ width:'100%'}}/>
            
          </div>
        </div>
        <p className="text-gray-500 mb-4">Escaneie o QR code para pagar</p>
        <div className="flex flex-col items-center justify-center">
          <Spinner />
          <p className="text-2xl font-bold text-red-600">{formatTime(timeRemaining)}</p>
          <p className="ml-3 text-gray-700">Aguardando reconhecimento do pagamento</p>
        </div>
      </div>
    </div>
    );
}

