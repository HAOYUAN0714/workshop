export default interface Product {
    title: string,
    category: string,
    content: string,
    description: string,
    id?: string,
    is_enabled: number, // 是否啟用 , 1: 啟用 , 0: 未啟用
    origin_price: number, // 原價
    num?: number,
    price: number, // 現價
    unit: string, // 商品單位
    imageUrl: string, // 主要圖片網址
    imagesUrl?: string[], // 其他圖片網址
}
