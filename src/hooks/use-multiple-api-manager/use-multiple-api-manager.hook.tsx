import axios, { Canceler } from "axios";
import { useCallback, useRef, useState } from "react";
import { IUseMultipleApiManager } from "./use-multiple-api-manager.interface";

export function useMultipleApiManager() {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canceledInfo, setCanceledInfo] = useState<{ dataSet: IUseMultipleApiManager.ApiItem[] }>();
  const isLoadingRef = useRef<boolean>(false);
  const [dataSet, setDataSet] = useState<IUseMultipleApiManager.ApiItem[]>();
  const apiItemsNow = useRef<IUseMultipleApiManager.ApiItem[]>([]);
  const axiosCancel = useRef<Canceler>();

  const isComplete = useCallback((apiItems: IUseMultipleApiManager.ApiItem[]) => apiItems.find(x => x.isComplete !== true) === undefined, []);

  const cancel = useCallback(() => {
    if (axiosCancel.current !== undefined) {
      axiosCancel.current();
    }
    setCanceledInfo({ dataSet: apiItemsNow.current });
  }, []);

  const fetch = useCallback((_apiItems: IUseMultipleApiManager.ApiItem[], options?: IUseMultipleApiManager.FetchOptions) => {
    if (isLoadingRef.current) return;
    if (_apiItems.length === 0) return;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axiosCancel.current = source.cancel;
    const axiosInstance = axios.create({
      cancelToken: source.token,
      timeout: 3000,
    });

    isLoadingRef.current = true;
    const apiItems = [..._apiItems];
    setIsLoading(true);

    function disposeAxios(item: IUseMultipleApiManager.ApiItem, index: number) {
      axiosInstance(item.axiosOptions).then((res) => {
        apiItems.forEach(thisItem => {
          if (thisItem.key === item.key) {
            thisItem.isComplete = true;
            thisItem.isSuccess = true;
            thisItem.data = res.data;
          }
        });
        apiItemsNow.current = apiItems;
      }).catch((error) => {
        if (typeof options?.onError === 'function') {
          options.onError(item, error);
        }

        if ((item.retryedCount ?? 0) < item.retryCount) {
          item.retryedCount = (item.retryedCount ?? 0) + 1;
          disposeAxios(item, index);
        } else {
          apiItems.forEach(thisItem => {
            if (thisItem.key === item.key) {
              thisItem.isComplete = true;
              thisItem.isSuccess = false;
            }
          });
        }
        apiItemsNow.current = apiItems;
      }).finally(() => {
        if (isComplete(apiItems)) {
          if (typeof options?.onComplete === 'function') {
            options.onComplete(apiItems);
          }
          isLoadingRef.current = false;
          setIsLoading(false);
          setIsFetched(true);
          setDataSet(apiItems);
        }
      });
    }

    apiItems.forEach((item, index) => {
      if (isNumber(item.initDelay)) {
        setTimeout(() => {
          disposeAxios(item, index);
        }, item.initDelay);
      } else {
        disposeAxios(item, index);
      }
    });
  }, [isComplete]);

  return {
    isFetched,
    isLoading,
    dataSet,
    cancel,
    fetch,
    canceledInfo,
  };
}

function isNumber(value: any): value is number {
  if (typeof value !== 'number') return false;
  if (isNaN(value)) return false;
  return true;
}