import request from '@/api/base/request';
import {
    getArticleListInterface,
    getArticleInterface,
    createArticleInterface,
    updateArticleInterface,
    deleteArticleInterface
} from '@/interface/admin/articles';

/**
* 取得指定頁面或所有文章
* @param page | string
*/ 
export const getArticleList = (options: getArticleListInterface) => request('admin/articles', 'GET', options);

/**
* 取得指定文章
* @path id | string
*/ 
export const getArticle = (options: getArticleInterface) => request('admin/article', 'GET', options);

/**
* 建立文章
* @body data | object
* @title string
* @description string
* @image string
* @tag []string
* @create_at EpochTimeStamp | DOMHighResTimeStamp
* @author string
* @isPublic Boolean
* @content string
*/ 
export const createArticle = (options: createArticleInterface) => request('admin/article', 'POST', options);

/**
* 編輯指定文章
* @path id | string
* @body data | object
* @title string
* @description string
* @image string
* @tag []string
* @create_at EpochTimeStamp | DOMHighResTimeStamp
* @author string
* @isPublic Boolean
* @content string
*/ 
export const updateArticle = (options: updateArticleInterface) => request('admin/article', 'PUT', options);

/**
* 刪除指定文章
* @path id | string
*/ 
export const deleteArticle = (options: deleteArticleInterface) => request('admin/article', 'DELETE', options);
