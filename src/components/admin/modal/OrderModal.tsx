import { useState, useEffect } from "react"
import { useDispatch } from 'react-redux'
import { useAlert } from "@/hook/useAlert";
import ConfirmModal from "@/components/common/modal/confirmationModal";
import { getAllProduct } from "@/api/admin/products";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Orders as OrderInterface, OrderListData, createOrders } from "@/interface/base/orders"
import { CustomerProductInterface } from "@/interface/base/products"
import { addLoading, removeLoading } from '@/redux/common/loadingSlice';

interface modalProps {
    modalTite: string;
    modalDescription?: string;
    modalType?: string;
    orderInfo?: OrderInterface;
    modalTriggerHandler: () => void;
    confirmDelete: () => void;
}

interface allProductInfoInterface {
    [id: string]: CustomerProductInterface
}

export default function OrderModal({
    modalTite = '',
    modalType = '',
    orderInfo = createOrders(),
    modalTriggerHandler,
    confirmDelete
}: modalProps) {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const [orderProductList, setOrderProductList] = useState<OrderListData[]>([]);
    const [allProductInfo, setAllProductInfo] = useState<allProductInfoInterface>({});

    const getProducts = async () => {
        dispatch(addLoading('getProducts'));
        const res = await getAllProduct();

        res?.success 
            ? setAllProductInfo(res.products)
            : showAlert('error', '取得商品列表失敗');
        
        dispatch(removeLoading('getProducts'));
    };
 
    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        if (modalType === 'edit' && Object.keys(allProductInfo).length > 0) {
            const productList = Object.values(orderInfo.products).map((productInfo) => {
                const { product, qty, total, final_total } = productInfo;
                return {
                    ...allProductInfo[product.id],
                    ...orderInfo.products[product.id],
                    qty,
                    total,
                    final_total
                }
            });

            setOrderProductList(productList);
        }

    }, [allProductInfo, modalType]);

    return (
        modalType === 'delete'
            ? <ConfirmModal
                modalTite={'確認刪除訂單?'}
                modalType={modalType}
                modalTriggerHandler={modalTriggerHandler}
                confirmOption={{
                    needConfirm: true,
                    confirmTitle: '確認',
                    confirmHandler: () => confirmDelete()
                }}
                cancelOption={{
                    needCancel: true,
                    cancelTitle: '取消',
                    cancelHandler: () => modalTriggerHandler()
                }}
            />
            : <Dialog open={Boolean(modalType)} onOpenChange={modalTriggerHandler}>
            {/* onInteractOutside 避免點擊overlay 導致彈窗關閉 */}
            <DialogContent
                className="max-w-[720px] max-h-full overflow-y-auto bg-overlay"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="border-b-2 py-4">
                        { modalTite }
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col">
                    <div className="flex flex-1 flex-col p-4 mb-4 bg-card rounded-md shadow-md">
                        <h3 className="mb-4 p-4 border-b-2 font-bold">商品資料</h3>
                        <Table className="border-2 border-t-0">
                            <TableHeader className="bg-overlay">
                                <TableRow>
                                    <TableHead className="w-[100px]">商品號</TableHead>
                                    <TableHead className="w-[100px]">商品名稱</TableHead>
                                    <TableHead className="w-[60px] text-right">數量</TableHead>
                                    <TableHead className="w-[90px] text-right">單價(NT$)</TableHead>
                                    <TableHead className="w-[120px] text-right">總計(NT$)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderProductList.map((orderProductInfo) => (
                                    <TableRow key={ orderProductInfo.id }>
                                        <TableCell className="max-w-[100px] truncate">{ orderProductInfo.id }</TableCell>
                                        <TableCell className="max-w-[100px] truncate">{ orderProductInfo.title }</TableCell>
                                        <TableCell className="text-right">{ orderProductInfo.qty }</TableCell>
                                        <TableCell className="text-right">{ orderProductInfo.price }</TableCell>
                                        <TableCell className="text-right">{ orderProductInfo.final_total }</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={5} className="text-right font-bold">{ orderInfo.total }</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex flex-1 flex-col p-4 mb-4 bg-card rounded-md shadow-md">
                        <h3 className="mb-4 p-4 border-b-2 font-bold">買家資訊</h3>
                        <div className="flex flex-col px-4">
                            <div className="flex">
                                <h4 className="w-28 text-gray-400">買家名稱</h4>
                                <div className="text-base">{orderInfo.user.name}</div>
                            </div>
                            <div className="flex">
                                <h4 className="w-28 text-gray-400">電子郵件</h4>
                                <div className="text-base">{orderInfo.user.email}</div>
                            </div>
                    
                            <div className="flex">
                                <h4 className="w-28 text-gray-400">手機號碼</h4>
                                <div className="text-base">{orderInfo.user.tel}</div>
                            </div>
                            <div className="flex">
                                <h4 className="w-28 text-gray-400">運送地址</h4>
                                <div className="text-base">{orderInfo.user.address}</div>
                            </div>
                            <div className="flex">
                                <h4 className="w-28 text-gray-400">付款狀態</h4>
                                {orderInfo.is_paid
                                    ?  <div className="text-base text-success">已付款</div>
                                    :  <div className="text-base text-error">未付款</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
