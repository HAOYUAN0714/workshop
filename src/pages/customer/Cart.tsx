import { useEffect, useState } from 'react';
import { useAlert } from "@/hook/useAlert";
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { deleteCartProduct, getCart, updateCartProduct } from '@/api/customer/cart';
import { addLoading, removeLoading } from '@/redux/common/loadingSlice';
import { cartData, updateCart } from '@/redux/customer/cartSlice';
import { Cart as CartInterface } from '@/interface/base/carts';
import CartCard from '@/components/customer/CartCard';
import { Button } from "@/components/ui/button"

interface loadingQueueInterface {
    [key: string]: boolean;
}

export default function ProductList() {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const cartState = useSelector(cartData);
    const [cartList, setCartList] = useState<CartInterface[]>([]); // 購物車列表
    const [totalPay, setTotalPay] = useState(0); // 總金額
    const [submiDisabled, setSubmitDisabled] = useState(false); // 送出按鈕是否禁用
    const [submitTxt, setSubmitTxt] = useState('確認送出'); // 送出按鈕文字
    const [updatingProduct, setUpdatingProduct] = useState<loadingQueueInterface>({});

    // 更新購物車
    const getCartList = async(isInit = false) => {
        const loadingKey = new Date().getTime().toString();
        isInit && dispatch(addLoading(loadingKey));
        
        const cartRes = await getCart({});

        if (!cartRes?.success) {
            showAlert('error', cartRes?.message || '取得/更新購物車資料失敗');
            dispatch(removeLoading(loadingKey));
            return;
        } 

        dispatch(updateCart(cartRes.data));
        isInit && dispatch(removeLoading(loadingKey));
    };

    // 更新購物車中的商品數量
    const updateProductNum = async(cartInfo: CartInterface, qty: number) => {
        const { id, product_id } = cartInfo;
        const params = {
            data: {
                product_id,
                qty
            }
        };

        setUpdatingProduct({ ...updatingProduct, [id]: true });
        await updateCartProduct({ params, path: id });
        await getCartList();
        setUpdatingProduct((prevUpdatingProduct) => {
            const updatedProduct = { ...prevUpdatingProduct };
            delete updatedProduct[id];
            return updatedProduct;
        });
    };

    // 刪除購物車中的商品
    const deleteProduct = async(id: string) => {
        setUpdatingProduct({ ...updatingProduct, [id]: true });
        await deleteCartProduct({ path: id });
        await getCartList();
        setUpdatingProduct((prevUpdatingProduct) => {
            const updatedProduct = { ...prevUpdatingProduct };
            delete updatedProduct[id];
            return updatedProduct;
        });
    };

    useEffect(() => {
        getCartList(true);
    }, [])

    useEffect(() => {
        if (cartList.length === 0 || Object.keys(updatingProduct).length > 0) {
            setSubmitDisabled(true);
            Object.keys(updatingProduct).length > 0 && setSubmitTxt('更新購物車中...');
            cartList.length === 0 && setSubmitTxt('購物車是空的');
            return;
        }

        setSubmitDisabled(false);
        setSubmitTxt('下一步');
    }, [cartList, updatingProduct])

    // api 更新購物車時就更新當前頁面的購物車
    useEffect(() => {
        const { carts = [], final_total = 0 } = cartState;
        setCartList(carts);
        setTotalPay(final_total);
    }, [cartState])

    return (
        <div id="cart-root" className='flex flex-1 justify-center'>
            <div className="flex-col w-96">
                <h3 className='flex flex-none justify-start items-center h-16 text-3xl'>訂單內容</h3>
                <div className="flex flex-col">
                    { cartList.map((cartInfo) => {
                        return <CartCard
                            className='mb-4'
                            cartInfo={cartInfo}
                            handleSelect={(cart, qty) => updateProductNum(cart, qty)}
                            handleDelete={(id) => deleteProduct(id)}
                            isLoading={updatingProduct[cartInfo.id]}
                            key={cartInfo.id} 
                        />
                    })}
                </div>
                <div className="flex flex-none w-full justify-between items-center h-16 text-2xl font-bold">
                    <div className="flex-none">總金額</div>
                    <div className="flex-none">NT${totalPay}</div>
                </div>
                <Button
                    className="flex flex-none w-full justify-center items-center h-16"
                    variant={
                        submiDisabled
                            ? 'disabled'
                            : 'default'
                    }
                >
                    {
                        submiDisabled
                            ?  submitTxt
                            : <NavLink className="flex justify-center items-center w-full h-16" to="/checkout" >{submitTxt}</NavLink>
                    }
                   
                </Button>
            </div>
        </div>
    );
};
