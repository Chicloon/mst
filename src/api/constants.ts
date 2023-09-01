import { RequestArguments } from './types';

// Использование моковых данных
// export const useMock = true;
export const useMock = false;

const modulePath = '/skm';
export const BASE_URL = '/plan_skm';
export const REMOTE = '__HOST_URI__/__BASENAME__/__PLANAIR_LOCATION__/plan' + modulePath;
export const LOCAL = `http://localhost:8787/plan${modulePath}`;

export const HOST = window.location.hostname === 'localhost' ? LOCAL : REMOTE;

export const getUrl = ({ method, params }: RequestArguments, host: string) => {
  const searchParams = params
    ? typeof params === 'string'
      ? params
      : Object.entries(params).reduce((result, entry) => {
          const connector = result === '' ? '?' : '&';
          const key = entry[0];
          let value = entry[1];
          if (value === undefined) {
            value = '';
          }
          if (value === null) {
            value = 'null';
          }
          return `${result}${connector}${key}=${value.toString()}`;
        }, '')
    : '';
  return `${useMock ? '' : host}/${method}${searchParams}`;
};

export const networkErrorMessage = 'Нет связи с сервером';
