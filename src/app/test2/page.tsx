"use client"

import { useMultipleSyncApiManager } from "@/hooks/use-multiple-sync-api-manager/use-multiple-sync-api-manager.hook";
import { IUseMultipleSyncApiManager } from "@/hooks/use-multiple-sync-api-manager/use-multiple-sync-api-manager.interface";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const multipleSyncApiManager = useMultipleSyncApiManager();

  multipleSyncApiManager.setApiItems([
    {
      key: 'api1' as const,
      fn: function(datas) {
        return axios.get(`https://dummyjson.com/products/1`).then(res => res.data);
      },
    },
    {
      key: 'api2' as const,
      fn: function(datas) {
        const api1Data = datas.get('api1');
        console.log('@api1Data', api1Data);
        return axios.get(`https://dummyjson.com/products/2`, { params: { prev_title: api1Data.title } }).then(res => res.data);
      },
    },
    {
      key: 'api3' as const,
      fn: function(datas) {
        const api2Data = datas.get('api2');
        console.log('@api2Data', api2Data);
        return axios.get(`https://dummyjson.com/products/3`, { params: { prev_title: api2Data.title } }).then(res => res.data);
      },
    },
  ]);

  useEffect(() => {
    if (multipleSyncApiManager.completeInfo === undefined) return;
    console.log('@multipleSyncApiManager.completeInfo', multipleSyncApiManager.completeInfo);
  }, [multipleSyncApiManager.completeInfo]);

  return (
    <>
      <button className="px-4 py-1 text-sm cursor-pointer hover:bg-slate-100" onClick={() => {
        multipleSyncApiManager.fetch();
      }}>
        multiple go!
      </button>
      <div>
        console 창과 network 창을 확인해보세요!
      </div>
    </>
  );
}
