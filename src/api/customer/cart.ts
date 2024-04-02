import request from '../base/request';
import { optionProps } from '../base/request';

/**
* 建立購物車
* @body | object
* @product_id | string
* @qty | number
*/ 
export const createCart = (options: optionProps) => request('cart', 'POST', options);

/**
* 獲取購物車資訊
*/ 
export const getCart = (options: optionProps) => request('cart', 'GET', options);

/**
* 更新指定購物車產品
* @path id | string
* @body | object
* @product_id | string
* @qty | number
*/ 
export const updateCartProduct = (options: optionProps) => request('cart', 'PUT', options);

/**
* 刪除指定購物車產品
* @path id | string
*/ 
export const deleteCartProduct = (options: optionProps) => request('cart', 'DELETE', options);

/**
* 刪除整份購物車
*/ 
export const deleteCarts = (options: optionProps) => request('carts', 'DELETE', options);