import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import productInterface from "@/interface/products"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createProduct, updateProduct, uploadImg } from "@/api/admin/products"

interface modalProps {
    modalTite: string;
    modalDescription?: string;
    modalType?: string;
    createdProductInfo?: productInterface;
    modalTriggerHandler: () => void;
    // productInfo: productInterface;
}

export default function ProductModal({
    modalTite = 'Edit Profile',
    modalDescription = 'Make changes to your profile here. Click save when you\'re done.',
    modalType = '',
    createdProductInfo,
    modalTriggerHandler
}: modalProps) {
    // 新增商品初始化資料
    const initData = {
        title: '',
        category: '',
        origin_price: 100,
        price: 300,
        unit: '',
        description: '',
        content: '',
        is_enabled: 1,
        imageUrl: '',
    }

    const [productInfo, setProductInfo] = useState({...initData});

    // 表單各編輯項目事件處理
    const handleChange = (e: React.SyntheticEvent) => {
        const { value, name, checked } = (e.target as HTMLInputElement);

        let updateValue = null;

        switch (name) {
            case 'price':
            case 'origin_price':
                updateValue = Number(value);
                break;
            case 'is_enabled':
                updateValue = +checked;
                break;
            default:
                updateValue = value;
                break;
        }

        setProductInfo({
            ...productInfo,
            [name]: updateValue,
        });
    };

    // 上傳圖片 , 圖片上傳成功後 , 更新圖片網址
    const handleFileUpload = async (e: React.SyntheticEvent) => {
        const { files = [] } = (e.target as HTMLInputElement);

        console.log('e.target', e.target)

        const formData = new FormData();

        const file = files?.length
            ? files[0]
            : ''; 

        formData.append('file-to-upload', file);

        for (let [key, value] of formData.entries()) {
            console.log('formData', key, value);
        }

        const imgUrlRes = await uploadImg({ returnType: 'async', params: formData});

        const imgUrl = imgUrlRes?.success
            ? imgUrlRes.imageUrl
            : '';

        console.log('imgUrlRes', imgUrlRes);
        
        setProductInfo({
            ...productInfo,
            imageUrl: imgUrl
        })

        console.log('productInfo', productInfo)
    }

    // 觸發新增/編輯商品打開彈窗時，初始化商品資料
    useEffect(() => {
        if (!modalType) return;

        modalType === 'create'
            ? setProductInfo({...initData})
            : setProductInfo(createdProductInfo || initData);
    }, [modalType, createdProductInfo]);

    const createProductHandler = async () => {
        const params = {
            data: productInfo
        }
        const res = await createProduct({ returnType: 'async', params });

        res.success && modalTriggerHandler();
    }

    // 表單送出
    const handleSubmit = () => {
        modalType === 'create'
            ? createProductHandler()
            : null
    };

    return (
        <Dialog open={Boolean(modalType)} onOpenChange={modalTriggerHandler}>
            {/* onInteractOutside 避免點擊overlay 導致彈窗關閉 */}
            <DialogContent
                className="max-w-[720px] max-h-full overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        { modalTite }
                    </DialogTitle>
                    {
                        modalDescription && <DialogDescription>{ modalDescription }</DialogDescription>
                    }
                </DialogHeader>
                <div className="flex md:flex-row md: flex-col-reverse">
                    <div className="flex flex-1 flex-col mr-2">
                        <div className="flex flex-col">
                            <Label htmlFor="imageUrl" className="flex h-8 items-center text-md">
                                圖片網址
                            </Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                value={productInfo.imageUrl}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="imageFile" className="flex h-8 items-center text-md">
                                或 上傳圖片
                            </Label>
                            <Input
                                id="imageFile"
                                name="file-to-upload"
                                className="file:bg-confirm file:text-confirm-foreground file:font-normal"
                                type="file"
                                onChange={handleFileUpload}
                            />
                        </div>
                    </div>
                    <div className="flex flex-2 flex-col">
                        <div className="flex flex-col">
                            <Label htmlFor="title" className="flex h-8 items-center text-md">
                                標題
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={productInfo.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex">
                            <div className="flex-1 pr-2 box-border">
                                <Label htmlFor="category" className="flex h-8 items-center text-md">
                                    分類
                                </Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={productInfo.category}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="unit" className="flex h-8 items-center text-md">
                                    單位
                                </Label>
                                <Input
                                    id="unit"
                                    name="unit"
                                    value={productInfo.unit}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex-1 pr-2 box-border">
                                <Label htmlFor="origin_price" className="flex h-8 items-center text-md">
                                    原價
                                </Label>
                                <Input
                                    id="origin_price"
                                    name="origin_price"
                                    value={productInfo.origin_price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="price" className="flex h-8 items-center text-md">
                                    售價
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    value={productInfo.price}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="description" className="flex h-8 items-center text-md">
                                商品描述
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Type your message here."
                                value={productInfo.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="content" className="flex h-8 items-center text-md">
                                說明內容
                            </Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="Type your message here."
                                value={productInfo.content}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex h-10 items-center">
                            <Checkbox
                                id="is_enabled"
                                name="is_enabled"
                                value={productInfo.is_enabled}
                                onChange={handleChange}
                            />
                            <Label
                                htmlFor="is_enabled"
                                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                是否啟用
                            </Label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="destructive">
                            取消
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit}>儲存</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}



