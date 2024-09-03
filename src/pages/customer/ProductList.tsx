import { useEffect, useState } from 'react';
import { useAlert } from '@/hook/useAlert';
import { Link , Element } from 'react-scroll';
import { useDispatch } from 'react-redux'
import { getAllProduct } from '@/api/customer/products';
import { addCart, getCart } from '@/api/customer/cart';
import { updateCart } from '@/redux/customer/cartSlice';
import { CustomerProductInterface } from "@/interface/base/products";
import ProductCard from '@/components/customer/ProductCard';
import { LineSkeleton, CardSkeleton } from '@/components/common/skeleton/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons';

type CategoryProductData = {
    [category: string]: CustomerProductInterface[];
};

interface loadingQueueInterface {
    [key: string]: boolean;
}

export default function ProductList() {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const [categoryProductData, setCategoryProductData] = useState<CategoryProductData>({});
    const [categoryList, setCategoryList] = useState<string[]>([]); // 分類列表
    const [isInited, setIsInited] = useState(false);
    const [loadingQueue, setLoadingQueue] = useState<loadingQueueInterface>({});

    // 更新購物車
    const updateCartList = async(product_id: string, qty: number) => {
        setLoadingQueue({ ...loadingQueue, [product_id]: true });
        const newCartRes = await addCart({ params: { data: { product_id, qty } }})

        // 新增失敗的話直接 return
        if (!newCartRes?.success) {
            showAlert('error', newCartRes?.message || '購物車新增失敗');
            return;
        }

        // 新增成功後重新獲取購物車資料
        const cartRes = await getCart({});

        if (!cartRes?.success) {
            showAlert('error', cartRes?.message || '購物車更新失敗');
            return;
        }

        dispatch(updateCart(cartRes.data));

        // 最終顯示新增成功信息
        setLoadingQueue((prevQueue) => {
            const updatedProduct = { ...prevQueue };
            delete updatedProduct[product_id];
            return updatedProduct;
        });
        showAlert('success', newCartRes.message);
    };

    // 更新商品列表
    const updateProductList = async () => {
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
    }; 

    useEffect(() => {
        (async() => {
            await updateProductList();
            setTimeout(() => setIsInited(true), 1000); // 至少讀去一秒
        })();
    }, [])

    return (
        <div id="product-list" className='flex flex-1'>
            {/* 左側分類選單 */}
            <nav className="z-40 flex flex-col flex-none w-64 overflow-hidden">
                <div className="fixed top-16 left-0 w-64 h-dvh border-r-2 bg-background overflow-x-hidden overflow-y-auto">
                    {   isInited
                        ?   categoryList.map(category => {
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
                        })
                        : Array.from({ length: 4 }).map((_, index) => {
                            return  <div className="flex items-center px-8 py-6">
                                <div className="w-full h-4">
                                    <LineSkeleton key={index}/>
                                </div>
                            </div>
                        })
                    }
                </div>
            </nav>
            {/* 右側商品列表 */}
            <div className="z-30 flex flex-col flex-auto p-3">
                {   isInited
                    ?   categoryList.map(category => {
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
                                                isLoading={loadingQueue[product.id]}
                                                key={product.id}
                                            />
                                        })
                                    }
                                </div>
                            </Element>
                    })
                    :   Array.from({ length: 6 }).map((_, index) => {
                        return <div
                            className="flex flex-col mb-6"
                            key={index}
                        >
                            <div className="w-12 h-4 my-6">
                                <LineSkeleton />
                            </div>
                            <div className="flex flex-wrap">
                                { Array.from({ length: 4 }).map((_, cardIndex) => {
                                    return <CardSkeleton className="mb-3 mr-6 bg-card" key={cardIndex} />
                                })}
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    );
};