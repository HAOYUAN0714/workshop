import Coupon from './coupons';

export interface Cart {
    id: string,
    coupon?: Coupon,
    product: {
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
    },
    product_id: string,
    qty: number,
    total: number,
    final_total: number,
}

export default interface CartInfo {
    carts: Cart[],
    total: number,
    final_total: number,
}