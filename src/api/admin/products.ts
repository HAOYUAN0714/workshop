import request from '../base/request';
import { optionProps } from '../base/request';

// 取得全部產品
export const getAllProduct = () => request('admin/products/all', 'GET');

/**
 * 據產品類別與分頁取得商品列表
 * @param page | string
 * @param category | string
 */
export const getProductList = (options: optionProps) => request('admin/products', 'GET', options);

/**
 * 建立商品資訊
 * @body data | object
 * @title string,
 * @category string,
 * @origin_price number, // 原價
 * @price number, // 現價
 * @description: string,
 * @content string,
 * @is_enabled number, // 是否啟用 , 1: 啟用 , 0: 未啟用
 * @unit string, // 商品單位
 * @imageUrl string, // 主要圖片網址
 * @imagesUrl [網址, 網址2, ....], // 其他圖片網址
*/
export const createProduct = (options: optionProps) => request('admin/product', 'POST', options);

/**
* 更新指定商品
* @path id | string
* @body data | object 商品資訊
*/ 
export const updateProduct = (options: optionProps) => request('admin/product', 'PUT', options);

/**
* 刪除指定商品
* @path id | string
*/ 
export const deleteProduct = (options: optionProps) => request('admin/product', 'DELETE', options);

/**
*  上傳圖片
*  表單上傳 , 僅限 jpg jpeg png 圖片 , 且檔案大小不得超過 3MB
    <form action="/api/{圖片名稱}/admin/upload" enctype="multipart/form-data"  method="post">
        <input type="file" name="file-to-upload">
        <input type="submit" value="Upload">
    </form> 
*/ 
export const uploadImg = (options: optionProps) => request('admin/upload', 'POST', { ...options, isFormData: true });
