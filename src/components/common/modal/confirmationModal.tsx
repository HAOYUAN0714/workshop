import {  useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"

type confirmOption = {
    needConfirm?: boolean;
    confirmTitle?: string;
    confirmHandler?: () => void;
}

type cancelOption = {
    needCancel?: boolean;
    cancelTitle?: string;
    cancelHandler?: () => void;
}

interface modalProps {
    modalTite: string;
    modalDescription?: string;
    modalType?: string;
    modalTriggerHandler: () => void;
    confirmOption?: confirmOption;
    cancelOption?: cancelOption;
}

export default function ProductModal({
    modalTite = 'Edit Profile',
    modalDescription = 'Make changes to your profile here. Click save when you\'re done.',
    modalType = '',
    modalTriggerHandler,
    confirmOption = { needConfirm: true, confirmTitle: '儲存', confirmHandler: () => {} },
    cancelOption = { needCancel: true, cancelTitle: '取消', cancelHandler: () => {} },
}: modalProps) {
    const { needConfirm, confirmTitle, confirmHandler } = confirmOption;
    const { needCancel, cancelTitle, cancelHandler } = cancelOption;

    const ConfirmBtn = () => {
        return needConfirm
            ? <Button className="mr-2" type="submit" onClick={confirmHandler}>{ confirmTitle }</Button>
            : '';
    };

    const CancelBtn = () => {
        return needCancel
            ? <DialogClose asChild>
                <Button type="button" variant="destructive" onClick={cancelHandler}>
                    { cancelTitle }
                </Button>
            </DialogClose>
            : '';
    };

    const FooterDom = () => {
        return needConfirm || needCancel
            ?   <DialogFooter>
                    { ConfirmBtn() }
                    { CancelBtn() }
            </DialogFooter>
            : '';
    }

    // 觸發 新增/編輯 商品打開彈窗時，初始化商品資料
    useEffect(() => {

    }, [modalType]);

    return (
        <Dialog open={Boolean(modalType)} onOpenChange={modalTriggerHandler}>
            {/* onInteractOutside 避免點擊overlay 導致彈窗關閉 */}
            <DialogContent
                className="max-w-[360px] max-h-full overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        { modalTite }
                    </DialogTitle>
                    { modalDescription && <DialogDescription>{ modalDescription }</DialogDescription> }
                </DialogHeader>
                { FooterDom() }
            </DialogContent>
        </Dialog>
    )
}
