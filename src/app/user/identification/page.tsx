"use client"
import { usePayment } from "@/hooks/usePayment";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";



export default function Identification(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [cpf,setCpf] = useState('')
  const [loading,setLoading] = useState(false)
  const router = useRouter()
  const {addClient,resetAll} = usePayment()


  useEffect(()=>{
    resetAll()
  },[resetAll])
  const handleSaveClient = useCallback(async (form:FormEvent)=>{
    
    try {
      form.preventDefault();
    
      const data = {
        name,
        email,
        cpf
      }
      setLoading(true)
      const response = await fetch(process.env.NEXT_PUBLIC_APP_URL + '/clients',{
        method:'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body:JSON.stringify(data),
        
      })
      const toJson = await response.json();

      

      if(!response.ok){
        throw Error(JSON.stringify(toJson))
      }
      
      
      addClient(toJson)
      setLoading(false)
      router.push('./products')
    } catch (error) {
      console.error('errrr',error);
      setLoading(false)
    }
  },[name, email, cpf, addClient, router])
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <form 
        onSubmit={handleSaveClient}
        className="bg-zinc-900 p-8 rounded-lg shadow-md text-center min-w-80 w-1/4 flex flex-col gap-2"
      >
          <Input 
              type="text"
              label="Nome"
              
              onValueChange={setName}
          />
          <Input
              type="email"
              label="Email"
              
              onValueChange={setEmail}
          />
          <Input
            type="text"
            label="CPF"
            
            onValueChange={setCpf }
            
          />
          <div className="flex flex-col mt-4 gap-2">
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
            >
              Proximo
            </Button>
            <Link href="./products">Ignorar essa etapa</Link>
          
          </div>
      </form>
    </div>
  );
}

