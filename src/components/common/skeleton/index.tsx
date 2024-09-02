import { Skeleton } from "@/components/ui/skeleton"

const LineSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex flex-none items-center w-full h-full space-x-4 ${className}`}>
      <Skeleton className="h-full w-full" />
    </div>
  )
}

const profileSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
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

export {
    LineSkeleton,
    profileSkeleton,
    CardSkeleton,
    CartSkeleton
}
