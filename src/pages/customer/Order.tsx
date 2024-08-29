import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { getOrderDetail } from "@/api/customer/orders";
import { Button } from "@/components/ui/button";
import ProductDetailCard from "@/components/customer/ProductDetailCard";
import orderBanner from "@/assets/customer/orderBanner.jpg";
import OrderInterface, { createOrders } from "@/interface/orders"

export default function Order() {
    const navigate = useNavigate();
    const [orderInfo, setOrderInfo] = useState<OrderInterface>(createOrders());
    const { id: orderId = '' } = useParams();

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }

        (async() => {
            const res = await getOrderDetail({ path: orderId });

            if (!res?.success) {
                navigate('/');
                return;
            }
        
            setOrderInfo(res.order);
        })();

    }, []);

    return <div className="flex flex-col w-full px-12">
        <div
            className="flex flex-none w-full min-h-[400px] bg-center bg-cover mb-6"
            style={{
                backgroundImage: `url(${orderBanner})`,
            }}
        />
        <div className="flex">
            <div className="flex flex-1 flex-col pr-4">
                <div className="mb-4 text-2xl font-bold">餐點選購成功</div>
                <p className='mb-4 text-muted-foreground text-lg'>
                    親愛的顧客，感謝您在本平台訂餐。我們非常感激您對我們的信任和支持，讓我們有機會為您提供美味的餐點和優質的服務。
                </p>
                <p className='mb-4 text-muted-foreground text-lg'>
                    感謝您選擇本平台，祝您用餐愉快，生活愉快！
                </p>
                <NavLink className="flex" to="/" >
                    <Button type="button" variant="outline">
                        回首頁
                    </Button>
                </NavLink>
            </div>
            <div className="flex flex-1">
                <ProductDetailCard
                    orderInfo={orderInfo}
                />
            </div>
        </div>
    </div>
};