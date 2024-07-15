import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AlertIcon from '@/components/common/alert/alertIcon';

interface alertProps {
    title?: string,
    message: string;
    alertType: string;
}

export default function AlertDestructive({
    title = '',
    message,
    alertType 
}: alertProps) {
    const alertClass = `alert-destructive flex items-center w-full text-${alertType} border-${alertType}`
    const titleClass = `font-base mb-0 mr-1 text-${alertType}`;

    return (
        message
            ? <Alert className={alertClass} variant='destructive'>
            <AlertIcon className={'mr-1'} alertType={alertType} />
            <AlertTitle className={titleClass}>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
            : ''
    );
}
