import { Outlet, NavLink, useNavigate } from 'react-router-dom'
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


    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(!!Object.keys(loadingState).length);
    }, [loadingState])

    return (
        <div id="admin-dashboard" className="w-full flex flex-col h-screen bg-background">
            <div id="top-alert-list" className='z-50 fixed top-1 right-1 w-[275px]'>
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
                    商品列表
                </h2>
                <div className="flex ml-auto">
                    <div className="flex flex-none items-center space-x-2">
                        <Switch
                            id="themeMode"
                            checked={theme === 'dark'}
                            onCheckedChange={handleThemeSwitch}
                        />
                        <Label htmlFor="themeMode">深色模式</Label>
                    </div>
                </div>
            </header>
            <div className="flex flex-1">
                { <Outlet /> }
            </div>
        </div>
    );
}