import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Cart as CartInterface } from '@/interface/base/carts'
import { Cross1Icon } from '@radix-ui/react-icons'

interface CartCardProps {
    cartInfo: CartInterface,
    className?: string,
    isLoading: boolean,
    handleSelect: (cartInfo: CartInterface, qty: number) => void,
    handleDelete: (id: string) => void
}

export default function CartCard ({
    cartInfo,
    className,
    isLoading,
    handleSelect,
    handleDelete
}: CartCardProps) {
    const [selectList, setSelectList] = useState(Array.from({ length: 10 }, (v, i) => i + 1))

    const updateSelect = (selectVal: string) => {
        handleSelect(cartInfo, Number(selectVal))
    }

    useEffect(() => {
        // 設定選擇數量的選項 , 如果超過 10 可選最大數量 + 3
        cartInfo.qty > 10
            ? setSelectList(Array.from({ length: cartInfo.qty + 3 }, (_, i) => i + 1))
            : setSelectList(Array.from({ length: 10 }, (_, i) => i + 1))
    }, [cartInfo])

    return <Card className={`w-full h-[150px] rounded-md ${className}`}>
        <CardContent className="relative flex w-full h-full p-0">
            {
                isLoading && <div
                    className="
                        z-30 absolute top-0 right-0
                        flex justify-center items-center
                        w-full h-full bg-gray-400 bg-opacity-60
                    "
                    role="status"
                >
                    <div className="animate-spin h-5 w-5 border-2 border-white border-b-transparent rounded-full" />
                </div>
            }
            {
                cartInfo.product.imageUrl && <div className="flex-none w-[170px] h-full">
                    <img
                        src={cartInfo.product.imageUrl}
                        className='w-full h-full rounded-r-none rounded-md object-cover'
                    />
                </div>
            }
            <div className="relative flex flex-1 flex-col h-full py-2 px-3 overflow-hidden">
                <Cross1Icon
                    className="absolute top-2 right-2 cursor-pointer hover:scale-110 transition-all duration-300"
                    onClick={() => handleDelete(cartInfo.id)}
                />
                <CardTitle className="flex-none w-full truncate whitespace-nowrap text-base">{cartInfo.product.title}</CardTitle>
                <CardDescription className="flex-1">{cartInfo.product.description}</CardDescription>
                <div className="flex flex-none items-center mt-auto">
                    <Select
                        onValueChange={updateSelect}
                        defaultValue={cartInfo.qty.toString()}
                    >
                        <SelectTrigger className="flex-none w-20">
                            <SelectValue placeholder="選擇數量" />
                        </SelectTrigger>
                        <SelectContent>
                            { selectList.map((num) => {
                                return (
                                    <SelectItem value={`${num}`} key={num}>{num}</SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                    <div className="ml-auto text-sm">NT${cartInfo.product.price}</div>
                </div>
            </div>
        </CardContent>
    </Card>
}
