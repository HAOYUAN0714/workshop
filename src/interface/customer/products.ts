import { optionProps } from '@/api/base/request'

interface getProductListInterface extends optionProps {
    params: {
        page: string,
        category: string
    }
}

interface getProductDetailInterface extends optionProps {
path: string
}

export type {
    getProductListInterface,
    getProductDetailInterface
}
