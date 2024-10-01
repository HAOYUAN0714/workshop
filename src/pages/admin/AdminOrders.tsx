import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAlert } from '@/hook/useAlert'
import { addLoading, removeLoading } from '@/redux/common/loadingSlice'
import { format } from 'date-fns'
import { getOrderList, deleteOrder } from '@/api/admin/orders'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import OrderModal from '@/components/admin/modal/OrderModal'
import NoDataHint from '@/components/common/noDataHint'
import PageSet from '@/components/common/pageSet'
import { Button } from '@/components/ui/button'
import { Orders as orderInterface, createOrders } from '@/interface/base/orders'

export default function AdminOrders () {
    const dispatch = useDispatch()
    const showAlert = useAlert()
    const [isUpdated, setIsUpdated] = useState(false)
    const [orderList, setOrderList] = useState([])

    const [pagination, setPagination] = useState({
        category: null,
        current_page: 1,
        has_next: false,
        has_pre: false,
        total_pages: 1,
        pageArray: [1]
    })

    const [orderFilter, setOrderFilter] = useState({ page: '1' })
    const [editOrderInfo, setEditOrderInfo] = useState(createOrders())
    const [modalType, setModalType] = useState('')

    const updateOrderList = async () => {
        const loadingKey = new Date().getTime().toString()
        dispatch(addLoading(loadingKey))

        const orderRes = await getOrderList({ params: orderFilter })

        if (orderRes?.success) {
            setOrderList(orderRes.orders)
            const pageArray = Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
            setPagination({ ...orderRes.pagination, pageArray })
            setIsUpdated(true)
            dispatch(removeLoading(loadingKey))
            return
        }

        showAlert('error', '取得訂單列表失敗')
        setIsUpdated(true)
        dispatch(removeLoading(loadingKey))
    }

    const confirmDelete = async () => {
        const loadingKey = new Date().getTime().toString()
        dispatch(addLoading(loadingKey))

        const res = await deleteOrder({ path: editOrderInfo.id })
        if (res?.success) {
            await updateOrderList()
        }
        modalTriggerHandler('')
        dispatch(removeLoading(loadingKey))
        showAlert(res?.success ? 'success' : 'error', res.message)
    }

    // 切換分頁
    const handlePageChange = (page: number) => {
        setOrderFilter({ ...orderFilter, page: page.toString() })
    }

    useEffect(() => {
        updateOrderList()
    }, [orderFilter])

    // 切換 modal 流程
    const modalTriggerHandler = (type: string, orderInfo?: orderInterface) => {
        orderInfo && setEditOrderInfo(type === 'edit' || type === 'delete' ? { ...orderInfo } : createOrders())
        setModalType(type)
    }

    return (
        <div id="admin-coupons" className="relative flex flex-col px-4 h-full">
            <OrderModal
                modalTite={'訂單內容'}
                modalType={modalType}
                modalTriggerHandler={() => modalTriggerHandler('')}
                orderInfo={editOrderInfo}
                confirmDelete={confirmDelete}
            />
            <h2 className="flex flex-none items-center border-b-2 border-b-border h-16 text-2xl">
                訂單券列表
            </h2>
            <div className="flex flex-1 flex-col">
                {/* 優惠券列表 */}
                <div className="flex flex-1">
                    {
                        orderList.length === 0 && isUpdated
                            ? <NoDataHint />
                            : <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">訂單 ID</TableHead>
                                        <TableHead className="w-[100px]">購買用戶</TableHead>
                                        <TableHead className="w-[120px] text-right">金額(NT$)</TableHead>
                                        <TableHead className="w-[90px]">付款狀態</TableHead>
                                        <TableHead className="w-[120px]">建立日期</TableHead>
                                        <TableHead>買家留言</TableHead>
                                        <TableHead className="w-[180px]">編輯</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderList.map((orderItem: orderInterface) => (
                                        <TableRow key={ orderItem.id }>
                                            <TableCell className="max-w-[100px] truncate">{ orderItem.id }</TableCell>
                                            <TableCell className="max-w-[100px] truncate">{ orderItem.user.name }</TableCell>
                                            <TableCell className='text-right'>{ orderItem.total }</TableCell>
                                            <TableCell>
                                                {
                                                    orderItem.is_paid
                                                        ? <span className="text-success">已付款</span>
                                                        : <span className="text-error">未付款</span>
                                                }
                                            </TableCell>
                                            <TableCell>{ format(orderItem.create_at * 1000, 'yyyy-MM-dd') }</TableCell>
                                            <TableCell>{ orderItem.message || '無留言...' }</TableCell>
                                            <TableCell>
                                                <Button className="mr-2" type="button" onClick={() => modalTriggerHandler('edit', orderItem)}>
                                                查看
                                                </Button>
                                                <Button type="button" variant="destructive" onClick={() => modalTriggerHandler('delete', orderItem)}>
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
    )
}
