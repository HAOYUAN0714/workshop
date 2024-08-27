import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetail } from "@/api/customer/orders";

export default function Order() {
    const navigate = useNavigate();
    const [orderInfo, setOrderInfo] = useState({});
    const { id: orderId = '' } = useParams();

    useEffect(() => {
        console.log('orderId', orderId);
        if (!orderId) {
            navigate('/');
            return;
        }

        (async() => {
            const res = await getOrderDetail({ path: orderId });

            if (!res.success) {
                navigate('/');
                return;
            }
        
            setOrderInfo(res.order);
        })();

    }, []);

    return <div className="flex flex-col w-full">
        <div className="flex"></div>
        <div className="flex">
            <div className="flex flex-1">
            </div>
            <div className="flex flex-1">
            </div>
        </div>
    </div>
};