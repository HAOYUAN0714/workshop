import request from '../base/request';
import { optionProps } from '../base/request';

/**
* 取得指定頁面或所有文章
* @param page | string
*/ 
export const getArticleList = (options: optionProps) => request('admin/articles', 'GET', options);

/**
* 取得指定文章
* @path id | string
*/ 
export const getArticle = (options: optionProps) => request('admin/article', 'GET', options);

/**
* 編輯指定文章
* @path id | string
*/ 
export const updateArticle = (options: optionProps) => request('admin/article', 'PUT', options);

/**
* 刪除指定文章
* @path id | string
*/ 
export const deleteArticle = (options: optionProps) => request('admin/article', 'DELETE', options);

/**
* 建立文章
* @path id | string
*/ 
export const createArticle = (options: optionProps) => request('admin/article', 'POST', options);

