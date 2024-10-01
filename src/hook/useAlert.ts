import { useDispatch } from 'react-redux'
import { addAlert, removeAlert } from '@/redux/common/alertSlice'

function useAlert () {
    const dispatch = useDispatch()

    const alertHandler = (
        alertType: string,
        message: string
    ) => {
        const id = new Date().getTime().toString()
        dispatch(addAlert({ id, alertType, message }))
        setTimeout(() => dispatch(removeAlert(id)), 3000) // 顯示３秒後消失
    }

    return alertHandler
}

export { useAlert }
