import { optionProps } from '@/api/base/request';

interface addCartInterface extends optionProps {
    params: {
        data: {
            product_id: string,
            qty: number
        }
    }
}

interface updateCartProductInterface extends optionProps {
    params: {
        data: {
            product_id: string,
            qty: number
        }
    }
    path: string
}

interface deleteCartProductInterface extends optionProps {
    path: string
}

export type {
    addCartInterface,
    updateCartProductInterface,
    deleteCartProductInterface
}
