import { useState, useEffect } from "react"
import { useDispatch } from 'react-redux'
import { set, useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import ConfirmModal from "@/components/common/modal/confirmationModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import productInterface from "@/interface/products"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createProduct, updateProduct, uploadImg, deleteProduct } from "@/api/admin/products"
import { addLoading, removeLoading } from '@/redux/common/loadingSlice';

type modalProductInterface = Partial<productInterface>;

interface modalProps {
    productId?: string;
    modalTite: string;
    modalDescription?: string;
    modalType?: string;
    createdProductInfo?: modalProductInterface;
    modalTriggerHandler: () => void;
    updateProductList: () => void;
    updateCategoryList: () => void;
    alertHandler: (alertType: string, message: string) => void;
    categoryList: string[];
}

export default function ProductModal({
    modalTite = 'Edit Profile',
    modalDescription = 'Make changes to your profile here. Click save when you\'re done.',
    modalType = '',
    createdProductInfo,
    modalTriggerHandler,
    updateProductList,
    updateCategoryList,
    alertHandler,
    categoryList,
}: modalProps) {
    const dispatch = useDispatch();
    // 新增商品初始化資料
    const initProduct = {
        title: '',
        category: '',
        origin_price: 300,
        price: 200,
        unit: '',
        description: '',
        content: '',
        imageUrl: '',
        is_enabled: false ,
        new_category: '', // 新增分類 , 非 api 參數
        enable_new_category: false, // 是否使用新增分類 , 非 api 參數
    };

    const [productInfo, setProductInfo] = useState({...initProduct});

    const form = useForm({
        defaultValues: { ...initProduct },
        values: productInfo,
    });

    // 觸發 新增/編輯 商品打開彈窗時，初始化商品資料
    useEffect(() => {
        modalType === 'edit'
            ? setProductInfo({
                ...initProduct,
                ...createdProductInfo,
                is_enabled: Boolean(createdProductInfo?.is_enabled),
                new_category: '',
                enable_new_category: false,
            })
            : setProductInfo({...initProduct});
    }, [modalType]);  

    // 表單各編輯項目事件處理
    const handleChange = (e: React.SyntheticEvent) => {
        const { value, name } = (e.target as HTMLInputElement);
        console.log('handleChange', value, name);
        // 分類優先使用自訂分類的值
        setProductInfo({
            ...productInfo,
            [name]: name === 'price' || name === 'origin_price'
                ? Number(value)
                : value,
        });
    };
    // 表單各編輯項目事件處理
    const handleSelect = (selectValue: string) => {
        console.log('handleSelect', selectValue);
        // 分類優先使用自訂分類的值
        setProductInfo({
            ...productInfo,
            category: selectValue,
        });
    };

    const checkNewCategory = (checked: boolean) => {
        setProductInfo({
            ...productInfo,
            enable_new_category: checked,
        });
    }

    const checkProductEnabled = (checked: boolean) => {
        setProductInfo({
            ...productInfo,
            is_enabled: checked,
        });
    }

    // 上傳圖片 , 圖片上傳成功後 , 更新圖片網址
    const handleFileUpload = async (e: React.SyntheticEvent) => {
        const loadingKey = new Date().getTime().toString();
        dispatch(addLoading(loadingKey));

        const { files = [] } = (e.target as HTMLInputElement);

        const formData = new FormData();

        const file = files?.length
            ? files[0]
            : ''; 

        formData.append('file-to-upload', file);

        const imgUrlRes = await uploadImg({ params: formData});

        const imgUrl = imgUrlRes?.success
            ? imgUrlRes.imageUrl
            : '';

        setProductInfo({
            ...productInfo,
            imageUrl: imgUrl
        })

        dispatch(removeLoading(loadingKey));
    }

    // 表單送出 , 新增/編輯商品
    const onSubmit = async() => {
        const loadingKey = new Date().getTime().toString();
        dispatch(addLoading(loadingKey));

        const { enable_new_category: enableNewCategory, new_category,  ...apiParams} = productInfo;

        console.log('productInfo', productInfo)

        const productParams = {
            data: {
                ...apiParams,
                category: enableNewCategory
                    ? new_category
                    : apiParams.category
            }
        };
        
        let res = null;

        switch (modalType) {
            case 'create':
                res = await createProduct({ params: productParams });
                break;
            case 'delete':
                res = await deleteProduct({ path: createdProductInfo?.id });
                break;
            default:
                res = await updateProduct({ params: productParams, path: createdProductInfo?.id });
                break;
        }

        if (res.success) {
            await updateProductList();
            enableNewCategory && await updateCategoryList();
            modalTriggerHandler();
        }
        dispatch(removeLoading(loadingKey));

        alertHandler(res.success ? 'success' : 'error', res.message);
    };

    return (
        modalType === 'delete'
            ? <ConfirmModal
                modalTite={'確認刪除商品?'}
                modalType={modalType}
                modalTriggerHandler={modalTriggerHandler}
                confirmOption={{
                    needConfirm: true,
                    confirmTitle: '確認',
                    confirmHandler: () => onSubmit()
                }}
                cancelOption={{
                    needCancel: true,
                    cancelTitle: '取消',
                    cancelHandler: () => modalTriggerHandler()
                }}
            />
            : <Dialog open={Boolean(modalType)} onOpenChange={modalTriggerHandler}>
            {/* onInteractOutside 避免點擊overlay 導致彈窗關閉 */}
            <DialogContent
                className="max-w-[720px] max-h-full overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        { modalTite }
                    </DialogTitle>
                    { modalDescription && <DialogDescription>{ modalDescription }</DialogDescription> }
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full space-y-8 pt-5' >
                        <div className="flex">
                            <div className="flex flex-2 flex-col mr-2">
                                <FormField
                                    control={form.control}
                                    name='imageUrl'
                                    render={({}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel htmlFor="imageUrl" className="flex h-8 items-center text-md">圖片網址</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="imageUrl"
                                                    name="imageUrl"
                                                    value={productInfo.imageUrl}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='imageUrl'
                                    render={({}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel htmlFor="imageFile" className="flex h-8 items-center text-md">或 上傳圖片</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="imageFile"
                                                    name="file-to-upload"
                                                    className="file:bg-confirm file:text-confirm-foreground file:font-normal"
                                                    type="file"
                                                    onChange={handleFileUpload}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-3 flex-col">
                                <FormField
                                    control={form.control}
                                    name='title'
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel htmlFor="title" className="flex h-8 items-center text-md">標題</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-col">
                                    <FormField
                                        control={form.control}
                                        name='enable_new_category'
                                        render={({ field }) => (
                                            <FormItem className="space-y-0 flex h-10 items-center">
                                                <FormLabel className="flex h-8 items-center text-md mr-2">分類</FormLabel>
                                                <FormControl>
                                                    <Checkbox
                                                        id="enable_new_category"
                                                        checked={field.value}
                                                        onCheckedChange={checkNewCategory}
                                                    />
                                                </FormControl>
                                                <FormLabel
                                                    htmlFor="enable_new_category"
                                                    className="ml-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    使用並輸入新分類
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='category'
                                        render={({ field }) => (
                                            <FormItem className={`flex-1 pr-2 box-border ${productInfo.enable_new_category && 'hidden'}`}>
                                                <Select onValueChange={handleSelect} defaultValue={field.value} >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="選擇分類" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        { categoryList.map((category) => {
                                                            return (
                                                                <SelectItem value={category} key={category}>{category}</SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='new_category'
                                        render={({ field }) => (
                                            <FormItem className={`flex-1 pr-2 box-border ${!productInfo.enable_new_category && 'hidden'}`}>
                                                <FormControl>
                                                    <Input
                                                        id="new_category"
                                                        {...field}
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex">
                                    <FormField
                                        control={form.control}
                                        name='origin_price'
                                        render={({ field }) => (
                                            <FormItem className="flex-1 pr-2">
                                                <FormLabel htmlFor="origin_price" className="flex h-8 items-center text-md">原價</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="origin_price"
                                                        {...field}
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='price'
                                        render={({ field }) => (
                                            <FormItem className="flex-1 pr-2">
                                                <FormLabel htmlFor="origin_price" className="flex h-8 items-center text-md">售價</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="price"
                                                        {...field}
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='unit'
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel htmlFor="unit" className="flex h-8 items-center text-md">單位</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="unit"
                                                        {...field}
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name='description'
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel htmlFor="description" className="flex h-8 items-center text-md">商品描述</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Type your message here."
                                                    {...field}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='content'
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel htmlFor="content" className="flex h-8 items-center text-md">說明內容</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    id="content"
                                                    placeholder="Type your message here."
                                                    {...field}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='is_enabled'
                                    render={({ field }) => (
                                        <FormItem className="space-y-0 flex h-10 items-center">
                                            <FormControl>
                                                <Checkbox
                                                    id="is_enabled"
                                                    checked={field.value}
                                                    onCheckedChange={checkProductEnabled}
                                                />
                                            </FormControl>
                                            <FormLabel
                                                htmlFor="is_enabled"
                                                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                是否啟用
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button className="mr-2" type="submit" >儲存</Button>
                            <DialogClose asChild>
                                <Button type="button" variant="destructive">
                                    取消
                                </Button>
                            </DialogClose>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
