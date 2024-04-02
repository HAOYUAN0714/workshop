import request from '../base/request';
import { optionProps } from '../base/request';

/**
* 取得所有優惠券
* @param page | string
*/ 
export const getCouponList = (options: optionProps) => request('admin/coupons', 'GET', options);

/**
* 建立優惠券
* @body data | object
* @title string, 優惠券名稱
* @is_enabled number, 是否啟用 , 1: 啟用 , 0: 未啟用
* @percent number, 折扣百分比
* @due_date EpochTimeStamp | DOMHighResTimeStamp, 訂單建立時間
* @code string, 優惠碼
*/ 
export const createCoupon = (options: optionProps) => request('admin/coupon', 'POST', options);

/**
* 變更優惠券內容
* @path id | string
* @body data | object
* @title string, 優惠券名稱
* @is_enabled number, 是否啟用 , 1: 啟用 , 0: 未啟用
* @percent number, 折扣百分比
* @due_date EpochTimeStamp | DOMHighResTimeStamp, 訂單建立時間
*/ 
export const updateCoupon = (options: optionProps) => request('admin/coupon', 'PUT', options);

/**
* 刪除指定優惠券
* @path id | string
*/ 
export const deleteAllCoupon = (options: optionProps) => request('admin/coupon', 'DELETE', options);