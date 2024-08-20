import { RouterProvider } from 'react-router-dom'
import router from './router'
import { useSelector } from 'react-redux';
import './index.css'
import { RootState } from '@/redux/store';

export default function App () {
    const theme = useSelector((state: RootState) => state.userSettingSlice.theme);

    const themeClass = `router-wrap min-w-[1024px] ${theme}`;

    return (
        <div className={themeClass}>
            <RouterProvider
                router={router}
            />
        </div>
    )
}