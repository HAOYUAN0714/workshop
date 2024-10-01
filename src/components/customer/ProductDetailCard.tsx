import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Orders as OrderInterface, OrderProductInterface } from '@/interface/base/orders'
import { OrderDetailSkeleton, BetweenSkeleton } from '@/components/common/skeleton'
interface ProductDetailCardProps {
    orderInfo: OrderInterface;
    isLoading: boolean;
}

export default function ProductDetailCard ({
    orderInfo,
    isLoading
}: ProductDetailCardProps) {
    const [productList, setProdcutList] = useState<OrderProductInterface[]>([])

    useEffect(() => {
        const productOrderList = Object.values(orderInfo.products)
        setProdcutList(productOrderList)
    }, [orderInfo])

    return <Card className="w-full h-full rounded-md">
        <CardHeader className="flex items-center">
            <CardTitle>訂單細節</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
            { !isLoading
                ? productList.map((productItem) => {
                    return <div className="flex mb-4" key={productItem.id}>
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
                : Array.from({ length: 2 }).map((_, index) => {
                    return <OrderDetailSkeleton
                        className={'flex flex-none h-16 mb-4'}
                        key={index}
                    />
                })
            }
        </CardContent>
        <CardFooter>
            <div className="flex w-full pt-2 border-t-2">
                { !isLoading
                    ? <><div className="text-xl font-bold">
                                總計
                    </div>
                    <div className="text-xl font-bold ml-auto">
                                NT$ {orderInfo?.total || ''}
                    </div></>
                    : <BetweenSkeleton className="py-1" leftClass="w-12 h-5" rightClass="w-20 h-5" />
                }
            </div>
        </CardFooter>
    </Card>
}
