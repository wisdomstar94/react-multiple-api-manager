import { AxiosRequestConfig } from "axios";

export declare namespace IUseMultipleApiManager {
  export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

  export interface ApiItem {
    key: string;
    axiosOptions: AxiosRequestConfig<any>;
    retryCount: number;
    initDelay?: number;
    retryedCount?: number;
    isComplete?: boolean;
    isSuccess?: boolean;
    data?: any;
  }

  export interface FetchOptions {
    onComplete?: (apiItems: IUseMultipleApiManager.ApiItem[]) => void;
    onError?: (targetApiItem: IUseMultipleApiManager.ApiItem, error: any) => void;
  }

  export interface Props {
    
  }
}