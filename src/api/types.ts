export type RequestArguments = {
  method: string;
  params?:
    | {
        [key: string]: number | string | null | undefined | boolean;
      }
    | string;
  body?: any;
  host?: string;
  headers?: { [key: string]: string };
};
