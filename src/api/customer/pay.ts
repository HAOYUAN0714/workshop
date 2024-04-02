import request from '../base/request';
import { optionProps } from '../base/request';

/**
* 付款
* @path order_id | string
*/ 
export const payOrder = (options: optionProps) => request('pay', 'POST', options);
