import { AxiosRequestConfig } from "axios";

export declare namespace IUseMultipleSyncApiManager {
  export interface ApiItem {
    key: string;
    fn: (datas: Map<string, any>) => Promise<any>;
  }

  export interface CompleteApiItem {
    key: string;
    data: any;
    completeTimestamp: number;
    isSuccess: boolean;
    error?: any;
  }

  export interface CompleteInfo {
    apiItems: CompleteApiItem[];
  }

  export interface Props {
    // apiItems?: ApiItem<T>[];
  }
}