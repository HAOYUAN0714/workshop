import request from '../base/request';
import { optionProps } from '../base/request';

/**
* 結帳
* @body | object
* @user | object {
    "name"| string,
    "email"| email,
    "tel"| string,
    "address"| string
},
* @message | string
*/ 
export const postOrders = (options: optionProps) => request('order', 'POST', options);

/**
* 取得全部或指定頁面訂單
* @param page | string
*/ 
export const getOrderList = (options: optionProps) => request('orders', 'GET', options);

/**
* 取得指定訂單資訊
* @path order_id | string
*/ 
export const getOrderDetail = (options: optionProps) => request('order', 'GET', options);