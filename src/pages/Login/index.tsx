'use client';

import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { login } from '@/api/user';
import AlertDestructive from '@/components/alert/index'

// 使用 zod 定義表單型別與驗證規則
const loginSchema = z.object({
    username: z.string().email().min(2, {
        message: '帳號為電子郵件格式',
    }),
    password: z.string().min(8, {
        message: '密碼至少為8個字元',
    }),
});



export default function Login() {
    const navigate= useNavigate();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    // 2. Define a submit handler.
    function onSubmit(userInfo: z.infer<typeof loginSchema>) {
        login(userInfo).then(() => {
            navigate('/admin');
        });
        
    }

    return (
        <div className="login-page w-full h-screen flex justify-center items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 p-5' style={{width: '20rem'}}>
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>帳號</FormLabel>
                                <FormControl>
                                    <Input placeholder='' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>密碼</FormLabel>
                                <FormControl>
                                    <Input placeholder='' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit'>Submit</Button>
                </form>

                {/* <AlertDestructive alertType={'warning'} message={'123123'}/> */}
            </Form>
        </div>
    );
}
