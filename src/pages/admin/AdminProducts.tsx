import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PageSet from "@/components/common/pageSet";
import { addLoading, removeLoading } from '@/redux/common/loadingSlice';
import ProductModal from "@/components/admin/modal/productModal";
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
// import AlertDestructive from '@/components/common/alertDestructive/index'
import { getProductList, updateProduct } from "@/api/admin/products"
import productInterface from "@/interface/products"
import { addAlert, removeAlert } from "@/redux/common/alertSlice";

export default function AdminProducts() {
    const dispatch = useDispatch();

    const [productList, setProductList] = useState([]);

    const [pagination, setPagination] = useState({
        category: null,
        current_page: 1,
        has_next: false,
        has_pre: false,
        total_pages: 1,
        pageArray: [1],
    });

    const [productFilter, setProductFilter] = useState({ page: '1', category: '' });
    
    const [editProductInfo, setEditProductInfo] = useState({});

    const [modalType, setModalType] = useState('');

    // 更新商品列表
    const updateProductList = async () => {
        const loadingKey = new Date().getTime().toString();
        dispatch(addLoading(loadingKey));

        const productRes = await getProductList({ params: productFilter});

        if (productRes.success) {
            setProductList(productRes.products);
            const pageArray = Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
            setPagination({ ...productRes.pagination, pageArray });
        }

        dispatch(removeLoading(loadingKey));
    };

    // 刪除/啟用/關閉 個別商品
    const switchProductEnable = async (productInfo: productInterface) => {
        const loadingKey = new Date().getTime().toString();
        dispatch(addLoading(loadingKey));

        const { id: prodcutId = '', ...newProductInfo } = productInfo;

        // 商邊開關
        newProductInfo.is_enabled =  Number(!newProductInfo.is_enabled); 
        
        const updateRes = await updateProduct({ params: { data: newProductInfo }, path: prodcutId });
        // 更新成功後重新取得商品列表
        updateRes?.success && await updateProductList();

        dispatch(removeLoading(loadingKey));

        alertHandler(updateRes.success ? 'success' : 'error', updateRes.message);
    };

    // 顯示 alert
    const alertHandler = (alertType: string, message: string) => {
        const id = new Date().getTime().toString()
        dispatch(addAlert({ id, alertType, message }));
        setTimeout(() => dispatch(removeAlert(id)), 3000); // 顯示３秒後消失
    }

    // 切換分頁
    const handlePageChange = (page: number) => {
        setProductFilter({ ...productFilter, page: page.toString() });
    };

    // 如果 篩選資料 有變動，則重新取得商品列表
    useEffect(() => {
        updateProductList();
    }, [productFilter])

    // 切換 modal 流程
    const modalTriggerHandler = (type: string, productInfo?: productInterface ) => {
        setEditProductInfo(type === 'edit' || type === 'delete' ? {...productInfo} : {});
        setModalType(type);
    }

    return (
        <div id="admin-products" className="relative flex flex-col px-4 h-full">
            <ProductModal
                modalTite={'建立新商品'}
                modalType={modalType}
                modalTriggerHandler={() => modalTriggerHandler('')}
                createdProductInfo={editProductInfo}
                updateProductList={updateProductList}
                alertHandler={alertHandler}
            />
            <h2 className="flex flex-none items-center border-b-2 border-b-border  h-16 text-2xl">
                產品列表
            </h2>
            <div className="flex flex-1 flex-col">
                <div className="flex flex-none h-14 justify-end items-center">
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
                                            onCheckedChange={() => switchProductEnable(productItem)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button type="button" onClick={() => modalTriggerHandler('edit', productItem)}>
                                            編輯
                                        </Button>
                                        <Button type="button" variant="destructive" onClick={() => modalTriggerHandler('delete', productItem)}>
                                            刪除
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* 分頁 */}
                <div className="flex items-center border-t-2 h-16">
                    <PageSet
                        currentPage={pagination.current_page}
                        totalPages={pagination.total_pages}
                        handlePageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}
