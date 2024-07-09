
"use client"
import { InputIncrease } from "@/components/InputIncrease";
import { formatToBRL } from "@/utils/formatCurrency";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
export interface IItemsProduct{
  
    id:string
    name:string
    category:string
    description:string
    price:number
    image:string
  

}
interface IProductItem{
  
  product:IItemsProduct
  onClickItem?:(data:IItemsProduct)=>void
}
export function ProductItem({product,onClickItem}:IProductItem) {
  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <img
          alt="Card background"
          className="object-cover rounded-xl"
          src={product.image?product.image:"https://www.allrecipes.com/thmb/3x-XkV8T36df_M4tkoDbaD-WmJs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/49404-juiciest-hamburgers-ever-DDMFS-4x3-86fc27c741dd410aa365f96490c54060.jpg"}
          width="100%"
          style={{
            maxHeight:'200px',
            objectFit:"cover"
          }}
        />
       
      </CardHeader>
      <CardBody className="py-2 flex flex-col">
       <div className="flex-1">
        <h4 className="font-bold text-large">{product.name}</h4>
          <p className="font-normal mt-3">{product.description?.toLocaleLowerCase()}</p>

          <div className="flex mt-3 mb-3 w-full">
            <h2 className="font-bold text-large w-full text-right">{formatToBRL(product.price)}</h2>
          </div>
       </div>
        <Button color="primary" style={{marginTop:'16px'}} onClick={()=>onClickItem?onClickItem(product):null}>
          Adicionar
        </Button>
      </CardBody>
    </Card>
  );
}

 