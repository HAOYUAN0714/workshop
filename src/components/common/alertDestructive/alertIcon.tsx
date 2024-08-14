import {
    ExclamationTriangleIcon,
    CrossCircledIcon,
    CheckCircledIcon,
} from '@radix-ui/react-icons';

export default function AlertIcon({ alertType, className }: {  alertType: string, className: string}) {
    const iconClassName = `h-8 w-8 text-${alertType}`;

    const getIcon = () => {
        switch (alertType) {
        case 'error':
            return (
                <CrossCircledIcon className={iconClassName} />
            );
        case 'warning':
            return (<ExclamationTriangleIcon className={iconClassName} />
            );
        case 'success':
            return <CheckCircledIcon className={iconClassName} />;
        default:
            return '';
        }
    };

    return <div className={`${className} alert-icon`}>{getIcon()}</div>;
}
