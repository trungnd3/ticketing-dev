import axios, { AxiosRequestConfig } from 'axios';

interface TUseRequestHook {
  url: string;
  method: 'post' | 'get';
  onSuccess: (data: unknown | undefined) => void | undefined;
  onError: (err: unknown | undefined) => void | undefined;
}

export function useRequest<T>({
  url,
  method,
  onSuccess,
  onError,
}: TUseRequestHook) {
  async function doRequest(body: T & AxiosRequestConfig<T>) {
    try {
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      onError(err);
    }
  }

  return {
    doRequest,
  };
}
