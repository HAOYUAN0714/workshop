import request from '../base/request';
import { optionProps } from '../base/request';

/**
* 使用優惠券
* @body data | object
* @code string, 優惠碼
*/ 
export const createCoupon = (options: optionProps) => request('coupon', 'POST', options);

