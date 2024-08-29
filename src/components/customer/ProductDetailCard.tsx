import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Orders as OrderInterface, OrderProductInterface } from "@/interface/base/orders"

interface ProductDetailCardProps {
    orderInfo: OrderInterface
}

export default function ProductDetailCard({
    orderInfo
}: ProductDetailCardProps) {
    const [productList, setProdcutList] = useState<OrderProductInterface[]>([]);

    useEffect(() => {
        const productOrderList = Object.values(orderInfo.products);
        setProdcutList(productOrderList);
    
    }, [orderInfo])

    return <Card className="w-full h-full rounded-md">
        <CardHeader className="flex items-center">
            <CardTitle>訂單細節</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
            {
                productList.map((productItem) => {
                    return  <div className="flex justify-between mb-4">
                        {
                            productItem.product.imageUrl && <div className="flex-none w-16 h-16">
                                <img
                                    src={productItem.product.imageUrl}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                        }
                        <div className="flex flex-col flex-1 justify-between pl-2">
                            <div className="flex justify-between">
                                <div className="text-lg font-bold">{productItem.product.title}</div>
                                <div className="text-lg font-bold">x{productItem.qty}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="text-sm">NT$ {productItem.product.price}</div>
                                <div className="text-base">NT$ {productItem.final_total}</div>
                            </div>
                        </div>
                    </div>
                })
            }

        </CardContent>
        <CardFooter>
            <div className="flex w-full pt-2 border-t-2">
                <div className="text-xl font-bold">
                    總計
                </div>
                <div className="text-xl font-bold ml-auto">
                    NT$ {orderInfo?.total || ''}
                </div>
            </div>
        </CardFooter>
    </Card>
    
}