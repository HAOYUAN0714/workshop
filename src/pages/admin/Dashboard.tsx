import { Outlet, Link } from 'react-router-dom'


import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"


export default function Dashboard() {
    return (
        <>
            <nav className='navbar navbar-expand-lg bg-dark'>
                <div className='container-fluid'>
                    <p className='text-white mb-0'>HEX EATS 後台管理系統</p>
                    <button
                        className='navbar-toggler'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarNav'
                        aria-controls='navbarNav'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                    >
                        <span className='navbar-toggler-icon' />
                    </button>
                    <div
                        className='collapse navbar-collapse justify-content-end'
                        id='navbarNav'
                    >
                        <ul className='navbar-nav'>
                            <li className='nav-item'>
                                <button type='button' className='btn btn-sm btn-light'>
                                    登出
                                </button>
                            </li>
                        </ul>
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
                    </CommandGroup>
                </CommandList>
            </Command>
        </>
    );
}
