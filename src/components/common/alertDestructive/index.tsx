import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import AlertIcon from '@/components/common/alertDestructive/alertIcon'
import { Cross1Icon } from '@radix-ui/react-icons'
import { removeAlert } from '@/redux/common/alertSlice'
import { useDispatch } from 'react-redux'

/**
 * @params alertType: 'success' | 'error' | 'warning'
 */

export interface alertProps {
    id: string
    title?: string,
    message: string;
    alertType: string;
    className?: string
}

export default function AlertDestructive ({
    id = '',
    title = '',
    message,
    alertType,
    className = ''
}: alertProps) {
    const dispatch = useDispatch()
    const alertClass = `alert-destructive relative rounded-none flex items-center w-full bg-${alertType}-secondary  border-${alertType} ${className}`
    const titleClass = `font-base mb-0 mr-1 text-${alertType}-secondary-foreground`
    const descriptionClass = `text-xl text-${alertType}-secondary-foreground`

    const deleteAlert = () => {
        dispatch(removeAlert(id))
    }

    return (
        message
            ? <Alert className={alertClass} variant='destructive'>
                <div className="close-alert absolute top-2 right-3 cursor-pointer  hover:scale-110" onClick={deleteAlert}>
                    <Cross1Icon className={`text-${alertType}`}/>
                </div>
                <AlertIcon className={'mr-1'} alertType={alertType} />
                <AlertTitle className={titleClass}>{title}</AlertTitle>
                <AlertDescription className={descriptionClass}>{message}</AlertDescription>
            </Alert>
            : ''
    )
}
