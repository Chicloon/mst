import { FilterInstance } from '../../models/Filter';
import { StylesConfig, OptionTypeBase, Props } from 'react-select';
import { NamedProps } from 'react-select/src/Select';
import { NewSelectProps } from '@pcapcc360/react-ui/build/components/newSelect/types';

export type FilterProps = {
  filterModel: FilterInstance;
  wrapperClass?: string;
  placeholder?: string;
  helperText?: string;
} & NewSelectProps;

export type NewSelectItem = { label: string; value: string; isDisabled?: boolean };
