import { optionProps } from '@/api/base/request'

interface getCouponListInterface extends optionProps {
    params: {
        page: string
    }
}

interface createCouponInterface extends optionProps {
    params: {
        data: {
            title: string,
            is_enabled: number,
            percent: number,
            due_date: EpochTimeStamp | DOMHighResTimeStamp,
            code: string
        }
    }
}

interface updateCouponInterface extends optionProps {
    params: {
        data: {
            title: string,
            is_enabled: number,
            percent: number,
            due_date: EpochTimeStamp | DOMHighResTimeStamp,
        }
    },
    path: string
}

interface deleteCouponInterface extends optionProps {
    path: string
}

export type {
    getCouponListInterface,
    createCouponInterface,
    updateCouponInterface,
    deleteCouponInterface
}
