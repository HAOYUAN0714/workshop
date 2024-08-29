import { useEffect, useState } from 'react';
import { Link , Element } from 'react-scroll';
import { useDispatch } from 'react-redux'
import { getAllProduct } from '@/api/customer/products';
import { addCart, getCart } from '@/api/customer/cart';
import { addAlert, removeAlert } from "@/redux/common/alertSlice";
import { addLoading, removeLoading } from '@/redux/common/loadingSlice';
import { updateCart } from '@/redux/customer/cartSlice';
import { CustomerProductInterface } from "@/interface/products";
import ProductCard from '@/components/customer/ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons';

type CategoryProductData = {
    [category: string]: CustomerProductInterface[];
};

export default function ProductList() {
    const dispatch = useDispatch();
    const [categoryProductData, setCategoryProductData] = useState<CategoryProductData>({});
    const [categoryList, setCategoryList] = useState<string[]>([]); // 分類列表

    // 顯示 alert
    const alertHandler = (alertType: string, message: string) => {
        const id = new Date().getTime().toString()
        dispatch(addAlert({ id, alertType, message }));
        setTimeout(() => dispatch(removeAlert(id)), 3000); // 顯示３秒後消失
    }

    // 更新購物車
    const updateCartList = async(product_id: string, qty: number) => {
        const loadingKey = new Date().getTime().toString();
        dispatch(addLoading(loadingKey));

        const newCartRes = await addCart({ params: { data: { product_id, qty } }})

        // 新增失敗的話直接 return
        if (!newCartRes?.success) {
            alertHandler('error', newCartRes?.message || '購物車新增失敗');
            dispatch(removeLoading(loadingKey));
            return;
        }

        // 新增成功後重新獲取購物車資料
        const cartRes = await getCart({});

        if (!cartRes?.success) {
            alertHandler('error', cartRes?.message || '購物車更新失敗');
            dispatch(removeLoading(loadingKey));
            return;
        }

        dispatch(updateCart(cartRes.data));
        dispatch(removeLoading(loadingKey));

        // 最終顯示新增成功信息
        alertHandler('success', newCartRes.message);
    };

    // 更新商品列表
    const updateProductList = async () => {
        const loadingKey = new Date().getTime().toString();
        dispatch(addLoading(loadingKey));

        const productRes =  await getAllProduct();
        const { products = [], success = false } = productRes

        if (success) {
            // 建立 key 為類別，value 為相同類別商品例表的物件
            const productObj = products.reduce((root: Record<string, CustomerProductInterface[]>, product: CustomerProductInterface) => {
                return {
                    ...root,
                    [product.category]: [
                        ...(root[product.category] || []),
                        product
                    ]
                }
            
            }, {});

            setCategoryProductData(productObj);
            setCategoryList(Object.keys(productObj));
        }

        dispatch(removeLoading(loadingKey));
    }; 

    useEffect(() => {
        updateProductList();
    }, [])

    return (
        <div id="product-list" className='flex flex-1'>
            {/* 左側分類選單 */}
            <nav className="z-40 flex flex-col flex-none w-64 overflow-hidden">
                <div className="fixed top-16 left-0 w-64 h-dvh border-r-2 bg-background overflow-x-hidden overflow-y-auto">
                    { categoryList.map(category => {
                        return <Link
                            className="flex items-center px-8 py-4 text-lg cursor-pointer"
                            to={`${category}-section`}
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            key={category}
                        >
                            {category}
                        </Link>
                    })}
                </div>
            </nav>
            {/* 右側商品列表 */}
            <div className="z-30 flex flex-col flex-auto p-3">
                { categoryList.map(category => {
                    return <Element
                        className="flex flex-col mb-6"
                        name={`${category}-section`}
                        key={category}
                    >
                        <div className="my-6 text-xl text-primary">
                            {category}
                            <FontAwesomeIcon className='ml-2 text-success' icon={faTag} />
                        </div>
                        <div className="flex flex-wrap">
                            { categoryProductData[category].map((product: CustomerProductInterface) => {
                                return <ProductCard
                                    className="mb-3 mr-6"
                                    productInfo={product}
                                    updateCartList={() => updateCartList(product.id, 1)}
                                    key={product.id}
                                />
                            })}
                        </div>
                    </Element>
                })}
            </div>
        </div>
    );
};