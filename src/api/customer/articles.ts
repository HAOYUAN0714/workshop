import request from '@/api/base/request'
import {
    getArticleListInterface,
    getArticleInterface
} from '@/interface/customer/articles'

/**
* 取得指定頁面或所有文章
* @param page | string
*/
export const getArticleList = (options: getArticleListInterface) => request('articles', 'GET', options)

/**
* 取得指定文章
* @path id | string
*/
export const getArticle = (options: getArticleInterface) => request('article', 'GET', options)
