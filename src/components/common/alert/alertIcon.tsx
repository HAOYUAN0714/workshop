import {
    ExclamationTriangleIcon,
    CheckIcon,
} from '@radix-ui/react-icons';

export default function AlertIcon({ alertType, className }: {  alertType: string, className: string}) {
    const iconClassName = `h-4 w-4 text-${alertType}`;

    const getIcon = () => {
        switch (alertType) {
        case 'error':
            return (
                <ExclamationTriangleIcon className={iconClassName} />
            );
        case 'warning':
            return (<ExclamationTriangleIcon className={iconClassName} />
            );
        case 'success':
            return <CheckIcon className={iconClassName} />;
        default:
            return '';
        }
    };

    return <div className={`${className} alert-icon`}>{getIcon()}</div>;
}
