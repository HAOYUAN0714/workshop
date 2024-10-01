import request from '@/api/base/request'
import { useCouponInterface } from '@/interface/customer/coupons'

/**
* 使用優惠券
* @body data | object
* @code string, 優惠碼
*/
export const useCoupon = (options: useCouponInterface) => request('coupon', 'POST', options)
