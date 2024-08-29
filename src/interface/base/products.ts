interface CustomerProductInterface {
    title: string,
    category: string,
    content: string,
    description: string,
    id: string, // 商品 ID , 客戶端商品皆有完整資料
    is_enabled: number, // 是否啟用 , 1: 啟用 , 0: 未啟用
    origin_price: number, // 原價
    num: number,
    price: number, // 現價
    unit: string, // 商品單位
    imageUrl: string, // 主要圖片網址
    imagesUrl?: string[], // 其他圖片網址
}

export const createProduct = (): CustomerProductInterface => {
    return {
        title: '',
        category: '',
        content: '',
        description: '',
        id: '',
        is_enabled: 0,
        origin_price: 0,
        num: 0,
        price: 0,
        unit: '',
        imageUrl: '',
        imagesUrl: []
    };
};

interface Product {
    title: string,
    category: string,
    content: string,
    description: string,
    id?: string, // 商品 ID , 非已存在的商品不需帶入
    is_enabled: number, // 是否啟用 , 1: 啟用 , 0: 未啟用
    origin_price: number, // 原價
    num?: number,
    price: number, // 現價
    unit: string, // 商品單位
    imageUrl: string, // 主要圖片網址
    imagesUrl?: string[], // 其他圖片網址
}

export type {
    Product,
    CustomerProductInterface
}
