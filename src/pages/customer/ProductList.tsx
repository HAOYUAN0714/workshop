import { useEffect, useState } from 'react';
import { Link , Element } from 'react-scroll';
import { useDispatch } from 'react-redux'
import { getProductList, getAllProduct } from '@/api/customer/products';
import { addLoading, removeLoading } from '@/redux/common/loadingSlice';
import productInterface from "@/interface/products";
import ProductCard from '@/components/customer/ProductCard';

type CategoryProductData = {
    [category: string]: productInterface[];
};

export default function ProductList() {

    const dispatch = useDispatch();

    const [categoryProductData, setCategoryProductData] = useState<CategoryProductData>({});

    const [categoryList, setCategoryList] = useState<string[]>([]); // 分類列表

    // 更新商品列表
    const updateProductList = async () => {
        const loadingKey = new Date().getTime().toString();
        dispatch(addLoading(loadingKey));

        const productRes =  await getAllProduct();

        const { products = [], success = false } = productRes

        if (success) {
            // 建立 key 為類別，value 為相同類別商品例表的物件
            const productObj = products.reduce((root: Record<string, productInterface[]>, product: productInterface) => {
                return {
                    ...root,
                    [product.category]: [
                        ...(root[product.category] || []),
                        product
                    ]
                }
            
            }, {});
            console.log('productObj', productObj)
            setCategoryProductData(productObj);
            setCategoryList(Object.keys(productObj));
        }

        dispatch(removeLoading(loadingKey));
    }; 

    // 如果 篩選資料 有變動，則重新取得商品列表
    useEffect(() => {
        updateProductList();
    }, [])

    return (
        <div id="product-list" className='flex flex-1'>
            {/* 左側分類選單 */}
            <nav className="flex flex-col flex-none w-64">
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
            </nav>
            {/* 右側商品列表 */}
            <div className="flex flex-col flex-auto p-3">
                { categoryList.map(category => {
                    return <Element name={`${category}-section`} className="flex flex-col mb-6">
                        <div className="text-xl my-6">
                            {category}
                        </div>
                        <div className="flex flex-wrap">
                            { categoryProductData[category].map((product: productInterface) => {
                                return <ProductCard
                                    className="mb-3 mr-6"
                                    productInfo={product}
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