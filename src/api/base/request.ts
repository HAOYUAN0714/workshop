// 顯示axios 返回的資料
// interface BaseResponse {
//   code: string;
//   message: string;
//   data: { [x: string]: any }[] | { [x: string]: any };
// }

// 目前後端資料格式尚未修正為BaseResponse格式, 所以先開後門允許string
// interface Error<_T> {
//   message: string;
//   status: number;
//   data: BaseResponse | string;
// }

interface optionProps {
  params?: RequestInit;
  path?: string;
}

// export async function fetch(url: string, options?: RequestInit): Promise<Response> {
//   const response = await fetch(url, options);
//   return response;
// }


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

export const fetchFunc = (url: string, method: string, options: optionProps = {}) => {
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

// const instance = axios.create({
//     // 基本設定
//     baseURL: `${import.meta.env.VITE_API_URL}/v2/api/${import.meta.env.VITE_API_PATH}/`,
//     timeout: 10000,
//     headers: {
//         "Content-type": "application/json",
//         Authorization: 'Bearer {token}'
//     },
// });

// instance.interceptors.request.use(
//     (config) => {
//     // cookie 設定
//         config.headers = new AxiosHeaders({
//             Authorization: localStorage.getItem('token'),
//         });
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// instance.interceptors.response.use(
//     (response) => {
//     // const hasDisposition = response.request.getResponseHeader(
//     //   "Content-Disposition"
//     // );
//     // if (hasDisposition && hasDisposition.indexOf("utf-8''") > -1) {
//     //   const data = response.data;
//     //   data.fileName = decodeURIComponent(
//     //     hasDisposition.split("utf-8''")[1].split(".")[0]
//     //   );
//     //   return data;
//     // }

//         return response.data;
//     },
//     (error) => {
//     // const { status, data } = error.response;
//     // const responseErrorData: Error<object> = {
//     //   message: error.message,
//     //   status,
//     //   data,
//     // };
//         return Promise.reject('error');
//     }
// );




export default asyncFetch;