import request from '@/api/base/request';
import { payOrderInterface } from '@/interface/customer/pay';

/**
* 付款
* @path order_id | string
*/ 
export const payOrder = (options: payOrderInterface) => request('pay', 'POST', options);
