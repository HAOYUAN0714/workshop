import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetail } from "@/api/customer/products";
import { updateCartProduct, getCart, addCart } from '@/api/customer/cart';
import { cartData, updateCart } from "@/redux/customer/cartSlice";
import { addAlert, removeAlert } from "@/redux/common/alertSlice";
import { addLoading, removeLoading } from '@/redux/common/loadingSlice';
import { CustomerProductInterface, createProduct } from "@/interface/products";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Product() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartState = useSelector(cartData);
    const { id: productId = '' } = useParams();
    const [productInfo, setProductInfo] = useState<CustomerProductInterface>(createProduct());
    const [selectedQty, setSelectedQty] = useState('1');

    // 顯示 alert
    const alertHandler = (alertType: string, message: string) => {
        const id = new Date().getTime().toString()
        dispatch(addAlert({ id, alertType, message }));
        setTimeout(() => dispatch(removeAlert(id)), 3000); // 顯示３秒後消失
    }

    const handleChange = (value: string) => {
        Number(value) > 0 && setSelectedQty(value);
    };

    const addCartHandler = async() => {
        dispatch(addLoading('addCartHandler'));
        // 先檢查產品是否存在於購物車中
        const curCartInfo = cartState?.carts?.length > 0
            ? cartState.carts.find(cartItem => cartItem.product.id === productInfo.id)
            : null;

        const curCartId = curCartInfo
            ? curCartInfo.id
            : null;

        // 如果產品已在購物車根據數量更新
        const newQty = curCartInfo
            ? curCartInfo.qty + Number(selectedQty)
            : Number(selectedQty);
        
        const params = {
            data: {
                product_id: productInfo.id,
                qty: newQty
            }
        };

        const res = curCartId 
            ? await updateCartProduct({ params, path: curCartId })
            : await addCart({ params });

        if (!res?.success) {
            alertHandler('error', res?.message || '購物車更新失敗');
            return;
        }

        // 新增完後更新購物車
        const cartRes = await getCart({});

        if (!cartRes?.success) {
            alertHandler('error', cartRes?.message || '購物車更新失敗');
            return;
        }

        dispatch(updateCart(cartRes.data));
        dispatch(removeLoading('addCartHandler'));
        alertHandler('success', res.message);
    };

    useEffect(() => {
        dispatch(addLoading('productDetail'));
        if (!productId) {
            navigate('/');
            return;
        }

        (async() => {
            const res = await getProductDetail({ path: productId });

            if (!res?.success) {
                navigate('/');
                dispatch(removeLoading('productDetail'));
                return;
            }
        
            setProductInfo(res.product);
        })();

        dispatch(removeLoading('productDetail'));
    }, []);

    return <div className="flex flex-col w-full px-24">
        <div className="flex items-center h-12">
            <NavLink className="flex items-center text-base" to="/" >
                <FontAwesomeIcon className="text-base mr-2" icon={faArrowLeft}/> 回產品列表
            </NavLink>
        </div>
        <div className="flex">
            <div className="flex flex-1">
                <div
                    className="flex flex-none w-full min-h-[400px] bg-center bg-cover mb-6"
                    style={{
                        backgroundImage: `url(${productInfo.imageUrl})`,
                    }}
                />
            </div>
            <div className="flex flex-1 flex-col pl-12">
                <div className="text-2xl font-bold">{productInfo.title}</div>
                <div className="mb-4 text-base font-bold">NT$ {productInfo.price} x 1</div>
                <p className='mb-4 text-muted-foreground text-lg'>
                    {productInfo.description}
                </p>
                <div className="flex items-center h-20">
                    <Button
                        className="w-12 h-12 rounded-none"
                        onClick={() => handleChange(`${Number(selectedQty) - 1}`)}
                    >
                        -
                    </Button>
                    <div className="flex h-12">
                        <Select
                            onValueChange={handleChange}
                            value={selectedQty}
                        >
                            <SelectTrigger className="flex-none w-20 h-12 rounded-none focus:ring-offset-0 focus:ring-transparent">
                                <SelectValue placeholder="選擇數量" />
                            </SelectTrigger>
                            <SelectContent>
                                { Array.from({ length: 10 }, (v, i) => i + 1).map((num) => {
                                    return (
                                        <SelectItem value={`${num}`} key={num}>{num}</SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        className="w-12 h-12 rounded-none"
                        onClick={() => handleChange(`${Number(selectedQty) + 1}`)}
                    >
                        +
                    </Button>

                    <div className="flex items-end h-12 ml-10 text-2xl font-bold">NT$ {Number(selectedQty) * productInfo.price}</div>
                </div>
                <Button
                    className="h-16 text-lg"
                    onClick={() => addCartHandler()}
                >
                    增加 {selectedQty} 件餐點至購物車
                </Button>
            </div>
        </div>
    </div>
};
