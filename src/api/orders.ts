import request from './base/request';
import { optionProps } from './base/request';

// 取得全部產品
export const getAllProduct = () => request('admin/products/all', 'GET');

// 根據產品類別與分頁取得商品列表
export const getProductList = (options: optionProps) => request(`admin/products`, 'GET', options);

// 上傳商品資訊
export const postProduct = (options: optionProps) => request(`admin/product`, 'POST', options);

// 更新指定商品
export const putProduct = (options: optionProps) => request(`admin/product`, 'PUT', options);

// 刪除指定商品
export const deleteProduct = (options: optionProps) => request(`admin/product`, 'DELETE', options);