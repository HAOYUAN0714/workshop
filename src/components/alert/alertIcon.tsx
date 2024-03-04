import {
    ExclamationTriangleIcon,
    CheckIcon,
    Cross2Icon,
} from '@radix-ui/react-icons';

export default function AlertIcon({ alertType, className }: {  alertType: string, className: string}) {
    const getIcon = () => {
        switch (alertType) {
        case 'error':
            return (
                <ExclamationTriangleIcon className='h-4 w-4' />
            );
        case 'warning':
            return (<ExclamationTriangleIcon className='h-4 w-4' style={{ color: '#f0ed00' }}/>
            );
        case 'success':
            return <CheckIcon className='h-4 w-4' />;
        case 'fail':
            return <Cross2Icon className='h-4 w-4' />;
        default:
            return '';
        }
    };

    return <div className={`${className} alert-icon`}>{getIcon()}</div>;
}
