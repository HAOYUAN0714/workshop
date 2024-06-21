import { Outlet, Link, useNavigate } from 'react-router-dom'
import { logout } from '@/api/admin/user';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

export default function Dashboard() {
    const navigate = useNavigate();

    const logoutFunc = () => {
        logout().then(() => {
            navigate('/login');
        });
    }

    return (
        <>
            <nav id="top-navbar" className="container flex p-4">
                <div className="navbar-title basis-1/5">
                    商品後台管理系統
                </div>
                <div className="navbar-menu flex grow justify-end">
                    <div className="navbar-item">

                    </div>
                    <div className="navbar-item">
                    
                    </div>
                    <div className="navbar-item">
                        <button className="logout-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={logoutFunc}>
                            登出
                        </button>
                    </div>
                </div>
            </nav>


            <Command>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>產品列表</CommandItem>
                        <CommandItem>優惠卷列表</CommandItem>
                        <CommandItem>訂單列表</CommandItem>
                        <CommandItem>...</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </>
    );
}
