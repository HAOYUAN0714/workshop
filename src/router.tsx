import React, { useEffect, useState } from 'react'
import { Navigate, createHashRouter, useLocation, useNavigate } from 'react-router-dom'
import { checkIsLogin } from '@/api/admin/user'
import Login from '@/pages/Login'
import Dashboard from '@/pages/admin/Dashboard'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminCoupons from '@/pages/admin/AdminCoupons'
import AdminOrders from '@/pages/admin/AdminOrders'
import FrontContainer from '@/pages/customer/FrontContainer'
import ProductList from '@/pages/customer/ProductList'
import Product from '@/pages/customer/Product'
import Cart from '@/pages/customer/Cart'
import Checkout from '@/pages/customer/Checkout'
import Order from '@/pages/customer/Order'
import Payment from '@/pages/customer/Payment'
import FullLoading from '@/components/common/fullLoading'

// 路由守衛
interface RouterGuardProps {
    children: React.ReactNode;
    redirectPath?: string;
}

// 如果已經在登入狀態且嘗試導向登入頁，則導到首頁
const LoginDirectGrard = ({
    children,
    redirectPath = '/admin'
}: RouterGuardProps) => {
    const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('hexToken='))
        ?.split('=')[1] || ''

    if (token) return <Navigate to={redirectPath} replace />
    return children
}

// 判斷頁面是否有token且正確，不是的話導向登入頁面
const RouterGuard: React.FC<{ children: JSX.Element }> = ({
    children
}) => {
    const [isValidLogin, setIsValidLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isChecked, setIsChecked] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            if (!isChecked) {
                setIsChecked(true)
                const token = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('hexToken='))
                    ?.split('=')[1] || ''

                const loginSuccess = await checkIsLogin()
                setIsValidLogin(Boolean(token && loginSuccess))
                setIsLoading(false)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (isValidLogin && location.pathname === '/admin') {
                navigate('/admin/products')
            }
        })()
    }, [isValidLogin, location, navigate])

    if (isLoading) return <FullLoading isLoading={isLoading} />

    if (!isValidLogin) {
        return <Navigate to={'/admin/login'} replace />
    }

    return children
}

const FrontGuard: React.FC<{ children: JSX.Element }> = ({
    children
}) => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            if (location.pathname === '/') {
                navigate('/products')
            }
        })()
    }, [location, navigate])

    return children
}

const router = createHashRouter([
    {
        path: '*',
        element: <Navigate to="/" />
    },
    {
        // 後台
        path: '/admin',
        element: (
            <RouterGuard>
                <Dashboard />
            </RouterGuard>
        ),
        children: [
            {
                // 產品列表
                path: '/admin/products',
                element: (
                    <RouterGuard>
                        <AdminProducts />
                    </RouterGuard>
                )
            },
            {
                // 優惠卷列表
                path: '/admin/coupons',
                element: (
                    <RouterGuard>
                        <AdminCoupons />
                    </RouterGuard>
                )
            },
            {
                // 訂單列表
                path: '/admin/orders',
                element: (
                    <RouterGuard>
                        <AdminOrders />
                    </RouterGuard>
                )
            }
        ]
    },
    {
        // 前台客端
        path: '/',
        element: (
            <FrontGuard>
                <FrontContainer />
            </FrontGuard>
        ),
        children: [
            {
                // 產品列表
                path: '/products',
                element: <ProductList />
            },
            {
                // 產品詳細資料
                path: '/product/:id',
                element: <Product />
            },
            {
                // 購物車
                path: '/cart',
                element: <Cart />
            },
            {
                // 訂單確認
                path: '/checkout',
                element: <Checkout />
            },
            {
                // 付款確認
                path: '/payment/:id',
                element: <Payment />
            },
            {
                // 下訂結果
                path: '/order/:id',
                element: <Order />
            }
        ]
    },
    {
        // 後台登入頁面
        path: '/admin/login',
        element: (
            <LoginDirectGrard>
                <Login />
            </LoginDirectGrard>
        )
    }
])

export default router
