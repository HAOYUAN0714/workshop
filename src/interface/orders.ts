export default interface Orders {
    create_at: EpochTimeStamp | DOMHighResTimeStamp, // 訂單建立時間
    id: string, // 訂單 ID
    is_paid: Boolean, // 是否已付款
    message: string, // 訂單留言
    num: number, // 訂單編號
    prodcuts: { // 此 products 與 products.ts 的 product 不同，這裡是指訂單中的商品
        [id: string]: {
            id: string, // 當前訂單商品 ID , 與 key 相同
            product_id: string, // 商品本身 ID
            qty: string // 購買數量
        }
    },
    user?: {
        address: string, // 地址
        email: string, // 電子郵件
        name: string, // 姓名
        tel: string // 電話
    },
}
