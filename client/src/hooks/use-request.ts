import axios, { AxiosRequestConfig } from 'axios';

interface TUseRequestHook<K> {
  url: string;
  method: 'post' | 'get';
  onSuccess: (data: K) => void;
  onError: (err: unknown | undefined) => void | undefined;
}

export function useRequest<T, K>({
  url,
  method,
  onSuccess,
  onError,
}: TUseRequestHook<K>) {
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
