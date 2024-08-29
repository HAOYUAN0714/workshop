import { optionProps } from '@/api/base/request';

interface useCouponInterface extends optionProps {
    data: {
        code: string
    }
}

export type {
    useCouponInterface
}
