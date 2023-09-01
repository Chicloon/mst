import { TableSearch, TextField } from '@pcapcc360/react-ui';
import React, { ChangeEvent } from 'react';

const InputField: React.FC<{
  placeholder: string;
  value: string;
  onChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearHandler: () => void;
}> = ({ placeholder, value, onChangeHandler, onClearHandler }) => {
  return (
    <TextField
      key={'123'}
      placeholder={placeholder}
      value={value}
      onChange={onChangeHandler}
      //   onClearHandler={onClearHandler}
    />
  );
};

export default InputField;
