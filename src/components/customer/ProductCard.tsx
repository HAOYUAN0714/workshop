import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import productInterface from "@/interface/products";

interface ProductCardProps {
    productInfo: productInterface,
    className?: string,
    updateCartList: () => void,
}

export default function ProductCard({
    productInfo,
    className,
    updateCartList,
}: ProductCardProps) {

    return <Card className={`w-[300px] h-[150px] rounded-md ${className}`}>
        <CardContent className="relative flex w-full h-full p-0">
            <div className="flex-1 overflow-hidden flex-col py-2 px-3">
                <CardTitle className="flex-none w-full truncate whitespace-nowrap">{productInfo.title}</CardTitle>
                <div className="text-base">NT${productInfo.price}</div>
                <CardDescription>{productInfo.description}</CardDescription>
            </div>
            {
                productInfo.imageUrl && <div className="flex-1">
                    <img
                        src={productInfo.imageUrl}
                        className='w-full h-full object-cover'
                    />
                </div>
            }
            <div className="
                absolute bottom-2 right-4 
                flex justify-center items-center 
                rounded-full w-10 h-10 shadow-md
                bg-background text-foreground text-xl
                hover:bg-primary hover:text-primary-foreground cursor-pointer"
                onClick={updateCartList}
            >
                +
            </div>
        </CardContent>
    </Card>
}