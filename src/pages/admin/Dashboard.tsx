import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '@/api/admin/user';
import {
    CubeIcon,
    ReaderIcon,
    BookmarkFilledIcon
} from "@radix-ui/react-icons"
import { useDispatch, useSelector } from 'react-redux'
import FullLoading from '@/components/common/fullLoading';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RootState } from '@/redux/store';
import { setTheme } from '@/redux/common/userSettingSlice';
import { loadingQueue } from '@/redux/common/loadingSlice';
import { useState, useEffect } from 'react';
import { alertInfoArray } from '@/redux/common/alertSlice';
import AlertDestructive from '@/components/common/alertDestructive';

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loadingState = useSelector(loadingQueue);
    const alertList = useSelector(alertInfoArray);
    const theme = useSelector((state: RootState) => state.userSettingSlice.theme);

    const handleThemeSwitch = () => {
        dispatch(setTheme(theme === 'dark' ? '' : 'dark'));
    }

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1] || '';

    const logoutFunc = () => {
        logout().then(() => {
            navigate('/admin/login');
        });
    }

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(!!Object.keys(loadingState).length);
    }, [loadingState])

    const sideMenu = [
        {
            title: '產品列表',
            path: '/admin/products',
            icon: <CubeIcon />
        },
        {
            title: '優惠卷列表',
            path: '/admin/coupons',
            icon: <BookmarkFilledIcon />
        },
        {
            title: '訂單列表',
            path: '/admin/orders',
            icon: <ReaderIcon />
        }
    ];

    const linkClass = 'flex justify-center items-center w-full p-4 text-sm';

    return (
        <div id="admin-dashboard" className="w-full flex flex-col h-screen bg-background">
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
            <FullLoading isLoading={isLoading} />
            <header className="w-full flex flex-none h-16 p-4 bg-header text-header-foreground">
                <h2 className="flex-none header-title text-lg">
                    商品後台管理系統
                </h2>
                <div className="header-right-area flex ml-auto">
                    <div className="flex flex-none items-center space-x-2">
                        <Switch
                            id="themeMode"
                            checked={theme === 'dark'}
                            onCheckedChange={handleThemeSwitch}
                        />
                        <Label htmlFor="themeMode">深色模式</Label>
                    </div>
                    <button className="flex-none ml-3 py-2 px-4 rounded bg-confirm hover:brightness-110 text-confirm-foreground font-bold" onClick={logoutFunc}>
                        登出
                    </button>
                </div>
            </header>
            
            <div className="flex flex-1">
                {/* 左 Menu */}
                <nav className="flex-none w-48 bg-muted">
                    <ul className='bg-muted-foreground'>
                        { sideMenu.map(menuItem => {
                            return (
                                <li className='menu-item w-full flex  bg-background hover:cursor-pointer hover:brightness-110' key={menuItem.title}>
                                    <NavLink
                                        className={({ isActive }) => (isActive ? `${linkClass} bg-confirm  text-confirm-foreground` : linkClass)}
                                        to={menuItem.path}
                                    >
                                        <div className="flex-none w-4">
                                            { menuItem.icon }
                                        </div>
                                        <div className='flex-1 pl-1'>
                                            { menuItem.title }    
                                        </div>
                                    </NavLink>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
                {/* 右 項目分頁 */}
                <main className="flex-1 bg-background text-foreground">
                   { token && <Outlet />}
                </main>
            </div>
        </div>
    );
}