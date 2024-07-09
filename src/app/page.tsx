"use client"
import { usePayment } from "@/hooks/usePayment";

const HomePage = () => {
const {order}=usePayment()

  return <>{order.id} </>;
};



export default HomePage;
