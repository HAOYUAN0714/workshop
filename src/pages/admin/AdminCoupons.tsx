import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { useAlert } from "@/hook/useAlert";
import { addLoading, removeLoading } from '@/redux/common/loadingSlice';
import { format } from "date-fns"
import { getCouponList, updateCoupon } from '@/api/admin/coupons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import CouponModal from '@/components/admin/modal/couponModal';
import NoDataHint from '@/components/common/noDataHint';
import PageSet from "@/components/common/pageSet";
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import couponInterface from "@/interface/coupons"

export default function AdminOrders() {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const [isUpdated, setIsUpdated] = useState(false);
    const [couponList, setCouponList] = useState([]);

    const [pagination, setPagination] = useState({
        category: null,
        current_page: 1,
        has_next: false,
        has_pre: false,
        total_pages: 1,
        pageArray: [1],
    });

    const [couponFilter, setCouponFilter] = useState({ page: '1' });
    const [editCouponInfo, setEditCouponInfo] = useState({});
    const [modalType, setModalType] = useState('');

    const updateCouponList = async () => {
            const loadingKey = new Date().getTime().toString();
            dispatch(addLoading(loadingKey));

            const couponRes = await getCouponList({ params: couponFilter});

            if (couponRes.success) {
                setCouponList(couponRes.coupons);
                const pageArray = Array.from({ length: pagination.total_pages }, (_, i) => i + 1);
                setPagination({ ...couponRes.pagination, pageArray });
            }

            setIsUpdated(true);

            dispatch(removeLoading(loadingKey));
    };

    // 啟用/關閉 個別優惠券
    const switchCouponEnable = async (couponInfo: couponInterface) => {
        const loadingKey = new Date().getTime().toString();
        dispatch(addLoading(loadingKey));

        const { id: path = '', ...newCoupon } = couponInfo;

        // 商邊開關
        newCoupon.is_enabled =  Number(!newCoupon.is_enabled); 
        
        const updateRes = await updateCoupon({ params: { data: newCoupon }, path });
        updateRes?.success && await updateCouponList();

        dispatch(removeLoading(loadingKey));
        showAlert(updateRes.success ? 'success' : 'error', updateRes.message);
    };

    // 切換分頁
    const handlePageChange = (page: number) => {
        setCouponFilter({ ...couponFilter, page: page.toString() });
    };

    useEffect(() => {
        updateCouponList();
    }, [couponFilter]);

    // 切換 modal 流程
    const modalTriggerHandler = (type: string, couponInfo?: couponInterface ) => {
        setEditCouponInfo(type === 'edit' || type === 'delete' ? { ...couponInfo } : {});
        setModalType(type);
    }

    return (
        <div id="admin-coupons" className="relative flex flex-col px-4 h-full">
            <CouponModal
                modalTite={'建立優惠券'}
                modalType={modalType}
                modalTriggerHandler={() => modalTriggerHandler('')}
                createdCouponInfo={editCouponInfo}
                updateCouponList={updateCouponList}
            />
            <h2 className="flex flex-none items-center border-b-2 border-b-border h-16 text-2xl">
                優惠券列表
            </h2>
            <div className="flex flex-1 flex-col">
                <div className="flex flex-none h-14 justify-end items-center">
                    <button
                        className="ml-auto py-2 px-4 rounded bg-confirm hover:brightness-110 text-confirm-foreground font-bold"
                        onClick={() => modalTriggerHandler('create')}
                    >
                        建立優惠券
                    </button>
                </div>
                {/* 優惠券列表 */}
                <div className="flex flex-1">
                    {
                        couponList.length === 0 && isUpdated
                            ? <NoDataHint />
                            : <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">標題</TableHead>
                                    <TableHead>折扣</TableHead>
                                    <TableHead>到期日</TableHead>
                                    <TableHead>優惠碼</TableHead>
                                    <TableHead className="w-[100px]">啟用狀態</TableHead>
                                    <TableHead className="w-[180px]">編輯</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {couponList.map((couponItem: couponInterface) => (
                                    <TableRow key={ couponItem.id }>
                                        <TableCell className="font-medium">{ couponItem.title }</TableCell>
                                        <TableCell>{ couponItem.percent }%</TableCell>
                                        <TableCell>{ format(couponItem.due_date, 'yyyy-MM-dd') }</TableCell>
                                        <TableCell>{ couponItem.code }</TableCell>
                                        <TableCell>
                                            <Switch
                                                id="themeMode"
                                                checked={!!couponItem.is_enabled}
                                                onCheckedChange={() => switchCouponEnable(couponItem)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button className="mr-2" type="button" onClick={() => modalTriggerHandler('edit', couponItem)}>
                                                編輯
                                            </Button>
                                            <Button type="button" variant="destructive" onClick={() => modalTriggerHandler('delete', couponItem)}>
                                                刪除
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    }
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