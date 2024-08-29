import { optionProps } from '@/api/base/request';

interface postOrdersInterface extends optionProps {
    params: {
        data: {
            user: {
                name: string,
                email: string,
                tel: string,
                address: string
            },
            message?: string
        }
    },
}

interface getOrderListInterface extends optionProps {
    params: {
        page: string
    },
}

interface getOrderDetailInterface extends optionProps {
    path: string
}

export type {
    postOrdersInterface,
    getOrderListInterface,
    getOrderDetailInterface
}