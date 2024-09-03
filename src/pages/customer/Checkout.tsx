import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/hook/useAlert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { postOrders } from "@/api/customer/orders";
import { addLoading, removeLoading } from "@/redux/common/loadingSlice";
import { clearCart } from '@/redux/customer/cartSlice';

// 使用 zod 定義表單型別與驗證規則
const orderSchema = z.object({
    email:  z.string().email('帳號為電子郵件格式'),
    name: z.string(),
    tel: z.string()
        .min(10, { message: '手機格式錯誤' })
        .max(10, { message: '手機格式錯誤' })
        .refine((value) => value.startsWith('09'), { message: '手機格式錯誤' }),
    address: z.string(),
    message: z.string().optional(),
});

interface basicInfoInterface {
    email: string, // 電子郵件
    name: string, // 姓名
    tel: string // 電話    
    address: string, // 地址
    message?: string // 備註
}

export default function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const showAlert = useAlert();

    const [checkoutData, setCheckoutData] = useState({
        email: '',
        name: '',
        tel: '',
        address: '',
        message: '',
    } as basicInfoInterface);

    const form = useForm<z.infer<typeof orderSchema>>({
        resolver: zodResolver(orderSchema),
        defaultValues: checkoutData,
        values: checkoutData,
    });

    const handleChange = (e: React.SyntheticEvent) => {
        const { value, name } = (e.target as HTMLInputElement);

        setCheckoutData({
            ...checkoutData,
            [name]: value,
        });
    };

    const onSubmit = async(submitData: basicInfoInterface) => {
        const loadingKey = new Date().getTime().toString();
        dispatch(addLoading(loadingKey));
        const { message, ...user } = submitData;

        const params = {
            data: {
                user,
                message
            }
        }

        const res = await postOrders({ params });

        if (!res?.success) {
            showAlert('error', res?.message || '訂單建立失敗');
            dispatch(removeLoading(loadingKey));
            return;
    }

        dispatch(clearCart()); // 清空購物車
        navigate(`/payment/${ res.orderId }`, { replace: true });
        dispatch(removeLoading(loadingKey));
    };

    return (
        <div id="cart-root" className='flex flex-1 justify-center bg-overlay'>
            <div className="flex-col w-[576px] px-12 py-4 bg-card">
                <h3 className='flex flex-none justify-start items-center h-16 text-3xl'>基本資料</h3>
                <div className="flex flex-col">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='flex justify-center w-full min-h-full  bg-overlay' >
                            <div className="flex flex-col items-center w-full min-h-full  py-4 bg-card">
                                <div className="flex flex-col w-full">
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel htmlFor="email" className="flex h-8 items-center text-md">電子郵件</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        {...field}
                                                        value={checkoutData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-right">
                                                    { form.formState.errors.email?.message || '' } 
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel htmlFor="name" className="flex h-8 items-center text-md">姓名</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        {...field}
                                                        value={checkoutData.name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='tel'
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel htmlFor="tel" className="flex h-8 items-center text-md">手機號碼</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        {...field}
                                                        value={checkoutData.tel}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-right">
                                                    { form.formState.errors.tel?.message || '' } 
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='address'
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel htmlFor="address" className="flex h-8 items-center text-md">地址</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="address"
                                                        {...field}
                                                        value={checkoutData.address}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='message'
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel htmlFor="message" className="flex h-8 items-center text-md">備註</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        id="message"
                                                        placeholder=""
                                                        {...field}
                                                        value={checkoutData.message}
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        className="flex justify-center items-center w-full h-16 mt-4 rounded-none"
                                        type="submit"
                                    >
                                        確認送出
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};