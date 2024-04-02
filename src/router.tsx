import React, { useEffect, useState } from 'react';
import { Navigate, createHashRouter } from 'react-router-dom';
import { checkIsLogin } from '@/api/admin/user' 

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard  from './pages/admin/Dashboard';

// 路由守衛
interface RouterGuardProps {
    children: React.ReactNode;
    redirectPath?: string;
}

// 如果已經在登入狀態且嘗試導向登入頁，則導到首頁
const LoginDirectGrard = ({
    children,
    redirectPath = '/admin',
}: RouterGuardProps) => {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1] || '';

    if (token) return <Navigate to={redirectPath} replace />;
    return children;
};

// 判斷頁面是否有token且正確，不是的話導向登入頁面
const RouterGuard = ({
    children,
}: RouterGuardProps) => {
    const [isValidLogin, setIsValidLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        (async() => {

            if (!isChecked) {
                setIsChecked(true);
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("hexToken="))
                    ?.split("=")[1] || '';
                
                const loginSuccess = await checkIsLogin();
                setIsValidLogin(Boolean(token && loginSuccess)) 
                setIsLoading(false);
            }

        })()

    
    }, []);

    // useEffect(() => {
    //     if (isValidLogin) {
    //         setIsLoading(false);
    //     }
    // }, [isValidLogin])

    if (isLoading) return <div>loading...</div>;

    if (!isValidLogin) {
        return  <Navigate to={'/login'} replace />;
    }

    return children;

};

const router = createHashRouter([
    {
        // 首頁
        path: '/',
        element: (
            <RouterGuard>
                <Home />
            </RouterGuard>
        ),
    },
    {
        // 首頁
        path: '/admin',
        element: (
            <RouterGuard>
                <Dashboard />
            </RouterGuard>
        ),
    },
    {
        // 產品列表
        path: '/admin/products',
        element: (
            <RouterGuard>
                <Dashboard />
            </RouterGuard>
        ),
    },
    {
        // 登入頁面
        path: '/login',
        element: (
            <LoginDirectGrard>
                <Login />
            </LoginDirectGrard>
        ),
    },
]);

export default router;
