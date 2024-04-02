import request from '../base/request';
import { optionProps } from '../base/request';

// 取得全部產品
export const getAllProduct = () => request('products/all', 'GET');

/**
 * 跟據產品類別與分頁取得商品列表
 * @param page | string
 * @param category | string
 */
export const getProductList = (options: optionProps) => request('products', 'GET', options);

/**
 * 取得指定產品詳細資訊
 * @path id | string
 */
export const getProductDetail = (options: optionProps) => request('product', 'GET', options);


