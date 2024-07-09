import { InputIncrease } from "@/components/InputIncrease";
import { Button, Image, ScrollShadow } from "@nextui-org/react";

import { ICart } from "../page";
import { formatToBRL } from "@/utils/formatCurrency";




interface ISummary {
  onIncreaseItem?:(product_id:string)=>void
  onDecreaseItem?:(product_id:string)=>void
  onRemoveItem?:(product_id:string)=>void
  onFinish?:()=>void
  cart:ICart[]
}
export function Summary({cart=[],onFinish,onDecreaseItem,onIncreaseItem,onRemoveItem}:ISummary) {
  const total = cart.reduce((acc,cur)=>acc+ (cur.amount *cur.price),0)

  return (
    
     <div className="flex h-full min-w-80 flex-col">
            <h2 className="text-2xl font-semibold mb-4">Resumo do Pedido</h2>
    
        <ScrollShadow hideScrollBar>
          <div className="shadow-lg w-full flex-1">
              
              {cart.map(item=>(
                <div className="mb-4" key={item.id}>
                  <div className="flex justify-between items-center py-2 ">
                    <div className="flex">
                      <Image
                        src={!!item.image.length?item.image:"https://www.allrecipes.com/thmb/3x-XkV8T36df_M4tkoDbaD-WmJs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/49404-juiciest-hamburgers-ever-DDMFS-4x3-86fc27c741dd410aa365f96490c54060.jpg"}
                        className="rounded-md w-14 object-cover mr-4"
                        alt={`Produto ${item.name}`}
                      />
                      {/* <img 
                        src={item.image?item.image:"https://www.allrecipes.com/thmb/3x-XkV8T36df_M4tkoDbaD-WmJs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/49404-juiciest-hamburgers-ever-DDMFS-4x3-86fc27c741dd410aa365f96490c54060.jpg"}
                        className="rounded-md w-14 object-cover mr-4"
                      /> */}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        
                        <p className="text-xs font-light">{formatToBRL(item.price)}</p>
                        
                      </div>
                    </div>
                  
                  </div>
                  <div className="flex justify-between">
                    <InputIncrease amount={item.amount} onDecrease={()=>onDecreaseItem?onDecreaseItem(item.id):null} onIncrease={()=>onIncreaseItem?onIncreaseItem(item.id):null}/>
                    <p className="text-lg font-semibold">{item.subTotal}</p>
                  </div>
                </div>

              ))}
        

              
              <div className="flex justify-between items-center py-2   mt-4">
                <h3 className="text-xl font-semibold">Total</h3>
                <p className="text-xl font-semibold">{formatToBRL(total)}</p>
              </div>

              
          </div>
        </ScrollShadow>
        <Button color="primary" onClick={onFinish} isDisabled={!cart.length}>
          Gerar Pix
        </Button>
        <Button color="danger" className="mt-4">
          Cancelar pedido
        </Button>


      </div>
    
  );
}

