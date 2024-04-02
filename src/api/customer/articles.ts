import request from '../base/request';
import { optionProps } from '../base/request';

/**
* 取得指定頁面或所有文章
* @param page | string
*/ 
export const getArticleList = (options: optionProps) => request('articles', 'GET', options);

/**
* 取得指定文章
* @path id | string
*/ 
export const getArticle = (options: optionProps) => request('article', 'GET', options);
