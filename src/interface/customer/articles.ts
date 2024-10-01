import { optionProps } from '@/api/base/request'

interface getArticleListInterface extends optionProps {
    page: string
}

interface getArticleInterface extends optionProps {
    path: string
}

export type {
    getArticleListInterface,
    getArticleInterface
}
