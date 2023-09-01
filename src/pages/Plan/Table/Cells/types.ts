import { PlanItemInstance } from 'models';

export type CellProps<T> = {
  data: T;
  accessor: keyof PlanItemInstance;
  rowIdx?: number;
  showHint?: boolean;
  width?: number;
  onCellScroll?: (rowIdx: number, accessor: string) => void;
};
