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
  id: string;
  image: string;
  name: string;
  price: number;
  amount: number;
  subTotal: string;
}

interface IOrder {
  id: string,
  client_id: string,
  status: string,
  code: string
}

interface IClient {
  id: string,
  cpf: string,
  name: string,
  email: string
}

interface IPayment {
  payment: {
    id: string,
    code: number,
    order_id: string,
    status: string,
    total_amount: number
  },
  payment_gateway: {
    id: number,
    qr_code: string,
    status: string,
    qr_code_base64: string
  }
}

interface PaymentContextData {
  cart: ICart[],
  payment: IPayment,
  order: IOrder,
  client: IClient,
  addPayment: (data: any) => void,
  addCart: (data: ICart[]) => void,
  addClient: (data: any) => void,
  addOrder: (data: any) => void,
  resetAll: () => void
}

const PaymentContext = createContext<PaymentContextData>({} as PaymentContextData);

interface IPaymentProvider {
  children: ReactNode;
}

function PaymentProvider({ children }: IPaymentProvider) {
  
  const getLocalStorageItem = (key: string, defaultValue: any) => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    }
    return defaultValue;
  }

  const [payment, setPayment] = useState<IPayment>(() => getLocalStorageItem('@fiap-lanchonete:payment', {}));
  const [cart, setCart] = useState<ICart[]>(() => getLocalStorageItem('@fiap-lanchonete:cart', []));
  const [client, setClient] = useState<IClient>(() => getLocalStorageItem('@fiap-lanchonete:client', {}));
  const [order, setOrder] = useState<IOrder>(() => getLocalStorageItem('@fiap-lanchonete:order', {}));

  const addPayment = useCallback((payment: IPayment) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('@fiap-lanchonete:payment', JSON.stringify(payment));
    }
    setPayment(payment);
  }, []);

  const addCart = useCallback((cart: ICart[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('@fiap-lanchonete:cart', JSON.stringify(cart));
    }
    setCart(cart);
  }, []);

  const addClient = useCallback((client: IClient) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('@fiap-lanchonete:client', JSON.stringify(client));
    }
    setClient(client);
  }, []);

  const addOrder = useCallback((order: IOrder) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('@fiap-lanchonete:order', JSON.stringify(order));
    }
    setOrder(order);
  }, []);

  const resetAll = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('@fiap-lanchonete:order', JSON.stringify({}));
      localStorage.setItem('@fiap-lanchonete:payment', JSON.stringify({}));
      localStorage.setItem('@fiap-lanchonete:client', JSON.stringify({}));
      localStorage.setItem('@fiap-lanchonete:cart', JSON.stringify([]));
    }
    setOrder({} as IOrder);
    setPayment({} as IPayment);
    setClient({} as IClient);
    setCart([]);
  }, []);

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
