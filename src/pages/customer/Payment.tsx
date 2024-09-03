import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { getOrderDetail } from "@/api/customer/orders";
import { payOrder } from "@/api/customer/pay";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { Orders as OrderInterface, createOrders } from "@/interface/base/orders"
import { useAlert } from "@/hook/useAlert";

export default function Payment() {
    const navigate = useNavigate();
    const showAlert = useAlert();
    const [orderInfo, setOrderInfo] = useState<OrderInterface>(createOrders());
    const [paymentMethod, setPaymentMethod] = useState('');
    const { id: orderId = '' } = useParams();

    const submitPay = async() => {
        const res = await payOrder({ path: orderId });

        if (!res?.success) {
            showAlert('error', res.message);
            return;
        }

        navigate(`/order/${ orderId }`, { replace: true });
    };

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
    return (
        <div id="cart-root" className='flex flex-1 justify-center bg-overlay'>
            <div className="flex-col w-[576px] px-12 py-4 bg-card">
                <h3 className='flex flex-none justify-start items-center h-16 text-3xl'>付款</h3>
                <div className="flex flex-col py-8 border-b-2 border-border">
                    <div className="flex justify-between mb-2">
                        <div className="text-base">金額</div>
                        <div className="text-base">NT$ {orderInfo.total}</div>
                    </div>
                    <div className="flex justify-between mb-12">
                        <div className="text-base">折扣</div>
                        <div className="text-base">NT$ 0</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-xl font-bold">總計</div>
                        <div className="text-xl font-bold">NT$ {orderInfo.total}</div>
                    </div>
                </div>
                <div className="flex flex-col py-8">
                    <div className="text-xl mb-4">選擇付款方式</div>
                    <div className="flex px-4">
                        <div
                            className={`flex flex-col p-4
                                border-2 rounded-sm cursor-pointer 
                                hover:border-primary hover:text-primary
                                ${paymentMethod === 'cash' ? 'border-primary text-primary' : 'border-disabled text-disabled'}
                            `}
                            onClick={() => setPaymentMethod('cash')}
                        >
                            <FontAwesomeIcon icon={faTruck} className="mb-1 text-xl"/>
                            <div className="text-sm">貨到付款</div>
                        </div>
                    </div>
                </div>
                <Button
                    className="w-full py-8 text-lg rounded-none"
                    variant={ paymentMethod ? 'default' : 'disabled' }
                    onClick={submitPay}
                >
                    付款
                </Button>
            </div>
        </div>
    );
}