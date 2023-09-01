import { reqError } from 'api/api';
// import {  } from 'api';
import { getUrl, HOST } from 'api/constants';
import { RequestArguments } from 'api/types';
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { flow, getRoot } from 'mobx-state-tree';
import { AlertArgs, RootInstance, rootStore } from 'models';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

const request = async <T>(
  httpMethod: HttpMethod,
  { method, params, host = HOST, body }: RequestArguments
): Promise<any> => {
  const url = getUrl({ method, params }, host);

  try {
    const response = await axios.request({
      url,
      method: httpMethod,
      data: body,
    });

    return response;
  } catch (error: any) {
    throw new Error(reqError(error));
  }
};

export type RequestActionArgs<T> = {
  onSuccess?: (resp: T) => void;
  onError?: (error: any) => void;
  onNoData?: () => void;
  errorMessage?: string;
  successMessage?: Pick<AlertArgs, 'title' | 'message'> | string;
  noDataMessage?: Pick<AlertArgs, 'title' | 'message'> | string;
  requestArgs: RequestArguments;
  onResponseStatus?: [
    {
      code: number;
      action: () => void;
    }
  ];
};

export const requestAction = flow(function* <T>(
  {
    successMessage,
    requestArgs,
    onSuccess,
    onNoData,
    noDataMessage,
    errorMessage,
    onError,
    onResponseStatus,
  }: RequestActionArgs<T>,
  method: HttpMethod
) {
  const {
    ui: {
      alert: { setAlert },
    },
  } = rootStore;

  try {
    const resp: AxiosResponse<T> = yield request(method, requestArgs);
    if (
      resp.status === 200 ||
      ((method === 'post' || method === 'put') && resp.status === 201)
    ) {
      if (successMessage) {
        let message = '';
        let title = '';
        if (typeof successMessage === 'object') {
          message = successMessage.message || '';
          title = successMessage.title || '';
        } else {
          title = successMessage;
        }
        setAlert({
          type: 'success',
          message,
          title,
        });
      }
      onSuccess && onSuccess(resp.data);
    }
    if (resp.status === 204 && onNoData) {
      if (noDataMessage) {
        let message = '';
        let title = '';
        if (typeof noDataMessage === 'object') {
          message = noDataMessage.message || '';
          title = noDataMessage.title || '';
        } else {
          title = noDataMessage;
        }
        setAlert({
          type: 'warning',
          message,
          title,
        });
      }
      onNoData();
    }

    if (onResponseStatus) {
      onResponseStatus.forEach((el) => {
        if (el.code === resp.status) {
          el.action();
        }
      });
    }
  } catch (error: any) {
    console.error('request error', error);
    setAlert({
      type: 'error',
      title: errorMessage || `Ошибка при получении данных от: ${requestArgs.method}`,
      message: error.message,
    });
    onError && onError(error);
  }
});
