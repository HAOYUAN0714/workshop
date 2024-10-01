import { useEffect, useState } from 'react'
import { useAlert } from '@/hook/useAlert'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCartProduct, getCart, updateCartProduct } from '@/api/customer/cart'
import { cartData, updateCart } from '@/redux/customer/cartSlice'
import { Cart as CartInterface } from '@/interface/base/carts'
import CartCard from '@/components/customer/CartCard'
import { Button } from '@/components/ui/button'
import { CartSkeleton } from '@/components/common/skeleton'

interface loadingQueueInterface {
    [key: string]: boolean;
}

export default function ProductList () {
    const dispatch = useDispatch()
    const showAlert = useAlert()
    const cartState = useSelector(cartData)
    const [cartList, setCartList] = useState<CartInterface[]>([]) // 購物車列表
    const [totalPay, setTotalPay] = useState(0) // 總金額
    const [submiDisabled, setSubmitDisabled] = useState(false) // 送出按鈕是否禁用
    const [submitTxt, setSubmitTxt] = useState('確認送出') // 送出按鈕文字
    const [updatingProduct, setUpdatingProduct] = useState<loadingQueueInterface>({})
    const [isInited, setIsInited] = useState(false)

    // 更新購物車
    const getCartList = async () => {
        const cartRes = await getCart({})

        if (!cartRes?.success) {
            showAlert('error', cartRes?.message || '取得/更新購物車資料失敗')
            return
        }

        dispatch(updateCart(cartRes.data))
    }

    // 更新購物車中的商品數量
    const updateProductNum = async (cartInfo: CartInterface, qty: number) => {
        const { id, product_id } = cartInfo
        const params = {
            data: {
                product_id,
                qty
            }
        }

        setUpdatingProduct({ ...updatingProduct, [id]: true })
        await updateCartProduct({ params, path: id })
        await getCartList()
        setUpdatingProduct((prevUpdatingProduct) => {
            const updatedProduct = { ...prevUpdatingProduct }
            delete updatedProduct[id]
            return updatedProduct
        })
    }

    // 刪除購物車中的商品
    const deleteProduct = async (id: string) => {
        setUpdatingProduct({ ...updatingProduct, [id]: true })
        await deleteCartProduct({ path: id })
        await getCartList()
        setUpdatingProduct((prevUpdatingProduct) => {
            const updatedProduct = { ...prevUpdatingProduct }
            delete updatedProduct[id]
            return updatedProduct
        })
    }

    useEffect(() => {
        (async () => {
            await getCartList()
            setIsInited(true)
        })()
    }, [])

    useEffect(() => {
        switch (true) {
        case cartList.length === 0:
            setSubmitTxt('購物車是空的')
            break
        case Object.keys(updatingProduct).length > 0:
            setSubmitTxt('更新購物車中...')
            break
        case !isInited:
            setSubmitTxt('取得購物車中...')
            break
        default:
            setSubmitDisabled(false)
            setSubmitTxt('下一步')
            return
        }

        setSubmitDisabled(true)
    }, [cartList, updatingProduct, isInited])

    // api 更新購物車時就更新當前頁面的購物車
    useEffect(() => {
        const { carts = [], final_total = 0 } = cartState
        setCartList(carts)
        setTotalPay(final_total)
    }, [cartState])

    return (
        <div id="cart-root" className='flex flex-1 justify-center bg-overlay'>
            <div className="flex-col w-[576px] px-12 py-4 bg-card">
                <h3 className='flex flex-none justify-start items-center h-16 text-3xl'>訂單內容</h3>
                <div className="flex flex-col">
                    { isInited
                        ? cartList.map((cartInfo) => {
                            return <CartCard
                                className='mb-4'
                                cartInfo={cartInfo}
                                handleSelect={(cart, qty) => updateProductNum(cart, qty)}
                                handleDelete={(id) => deleteProduct(id)}
                                isLoading={updatingProduct[cartInfo.id]}
                                key={cartInfo.id}
                            />
                        })
                        : Array.from({ length: 1 }).map((_, index) => {
                            return <CartSkeleton className='w-full h-[150px] mb-4' key={index} />
                        })
                    }

                </div>
                <div className="flex flex-none w-full justify-between items-center h-16 text-2xl font-bold">
                    <div className="flex-none">總金額</div>
                    <div className="flex-none">NT${totalPay}</div>
                </div>
                <Button
                    className="flex flex-none w-full justify-center items-center h-16 rounded-none"
                    variant={
                        submiDisabled
                            ? 'disabled'
                            : 'default'
                    }
                >
                    {
                        submiDisabled
                            ? submitTxt
                            : <NavLink className="flex justify-center items-center w-full h-16" to="/checkout" >{submitTxt}</NavLink>
                    }

                </Button>
            </div>
        </div>
    )
};
