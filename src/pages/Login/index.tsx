'use client'
import { useSelector } from 'react-redux'
import { useAlert } from '@/hook/useAlert'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { login } from '@/api/admin/user'
import { alertInfoArray } from '@/redux/common/alertSlice'
import AlertDestructive from '@/components/common/alertDestructive/index'

// 使用 zod 定義表單型別與驗證規則
const loginSchema = z.object({
    username: z.string().email('帳號為電子郵件格式'),
    password: z.string().min(8, {
        message: '密碼至少為8個字元'
    })
})

export default function Login () {
    const navigate = useNavigate()
    const showAlert = useAlert()
    const alertList = useSelector(alertInfoArray)

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    // 表單提交
    function onSubmit (userInfo: z.infer<typeof loginSchema>) {
        login(userInfo).then(() => {
            navigate('/admin')
        }).catch((errorInfo) => {
            const { error = {} } = errorInfo
            const { code = '' } = error

            let errorMessage = ''

            switch (code) {
            case 'auth/wrong-password':
                errorMessage = ' : 密碼錯誤'
                break
            case 'auth/user-not-found':
                errorMessage = ' : 使用者不存在'
                break
            default:
                errorMessage = '登入失敗'
                break
            }

            showAlert('error', errorMessage)
        })
    }

    function onError (errors: any) {
        console.warn('login errors', errors)
    }

    return (
        <div
            id="login-page"
            className="w-full h-screen flex flex-col justify-center items-center mr-auto ml-auto"
            style={{ width: '20rem' }}
        >
            <div id="top-alert-list" className='z-50 fixed top-16 right-1 w-[275px]'>
                {alertList.map((alertInfo) => (
                    <AlertDestructive
                        id={alertInfo.id}
                        title={alertInfo.title}
                        alertType={alertInfo.alertType}
                        message={alertInfo.message}
                        key={alertInfo.id}
                        className='mb-2'
                    />
                ))}
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className='w-full space-y-8 pt-5' >
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>帳號</FormLabel>
                                <FormControl>
                                    <Input placeholder='' {...field} required/>
                                </FormControl>
                                <FormMessage>
                                    { form.formState.errors.username?.message || '' }
                                </FormMessage>
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
                                    <Input placeholder='' {...field} required/>
                                </FormControl>
                                <FormMessage>
                                    { form.formState.errors.password?.message || '' }
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <Button type='submit'>Submit</Button>
                </form>

            </Form>
        </div>
    )
}
