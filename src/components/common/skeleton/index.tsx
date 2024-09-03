import { Skeleton } from "@/components/ui/skeleton"

const LineSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex flex-none items-center w-full h-full space-x-4 ${className}`}>
      <Skeleton className="h-full w-full" />
    </div>
  )
}

const BetweenSkeleton = ({
    className = '',
    leftClass = '',
    rightClass = '' 
}: { className?: string, leftClass?: string, rightClass?: string }) => {
    return <div className={`flex w-full justify-between ${className}`}>
        <div className={`${leftClass}`}>
            <LineSkeleton />
        </div>
        <div className={`${rightClass}`}>
            <LineSkeleton />
        </div>
    </div>
};

const OrderDetailSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
        <div className="flex">
            <div className="w-16 h-16">
                <LineSkeleton />
            </div>
            <div className="flex flex-col flex-1  pl-2">
                <BetweenSkeleton className="py-2" leftClass="w-20 h-6" rightClass="w-5 h-5" />
                <BetweenSkeleton className="py-2" leftClass="w-20 h-3" rightClass="w-12 h-3" />
            </div>
        </div>
    </div>
  )
}

const CardSkeleton = ({ className = '' }: { className?: string }) => {
    return (<div className={`w-[300px] h-[150px] rounded-md shadow-md ${className}`}>
        <div className="relative flex flex-none w-full h-full p-0">
            <div className="flex-1 flex-col py-2 px-3">
                <Skeleton className="h-4 mb-2 w-full" />
                <Skeleton className="h-4 mb-2 w-full" />
                <Skeleton className="h-4 mb-2 w-full" />
            </div>
            <div className="flex-1">
                <Skeleton className="h-full w-full" />
            </div>
        </div>
    </div>)
};

const CartSkeleton = ({ className = '' }: { className?: string }) => {
    return (<div className={`w-[300px] h-[150px] rounded-md shadow-md ${className}`}>
        <div className="relative flex flex-none w-full h-full p-0">
            <div className="flex-none w-[170px]">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="flex flex-1 flex-col py-2 px-3">
                <Skeleton className="h-4 w-full mb-2 " />
                <Skeleton className="h-4 w-full mb-2 " />
                <Skeleton className="h-4 w-full mt-auto " />
            </div>
        </div>
    </div>)
};

const ProductSkeleton = ({ className = '' }: { className?: string }) => {
    return <div className={`flex ${className}`}>
        <div className="flex flex-1">
            <Skeleton className="flex-none w-full min-h-[400px]" />
        </div>
        <div className="flex flex-1 flex-col pl-12">
            <Skeleton className="flex-none w-[50%] h-6 mb-2" />
            <Skeleton className="flex-none w-[50%] h-4 mb-6" />
            <Skeleton className="flex-none w-full h-24 mb-2" />
            <div className="flex items-center h-20 mb-2">
                <Skeleton className="flex-none w-full h-12" />
            </div>
            <Skeleton className="flex-none w-full h-16 " />
        </div>
    </div>
};

export {
    LineSkeleton,
    BetweenSkeleton,
    OrderDetailSkeleton,
    CardSkeleton,
    CartSkeleton,
    ProductSkeleton
}
