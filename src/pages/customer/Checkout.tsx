import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
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
import { addAlert, removeAlert } from "@/redux/common/alertSlice";
import { clearCart, cartData } from '@/redux/customer/cartSlice';

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
    const cartState = useSelector(cartData);

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

    // 顯示 alert
    const alertHandler = (alertType: string, message: string) => {
        const id = new Date().getTime().toString();
        dispatch(addAlert({ id, alertType, message }));
        setTimeout(() => dispatch(removeAlert(id)), 3000); // 顯示３秒後消失
    }

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
            alertHandler('error', res?.message || '訂單建立失敗');
            dispatch(removeLoading(loadingKey));
            return;
        }

        dispatch(clearCart()); // 清空購物車
        navigate(`/order/${ res.orderId }`, { replace: true });
        dispatch(removeLoading(loadingKey));
    };

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex justify-center w-full space-y-8 pt-5' >
            <div className="flex flex-col items-center w-96">
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
                    <Button className="flex justify-center items-center w-full h-16 mt-4" type="submit" >確認送出</Button>
                </div>
            </div>
        </form>
    </Form>
};