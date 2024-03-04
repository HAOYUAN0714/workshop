import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AlertIcon from '@/components/alert/alertIcon';

interface alertProps {
    message: string;
    alertType: string;
}

export default function AlertDestructive({ message, alertType }: alertProps) {
    return (
        <Alert className='alert-destructive flex items-center w-full' variant='destructive'>
            <AlertIcon className={'mr-1'} alertType={alertType} />
            <AlertTitle className='mr-1 font-base mb-0'>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
