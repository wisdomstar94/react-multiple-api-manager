"use client"

import { useMultipleApiManager } from "@/hooks/use-multiple-api-manager/use-multiple-api-manager.hook";
import { useCallback, useEffect } from "react";

export default function Page() {
  const multipleApiManager = useMultipleApiManager();

  const tryFetch = useCallback(() => {
    multipleApiManager.fetch([
      { key: '1', initDelay: 3000, axiosOptions: { method: 'get', url: 'https://cdn.pixabay.com/photo/2023/05/29/16/55/pie-8026562_640.jpg', responseType: 'blob' }, retryCount: 2, },
      { key: '2', axiosOptions: { method: 'get', url: 'https://cdn.pixabay.com/photo/2023/06/01/06/22/british-shorthair-8032816_640.jpg', responseType: 'blob' }, retryCount: 2, },
      { key: '3', axiosOptions: { method: 'get', url: 'https://cdn.pixabay.com/photo/2023/05/14/09/39/circle-7992340__340.jpg', responseType: 'blob' }, retryCount: 2, },
      { key: '4', initDelay: 6000, axiosOptions: { method: 'get', url: 'https://cdn.pixabay.com/photo/2023/05/31/11/15/fish-8031138__340.jpg', responseType: 'blob' }, retryCount: 2, },
      { key: '5', axiosOptions: { method: 'get', url: 'https://cdn.pixabay.com/photo/2023/05/20/15/03/moon-8006703__340.jpg', responseType: 'blob' }, retryCount: 2, },
    ], {
      onComplete(apiItems) {
        console.log('@@onComplete.apiItems', apiItems);
      },
    });
  }, [multipleApiManager]);

  useEffect(() => {
    console.log('multipleApiManager.dataSet', multipleApiManager.dataSet);
  }, [multipleApiManager.dataSet]);

  return (
    <>
      <button className="px-4 py-1 text-sm cursor-pointer hover:bg-slate-100" onClick={tryFetch}>
        multiple go!
      </button>
      <div>
        console 창과 network 창을 확인해보세요!
      </div>
    </>
  );
}
