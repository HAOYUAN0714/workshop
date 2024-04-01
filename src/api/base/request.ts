export interface optionProps {
  params?: RequestInit;
  path?: string;
  returnType?: 'async' | 'promist';
}

// 回傳 await aync 格式的 fetch
const asyncFetch = async (url: string, method: string, options: optionProps = {}) => {
    const { params = null, path = '' } = options;

    const baseUrl = `${import.meta.env.VITE_API_URL}/v2/api/${import.meta.env.VITE_API_PATH}/${url}/${path}`

    // Get 參數要放到 url ? 後面
    const apiUrl = method === 'GET' && params
        ? baseUrl+ '?' + new URLSearchParams(params as Record<string, string>).toString()
        : baseUrl

    // 解析 cookie token
    const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('hexToken='))
        ?.split('=')[1] || '';
    // 方法 header
    const fetchOptions: RequestInit | undefined = {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
    }
    // 如果不是GET方法，則加入body
    if (method !== 'GET') {
        fetchOptions.body = JSON.stringify(params);
    }

    try {
        const response = await fetch(apiUrl, fetchOptions);

        if (!response.ok) {
            throw new Error(`${method} ${apiUrl} : response error`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// 回傳 promise 格式的 fetch
const promiseFetch = (url: string, method: string, options: optionProps = {}) => {
    const { params = null, path = '' } = options;

    const apiUrl = `${import.meta.env.VITE_API_URL}/v2/api/${import.meta.env.VITE_API_PATH}/${url}/${path}`

    // 解析 cookie token
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1] || '';

    return fetch(apiUrl, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(params)
    });

}

// 依照 returnType 回傳 fetch 格式
const fetchFunc = (url: string, method: string, options: optionProps = {}) =>  {
    const { returnType = 'async' } = options;

    return  returnType === 'async'
        ? asyncFetch(url, method, options)
        : promiseFetch(url, method, options)
}

export default fetchFunc;
