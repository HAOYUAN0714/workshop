import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table"
import { useDispatch, useSelector } from 'react-redux'
import { addLoading, removeLoading } from '@/redux/common/loadingSlice';
import ProductModal from "@/components/admin/modal/productModal";
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import AlertDestructive from '@/components/common/alert/index'
import { getProductList, updateProduct as fetchUpdateProduct } from "@/api/admin/products"
import productInterface from "@/interface/products"

export default function AdminProducts() {
    const dispatch = useDispatch();

    const [alertInfo, setAlertInfo] = useState({
        alertType: '',
        message: '',
    });

    const [productList, setProductList] = useState([])

    const [pagination, setPagination] = useState({});

    const [productFilter, setProductFilter] = useState({ page: '1', category: 'test' });
    
    const [editProductInfo, setEditProductInfo] = useState({});

    const [modalType, setModalType] = useState('');

    const updateProductList = async () => {
        const productRes = await getProductList({ returnType: 'async', params: productFilter});
        console.log('productRes', productRes);
        if (productRes.success) {
            setProductList(productRes.products);
            setPagination(productRes.pagination);
        }
    };

    const updateProduct = async (productInfo: productInterface, updateType = 'edit') => {
        const loadingKey = new Date().getTime().toString();
        dispatch(addLoading(loadingKey));

        const {} = productInfo;
        const newProductInfo = {
            ...productInfo,
            is_enabled: updateType === 'switch'
                ? !productInfo.is_enabled
                : productInfo.is_enabled,
        }

        const updateRes = await fetchUpdateProduct({ returnType: 'async', params: newProductInfo, path: productInfo.id });
        // 更新成功後重新取得商品列表
        updateRes?.sucess && await updateProductList()

        dispatch(removeLoading(loadingKey));
    };

    useEffect(() => {
        updateProductList();
    }, [productFilter])

    const modalTriggerHandler = (type: string) => {
        modalType
            ? setModalType('')
            : setModalType(type);
    }

    return (
        <div id="admin-products" className="flex flex-col px-4 h-full">
            <AlertDestructive alertType={alertInfo.alertType} message={alertInfo.message}/>
            <ProductModal
                modalTite={'建立新商品'}
                modalType={modalType}
                modalTriggerHandler={() => modalTriggerHandler('')}
            />
            <h2 className="flex flex-none items-center border-b-2 border-b-border  h-16 text-2xl">
                產品列表
            </h2>
            <div className="flex flex-1 flex-col">
                <div className="flex flex-none h-16 justify-end items-center">
                    <button
                        className="ml-auto py-2 px-4 rounded bg-confirm hover:brightness-110 text-confirm-foreground font-bold"
                        onClick={() => modalTriggerHandler('create')}
                    >
                        建立新商品
                    </button>
                </div>
                {/* 商品列表 */}
                <div className="flex flex-1">
                    <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">分類</TableHead>
                        <TableHead>名稱</TableHead>
                        <TableHead>售價</TableHead>
                        <TableHead>啟用狀態</TableHead>
                        <TableHead>操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productList.map((productItem: productInterface) => (
                        <TableRow key={productItem.id}>
                            <TableCell className="font-medium">{productItem.category}</TableCell>
                            <TableCell>{productItem.title}</TableCell>
                            <TableCell>{productItem.price}</TableCell>
                            <TableCell>
                                <Switch
                                    id="themeMode"
                                    checked={!!productItem.is_enabled}
                                    onCheckedChange={() => updateProduct(productItem, 'switch')}
                                />
                            </TableCell>
                            <TableCell>
                                <Button type="button">
                                    編輯
                                </Button>
                                <Button type="button" variant="destructive">
                                    刪除
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                        </TableRow>
                    </TableFooter>
                    </Table>
                </div>
            </div>
        </div>
    );
}
