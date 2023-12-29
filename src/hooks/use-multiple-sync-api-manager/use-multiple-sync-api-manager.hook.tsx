import { useCallback, useRef, useState } from "react";
import { IUseMultipleSyncApiManager } from "./use-multiple-sync-api-manager.interface";

export function useMultipleSyncApiManager() {
  // const apiItems = props.apiItems;
  const apiItemsRef = useRef<IUseMultipleSyncApiManager.ApiItem[]>();
  const [isFetching, setIsFetching] = useState(false);
  const isFetchingRef = useRef(false);
  const [isFetched, setIsFetched] = useState(false);
  const [completeInfo, setCompleteInfo] = useState<IUseMultipleSyncApiManager.CompleteInfo>();

  const setApiItems = useCallback(function(apiItems: IUseMultipleSyncApiManager.ApiItem[]) {
    apiItemsRef.current = apiItems;
  }, []);

  const fetch = useCallback(async() => {
    if (isFetchingRef.current) return;
    if (apiItemsRef.current === undefined) {
      console.error(`apiItems 가 없습니다.`);
      return;
    }
    if (apiItemsRef.current.length === 0) {
      console.error(`apiItems 데이터가 비어있습니다.`);
      return;
    }
    const apiItems = apiItemsRef.current;

    // apiItemsRef.current = apiItems;
    isFetchingRef.current = true;
    setIsFetching(true);

    const datas: Map<string, any> = new Map();

    const completeApiItems: IUseMultipleSyncApiManager.CompleteApiItem[] = [];

    for (const apiItem of apiItems) {
      const completeApiItem: IUseMultipleSyncApiManager.CompleteApiItem = {
        completeTimestamp: Date.now(),
        data: undefined,
        isSuccess: false,
        key: apiItem.key,
      };

      try {
        const result = await apiItem.fn(datas);
        completeApiItem.isSuccess = true;
        completeApiItem.completeTimestamp = Date.now();
        completeApiItem.data = result;
        datas.set(apiItem.key, result);
      } catch(e) {
        completeApiItem.isSuccess = false;
        completeApiItem.completeTimestamp = Date.now();
        completeApiItem.error = e;
      }

      completeApiItems.push(completeApiItem);
      setIsFetched(true);
      isFetchingRef.current = false;
      setIsFetching(false);
    }

    setCompleteInfo({ apiItems: completeApiItems });
  }, []);

  return {
    setApiItems,
    fetch,
    isFetching,
    isFetched,
    completeInfo,
  };
}