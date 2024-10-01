interface User {
    username: string;
    password: string;
}

export function login (params: User): Promise<void> {
    const { username, password } = params

    return (async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/v2/admin/signin`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            }
        )

        const data = await response.json()

        const { token, expired } = data

        if (!token || !data.success) {
            return Promise.reject(data)
        }

        document.cookie = `hexToken=${token};expires=${new Date(expired)}`

        return Promise.resolve(data)
    })()
}

export function logout (): Promise<void> {
    return (async () => {
        await fetch(
            `${import.meta.env.VITE_API_URL}/v2/logout`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        document.cookie = 'hexToken=;'

        return Promise.resolve()
    })()
}

export async function checkIsLogin (): Promise<void> {
    const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('hexToken='))
        ?.split('=')[1] || ''

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v2/api/user/check`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        }
    )

    const data = await response.json()

    const { success = false } = data

    if (!success) document.cookie = 'hexToken=;'

    return success
}
