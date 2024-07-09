"use client"
import React, {
    createContext,
    useCallback,
    useState,
    useContext,
    ReactNode,
    useMemo,
  } from 'react';
  
  export interface ICart {
    id:string;
    image:string;
    name:string;
    price:number;
    amount:number;
    subTotal:string;
  }
  
  interface IOrder{
    "id": string,
    "client_id": string,
    "status": string,
    "code": string
}
  interface IClient{
    id:string
    cpf:string
    name:string
    email:string
  }
  interface IPayment{
    
    payment:{
      "id": string,
      "code": number,
      "order_id": string,
      "status": string,
      "total_amount": number
    }
    payment_gateway:{
      "id": number,
      "qr_code": string 
      "status": string
      qr_code_base64:string
    }    
  }
  interface PaymentContextData {
    cart:ICart[]
    payment:IPayment;
    order:IOrder;
    client:IClient
    addPayment:(data:any)=>void,
    addCart:(data:ICart[])=>void,
    addClient:(data:any)=>void,
    addOrder:(data:any)=>void,
    resetAll:()=>void
  }
  
  const PaymentContext = createContext<PaymentContextData>({} as PaymentContextData);
  
  interface IPaymentProvider {
    children: ReactNode;
  }
  function PaymentProvider({ children }: IPaymentProvider) {
    
    const [payment, setPayment] = useState<any>(() => {
        const payment = localStorage.getItem('@fiap-lanchonete:payment');
        return JSON.parse(payment?payment:'{}');
    })
    const [cart, setCart] = useState<ICart[]>(() => {
        const cart = localStorage.getItem('@fiap-lanchonete:cart');
        return JSON.parse(cart?cart:'[]');
    })
    const [client, setClient] = useState<any>(() => {
        const client = localStorage.getItem('@fiap-lanchonete:client');
        return JSON.parse(client?client:'{}');
    })
    const [order, setOrder] = useState<any>(() => {
        const order = localStorage.getItem('@fiap-lanchonete:order');
        return JSON.parse(order?order:'{}');
    })

    const addPayment = useCallback((payment:any)=>{
        localStorage.setItem('@fiap-lanchonete:payment',JSON.stringify(payment));
        setPayment(payment)
    },[])
    const addCart = useCallback((cart:any)=>{
      
      
        localStorage.setItem('@fiap-lanchonete:cart',JSON.stringify(cart));
        setCart(cart)
    },[])
    const addClient = useCallback((client:any)=>{
        localStorage.setItem('@fiap-lanchonete:client',JSON.stringify(client));
        setClient(client)
    },[])
    const addOrder = useCallback((order:any)=>{
        localStorage.setItem('@fiap-lanchonete:order',JSON.stringify(order));
        setOrder(order)
    },[])
    const resetAll = useCallback(()=>{
        localStorage.setItem('@fiap-lanchonete:order',JSON.stringify({}));
        localStorage.setItem('@fiap-lanchonete:payment',JSON.stringify({}));
        localStorage.setItem('@fiap-lanchonete:client',JSON.stringify({}));
        localStorage.setItem('@fiap-lanchonete:cart',JSON.stringify([]));
        setOrder(null)
        setPayment(null)
        setClient(null)
        setCart([])
    },[])


    const values = useMemo(
      () => ({
        cart,
        payment,
        client,
        order,
        addPayment,
        addClient,
        addOrder,
        resetAll,
        addCart

      }),
      [addCart, addClient, addOrder, addPayment, cart, client, order, payment, resetAll],
    );
    return <PaymentContext.Provider value={values}>{children}</PaymentContext.Provider>;
  }
  
  function usePayment(): PaymentContextData {
    const context = useContext(PaymentContext);
  
    return context;
  }
  
  export { PaymentProvider, usePayment };