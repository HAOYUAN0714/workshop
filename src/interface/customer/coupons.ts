import { optionProps } from '@/api/base/request'

interface useCouponInterface extends optionProps {
    params: {
        data: {
            code: string
        }
    }
}

export type {
    useCouponInterface
}
