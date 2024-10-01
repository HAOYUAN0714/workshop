import request, { optionProps } from '@/api/base/request'
import {
    getOrderListInterface,
    updateOrderInterface,
    deletOrderInterface
} from '@/interface/admin/orders'

/**
* 取得全部或指定頁面訂單
* @param page | string
*/
export const getOrderList = (options: getOrderListInterface) => request('admin/orders', 'GET', options)

/**
* 更新指定訂單
* @path id | string
* @body data | object
* @create_at EpochTimeStamp | DOMHighResTimeStamp, // 訂單建立時間
* @is_paid Boolean, // 是否已付款
* @message string, // 訂單留言
* @prodcuts { // 此 products 與 products.ts 的 product 不同，這裡是指訂單中的商品
    [id: string]: {
        id: string, // 當前訂單商品 ID , 與 key 相同
        product_id: string, // 商品本身 ID
        qty: string // 購買數量
    }
}
* @user {
    address: string, // 地址
    email: string, // 電子郵件
    name: string, // 姓名
    tel: string // 電話
}
* @num number, // 訂單編號
*/
export const updateOrder = (options: updateOrderInterface) => request('admin/order', 'PUT', options)

/**
* 刪除指定訂單
* @path id | string
*/
export const deleteOrder = (options: deletOrderInterface) => request('admin/order', 'DELETE', options)

/**
* 刪除所有訂單
*/
export const deleteAllOrders = (options: optionProps) => request('admin/orders/all', 'DELETE', options)
