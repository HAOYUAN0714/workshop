import { useEffect } from 'react'
import { useAlert } from '@/hook/useAlert'
import { Outlet, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RootState } from '@/redux/store'
import { setTheme } from '@/redux/common/userSettingSlice'
import { updateCart, cartData } from '@/redux/customer/cartSlice'
import { addLoading, removeLoading } from '@/redux/common/loadingSlice'
import { alertInfoArray } from '@/redux/common/alertSlice'
import AlertDestructive from '@/components/common/alertDestructive'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { getCart } from '@/api/customer/cart'

export default function Dashboard () {
    const dispatch = useDispatch()
    const showAlert = useAlert()
    const cartState = useSelector(cartData)
    const alertList = useSelector(alertInfoArray)
    const theme = useSelector((state: RootState) => state.userSettingSlice.theme)

    const handleThemeSwitch = () => {
        dispatch(setTheme(theme === 'dark' ? '' : 'dark'))
    }

    // 更新購物車
    const updateCartList = async () => {
        const loadingKey = new Date().getTime().toString()
        dispatch(addLoading(loadingKey))

        const cartRes = await getCart({})

        if (!cartRes?.success) {
            showAlert('error', cartRes?.message || '購物車更新失敗')
            dispatch(removeLoading(loadingKey))
            return
        }

        dispatch(updateCart(cartRes.data))
        dispatch(removeLoading(loadingKey))
    }

    useEffect(() => {
        updateCartList()
    }, [])

    return (
        <div id="front-container" className="w-full min-h-lvh flex flex-col  bg-overlay">
            <div id="top-alert-list" className='z-50 fixed top-16 right-1 w-[275px]'>
                {alertList.map((alertInfo) => (
                    <AlertDestructive
                        id={alertInfo.id}
                        className='mb-2'
                        title={alertInfo.title}
                        alertType={alertInfo.alertType}
                        message={alertInfo.message}
                        key={alertInfo.id}
                    />
                ))}
            </div>
            {/* <FullLoading isLoading={isLoading} /> */}
            <header className="z-40 flex-none w-dvw h-16">
                <div className="fixed w-full flex flex-none h-16 p-4 bg-header text-header-foreground">
                    <h2 className="flex-none header-title text-lg">
                        <NavLink to={'/products'} >
                            商品列表
                        </NavLink>
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
                        <div className="relative flex flex-none items-center ml-3 text-lg cursor-pointer">
                            <NavLink to={'/cart'} >
                                <FontAwesomeIcon icon={faCartShopping} />
                            </NavLink>
                            { cartState?.carts?.length > 0 &&
                                <div
                                    className="
                                        absolute bottom-0 right-0 translate-x-2
                                        flex justify-center items-center
                                        w-4 h-4 rounded-full
                                        bg-error text-error-foreground
                                        text-xs
                                    "
                                >
                                    {cartState?.carts?.length}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex flex-1">
                { <Outlet /> }
            </div>
        </div>
    )
}
