export interface optionProps {
  params?: {};
  path?: string;
  returnType?: 'async' | 'promise';
  isFormData?: boolean;
}

// 整理請求資料
const getRequestInfo = (url: string, method: string, options: optionProps) => {
    const { params = null, path = '', isFormData = false } = options;
    const baseUrl = `${import.meta.env.VITE_API_URL}/v2/api/${import.meta.env.VITE_API_PATH}/${url}/${path}`

    // Get 參數要放到 url ? 後面
    const apiUrl = method === 'GET' && params
        ? baseUrl+ '?' + new URLSearchParams(params as Record<string, string>).toString()
        : baseUrl

    // 方法 header
    const fetchOptions: RequestInit | undefined = {
        method,
        headers: {
            // 解析 cookie token
            Authorization: document.cookie
                .split('; ')
                .find((row) => row.startsWith('hexToken='))
                ?.split('=')[1] || '',
            ...(!isFormData && { 'Content-Type':'application/json' }), // 如果是表單上傳，不能設定 Content-Type
        },
    }
    
    // 如果不是GET方法，則將請求參數加入body , 沒有參數就不加 body
    if (method !== 'GET' && params) {
        fetchOptions.body = isFormData
            ? params as FormData
            : JSON.stringify(params);
    }

    return { apiUrl, fetchOptions }
}

// 依照 returnType 回傳 fetch 格式
const requestFn = (url: string, method: string, options: optionProps = {}) =>  {
    // const dispatch = useDispatch();
    const { returnType = 'async' } = options;
    const { apiUrl, fetchOptions } = getRequestInfo(url, method, options);

    // 回傳 await aync 格式的 fetch
    if (returnType === 'async') {
        return (async () => {
            try {
                const response = await fetch(apiUrl, fetchOptions);
                
                if (!response.ok) {
                    throw new Error(`${method} ${apiUrl} : response error`);
                }

                return response.json();
            } catch (error) {
                console.error('requestFn error', error);
                
                return new Error(`${method} ${apiUrl} , error: ${error}`);
            }
        })();
    }

    // 回傳 promise 格式的 fetch
    return fetch(apiUrl, fetchOptions);
}

export default requestFn;
