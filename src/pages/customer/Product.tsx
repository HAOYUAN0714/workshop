import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "@/hook/useAlert";
import { getProductDetail } from "@/api/customer/products";
import { updateCartProduct, getCart, addCart } from '@/api/customer/cart';
import { cartData, updateCart } from "@/redux/customer/cartSlice";
import { CustomerProductInterface, createProduct } from "@/interface/base/products";
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
import { ProductSkeleton } from '@/components/common/skeleton';

export default function Product() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const showAlert = useAlert();
    const cartState = useSelector(cartData);
    const { id: productId = '' } = useParams();
    const [productInfo, setProductInfo] = useState<CustomerProductInterface>(createProduct());
    const [selectedQty, setSelectedQty] = useState('1');
    const [isInited, setIsInited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (value: string) => {
        Number(value) > 0 && Number(value) < 11 && setSelectedQty(value);
    };

    const addCartHandler = async() => {
        if (isLoading) return;
        setIsLoading(true);
        // 先檢查產品是否存在於購物車中
        const curCartInfo = cartState?.carts?.length > 0
            ? cartState.carts.find(cartItem => cartItem.product.id === productInfo.id)
            : null;

        const { id: curCartId = '' } = curCartInfo || {};

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
            showAlert('error', res?.message || '購物車更新失敗');
            return;
        }

        // 新增完後更新購物車
        const cartRes = await getCart({});

        if (!cartRes?.success) {
            showAlert('error', cartRes?.message || '購物車更新失敗');
            return;
        }

        dispatch(updateCart(cartRes.data));
        setIsLoading(false);
        showAlert('success', res.message);
    };

    useEffect(() => {
        if (!productId) {
            navigate('/');
            return;
        }

        (async() => {
            const res = await getProductDetail({ path: productId });
            setTimeout(() => { setIsInited(true); },1000);
            if (!res?.success) {
                navigate('/');
                return;
            }
        
            setProductInfo(res.product);
        })();

    }, []);

    return <div className="flex flex-col w-full px-12">
        <div className="flex items-center h-12">
            <NavLink className="flex items-center text-base" to="/" >
                <FontAwesomeIcon className="text-base mr-2" icon={faArrowLeft}/> 回產品列表
            </NavLink>
        </div>
        { isInited
            ?   <div className="flex p-12 bg-background rounded-md">
                    <div className="flex flex-1">
                        <div
                            className="flex flex-none w-full min-h-[400px] bg-center bg-cover"
                            style={{
                                backgroundImage: `url(${productInfo.imageUrl})`,
                            }}
                        />
                    </div>
                    <div className="flex flex-1 flex-col pl-12">
                        <div className="text-2xl font-bold">{productInfo.title}</div>
                        <div className="mb-4 text-base font-bold">NT$ {productInfo.price}</div>
                        <p className='mb-4 text-muted-foreground text-lg'>
                            {productInfo.description}
                        </p>
                        <div className="relative flex items-center h-20">
                            <Button
                                className="w-12 h-12 rounded-none"
                                variant={ selectedQty === '1' ? 'disabled' : 'default' }
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
                                variant={ selectedQty === '10' ? 'disabled' : 'default' }
                                onClick={() => handleChange(`${Number(selectedQty) + 1}`)}
                            >
                                +
                            </Button>

                            <div className="flex items-end h-12 ml-10 text-2xl font-bold">NT$ {Number(selectedQty) * productInfo.price}</div>
                        </div>

                        <Button
                            className="relative h-16 text-lg rounded-none"
                            onClick={() => addCartHandler()}
                        >
                            {
                                isLoading && <div
                                    className="
                                        z-30 absolute top-0 left-0
                                        flex justify-center items-center
                                        w-full h-16 bg-gray-400 bg-opacity-60
                                    "
                                    role="status"
                                >
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-b-transparent rounded-full" />
                                </div>
                            }
                            增加 {selectedQty} 件餐點至購物車
                        </Button>
                    </div>

            </div>
            :   <ProductSkeleton className="flex p-12 bg-background rounded-md"/>
        }
    </div>
};
