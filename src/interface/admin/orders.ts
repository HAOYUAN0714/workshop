import { optionProps } from '@/api/base/request'

interface getOrderListInterface extends optionProps {
    params: {
        page: string
    }
}

interface updateOrderInterface extends optionProps {
    params: {
        data: {
            create_at: EpochTimeStamp | DOMHighResTimeStamp,
            is_paid: boolean,
            message: string,
            num: number,
            products: {
                [id: string]: {
                    id: string,
                    product_id: string,
                    qty: string
                }
            },
            user: {
                address: string,
                email: string,
                name: string,
                tel: string
            }
        }
    },
    path: string
}

interface deletOrderInterface extends optionProps {
    path: string
}

export type {
    getOrderListInterface,
    updateOrderInterface,
    deletOrderInterface
}
