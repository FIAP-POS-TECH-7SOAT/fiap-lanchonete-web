"use client"
import React, { ReactNode } from "react"
import { PaymentProvider } from "./usePayment"


type THooks ={
  children:ReactNode
}
export function Hooks({children}:THooks){
  return (
    <PaymentProvider>
        {children}
    </PaymentProvider>
  )
}