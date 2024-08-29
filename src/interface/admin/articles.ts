import { optionProps } from '@/api/base/request';

interface getArticleListInterface extends optionProps {
    params: {
        page: string
    }
}

interface getArticleInterface extends optionProps {
    path: string
}

interface createArticleInterface extends optionProps {
    params: {
        data: {
            title: string,
            description: string,
            image: string,
            tag: string[],
            create_at: EpochTimeStamp | DOMHighResTimeStamp,
            author: string,
            isPublic: Boolean,
            content: string
        }
    },
}

interface updateArticleInterface extends createArticleInterface {
    path: string
}

interface deleteArticleInterface extends optionProps {
    path: string
}

export type {
    getArticleListInterface,
    getArticleInterface,
    createArticleInterface,
    updateArticleInterface,
    deleteArticleInterface
}