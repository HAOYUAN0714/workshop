import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        (async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/v2/api/${import.meta.env.VITE_API_PATH}/product/all`)
            const data = await response.json()
        })()
    }, [])

    return (
        <>

        </>
    )
}

export default App
