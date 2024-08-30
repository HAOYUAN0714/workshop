import { CustomerProductInterface } from './products'
interface OrderProductInterface {
    product: CustomerProductInterface,
    final_total: number,
    id: string,
    product_id: string,
    qty: number,
    total: number
}

interface Orders {
    create_at: EpochTimeStamp | DOMHighResTimeStamp, // 訂單建立時間
    id: string, // 訂單 ID
    is_paid: Boolean, // 是否已付款
    message?: string, // 訂單留言
    total: number, // 訂單總金額
    products: {
        [id: string]: OrderProductInterface
    },
    user: {
        address: string, // 地址
        email: string, // 電子郵件
        name: string, // 姓名
        tel: string // 電話
    },
}

type OrderListData = OrderProductInterface & CustomerProductInterface;

export const createOrders = (): Orders => { // 建立訂單預設值
    return {
        create_at: 0,
        id: '',
        is_paid: false,
        message: '',
        products: {},
        total: 0,
        user: {
            address: '',
            email: '',
            name: '',
            tel: ''
        }
    };
};

export type {
    Orders,
    OrderProductInterface,
    OrderListData
}
