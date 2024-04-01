export interface Products {
    category: string,
    content: string,
    description: string,
    id: string,
    is_enabled: number, // 是否啟用 , 1: 啟用 , 0: 未啟用
    num: number,
    origin_price: number, // 原價
    price: number, // 現價
    title: string,
    unit: string, // 商品單位
    imageUrl: string, // 主要圖片網址
    imagesUrl: [], // 其他圖片網址
}
