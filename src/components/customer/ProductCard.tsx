import { NavLink } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle
} from '@/components/ui/card'
import { Product as productInterface } from '@/interface/base/products'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

interface ProductCardProps {
    productInfo: productInterface,
    className?: string,
    isLoading: boolean,
    updateCartList: () => void,
}

export default function ProductCard ({
    productInfo,
    className,
    isLoading,
    updateCartList
}: ProductCardProps) {
    return <Card className={`w-[300px] h-[150px] rounded-md shadow-md ${className}`}>
        <CardContent className="relative flex flex-none w-full h-full p-0">
            <NavLink
                className="flex flex-none justify-between w-full h-full"
                to={`/product/${productInfo.id}`}
            >
                <div className="flex-1 overflow-hidden flex-col py-2 px-3">
                    <CardTitle className="flex-none w-full truncate whitespace-nowrap text-lg">{productInfo.title}</CardTitle>
                    <div className="text-base">NT$ {productInfo.price}</div>
                    <CardDescription>{productInfo.description}</CardDescription>
                </div>
                {
                    productInfo.imageUrl && <div className="flex-1">
                        <img
                            className="w-full h-full rounded-l-none rounded-md object-cover"
                            src={productInfo.imageUrl}
                        />
                    </div>
                }
            </NavLink>
            <div
                className={`
                    absolute bottom-2 right-4 
                    flex justify-center items-center 
                    rounded-full w-10 h-10 shadow-md
                    bg-background text-success text-2xl
                    
                    ${isLoading
        ? 'cursor-not-allowed'
        : 'hover:bg-success hover:text-success-foreground cursor-pointer'
}
                `}
                onClick={() => !isLoading && updateCartList()}
            >
                { isLoading
                    ? <div className="animate-spin h-5 w-5 border-2 border-success border-b-transparent rounded-full" />
                    : <FontAwesomeIcon className="text-base" icon={faCartShopping}/>
                }

            </div>
        </CardContent>
    </Card>
}
