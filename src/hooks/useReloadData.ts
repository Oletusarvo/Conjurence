import axios from 'axios';
import { useAbortSignal } from './useAbortController';
import { debounce } from '@/util/network/debounce';

export function useReloadData<T>(
  url: string,
  setter: (data: T) => void,
  debounceDelay: number = 200
) {
  const getSignal = useAbortSignal();
  const reloadData = async () => {
    const signal = getSignal();
    try {
      const res = await axios.get(url, { signal });
      if (res.status === 200) {
        setter(res.data);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return debounce(reloadData, debounceDelay);
}
