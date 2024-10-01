import { Coupon } from './coupons'

interface CartProduct {
    category: string,
    content: string,
    description: string,
    id: string,
    imageUrl: string,
    imagesUrl: string[],
    is_enabled: number,
    num: number,
    origin_price: number,
    price: number,
    title:string,
    unit: string,
}

interface Cart {
    id: string,
    coupon?: Coupon,
    product: CartProduct,
    product_id: string,
    qty: number,
    total: number,
    final_total: number,
}

interface CartInfo {
    carts: Cart[],
    total: number,
    final_total: number,
}

export type {
    Cart,
    CartProduct,
    CartInfo
}
