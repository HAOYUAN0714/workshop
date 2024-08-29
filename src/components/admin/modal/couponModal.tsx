import { useState, useEffect } from "react"
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form';
import { useAlert } from "@/hook/useAlert";
import { Button } from "@/components/ui/button"
import ConfirmModal from "@/components/common/modal/confirmationModal";
import DatePicker from "@/components/common/datePicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import couponInterface from "@/interface/coupons"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { createCoupon, updateCoupon, deleteCoupon } from '@/api/admin/coupons';
import { addLoading, removeLoading } from '@/redux/common/loadingSlice';

type modalProductInterface = Partial<couponInterface>;

interface modalProps {
    CouponId?: string;
    modalTite: string;
    modalDescription?: string;
    modalType?: string;
    createdCouponInfo?: modalProductInterface;
    modalTriggerHandler: () => void;
    updateCouponList: () => void;
}

export default function CouponModal({
    modalTite = '',
    modalType = '',
    createdCouponInfo,
    modalTriggerHandler,
    updateCouponList,
}: modalProps) {
    const dispatch = useDispatch();
    const showAlert = useAlert();

    // 新增商品初始化資料
    const initCoupon = {
        title: '',
        percent: 0,
        due_date: 0,
        code: '',
        is_enabled: false ,
    };

    const [couponInfo, setCouponInfo] = useState({...initCoupon});
    const [selectedDate, setSelectedDate] = useState(0);

    const selectDateHandler = (date: number) => {
        setSelectedDate(date);
    };

    const form = useForm({
        defaultValues: { ...initCoupon },
        values: couponInfo,
    });
 
    // 表單各編輯項目事件處理
    const handleChange = (e: React.SyntheticEvent) => {
        const { value, name } = (e.target as HTMLInputElement);
        // 分類優先使用自訂分類的值
        setCouponInfo({
            ...couponInfo,
            [name]: name === 'percent'
                ? Number(value)
                : value,
        });
    };

    const checkCouponEnabled = (checked: boolean) => {
        setCouponInfo({
            ...couponInfo,
            is_enabled: checked,
        });
    }

    // 表單送出 , 新增/編輯商品
    const onSubmit = async() => {
        const loadingKey = new Date().getTime().toString();
        dispatch(addLoading(loadingKey));
        
        const productParams = {
            data: { ...couponInfo, due_date: selectedDate, is_enabled: Number(couponInfo.is_enabled)}
        };
        
        let res = null;

        switch (modalType) {
            case 'create':
                res = await createCoupon({ params: productParams });
                break;
            case 'delete':
                res = await deleteCoupon({ path: createdCouponInfo?.id });
                break;
            default:
                res = await updateCoupon({ params: productParams, path: createdCouponInfo?.id });
                break;
        }

        if (res.success) {
            await updateCouponList();
            modalTriggerHandler();
        }

        dispatch(removeLoading(loadingKey));
        showAlert(res.success ? 'success' : 'error', res.message);
    };

    // 觸發 新增/編輯 商品打開彈窗時，初始化商品資料
    useEffect(() => {
        modalType === 'edit'
            ? setCouponInfo({
                ...initCoupon,
                ...createdCouponInfo,
                is_enabled: Boolean(createdCouponInfo?.is_enabled),
            })
            : setCouponInfo({...initCoupon});
    }, [modalType]); 

    return (
        modalType === 'delete'
            ? <ConfirmModal
                modalTite={'確認刪除優惠券?'}
                modalType={modalType}
                modalTriggerHandler={modalTriggerHandler}
                confirmOption={{
                    needConfirm: true,
                    confirmTitle: '確認',
                    confirmHandler: () => onSubmit()
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
                className="max-w-[720px] max-h-full overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        { modalTite }
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full space-y-8 pt-5' >
                        <div className="flex flex-3 flex-col">
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel htmlFor="title" className="flex h-8 items-center text-md">標題</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex">
                                <FormField
                                    control={form.control}
                                    name='percent'
                                    render={({ field }) => (
                                        <FormItem className="flex-1 pr-2 box-border">
                                            <FormLabel htmlFor="percent" className="flex h-8 items-center text-md">折扣 {'(%)'}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="percent"
                                                    type="number"
                                                    {...field}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='due_date'
                                    render={({}) => (
                                        <FormItem className="flex-1 pr-2 box-border">
                                            <FormLabel htmlFor="due_date" className="flex h-8 items-center text-md">到期日</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    selectDateHandler={selectDateHandler}
                                                    dateTimestamp={createdCouponInfo?.due_date || new Date().getTime()}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name='code'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="code" className="flex h-8 items-center text-md">優惠碼</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="code"
                                                {...field}
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='is_enabled'
                                render={({ field }) => (
                                    <FormItem className="space-y-0 flex h-10 items-center">
                                        <FormControl>
                                            <Checkbox
                                                id="is_enabled"
                                                checked={field.value}
                                                onCheckedChange={checkCouponEnabled}
                                            />
                                        </FormControl>
                                        <FormLabel
                                            htmlFor="is_enabled"
                                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            是否啟用
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button className="mr-2" type="submit" >儲存</Button>
                            <DialogClose asChild>
                                <Button type="button" variant="destructive">
                                    取消
                                </Button>
                            </DialogClose>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
