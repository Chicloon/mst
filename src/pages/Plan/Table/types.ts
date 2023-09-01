export type Cell<T> = (item: T, accessor: string, rowIdx?: number) => JSX.Element;

export type ColumnItem<T> = {
  id?: string;
  Header: string | (() => JSX.Element);
  sticky?: string;
  width: number;
  minWidth: number;
  accessor: string;
  customHeaderCellClass?: string;
  customPlaceholderCellClass?: string;
  Cell: Cell<T>;
  columns: ColumnItem<T>[];

  disableResizing?: boolean;
  removeHeadCellClasses?: boolean;
  align?: string;
  static?: boolean;
};

export type Header = {
  data: {
    [key: string]: any;
  };
  showXO: boolean;
} | null;

export type TableProps<T> = {
  items: T[];
  columns: ColumnItem<T>[];
};
