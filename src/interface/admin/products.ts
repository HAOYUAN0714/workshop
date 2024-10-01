import { optionProps } from '@/api/base/request'

interface getProductListInterface extends optionProps {
    params: {
        page: string,
        category: string
    }
}

interface createProductInterface extends optionProps {
    params: {
        data: {
            title: string,
            category: string,
            origin_price: number,
            price: number,
            description: string,
            content: string,
            is_enabled: number,
            unit: string,
            imageUrl: string,
            imagesUrl?: string[]
        }
    }
}

interface updateProductInterface extends createProductInterface {
    path: string
}

interface deleteProductInterface extends optionProps {
    path: string
}

export type {
    getProductListInterface,
    createProductInterface,
    updateProductInterface,
    deleteProductInterface
}
