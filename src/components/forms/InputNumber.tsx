import React, { useState } from 'react';
import { useNumber } from '../../atomic-react/hooks';
import { InputProps } from './ResourceField';
import { ErrMessage, InputStyled, InputWrapper } from './InputStyles';

export default function InputNumber({ resource, property, required }: InputProps): JSX.Element {
  const [value, setValue] = useNumber(resource, property.subject);
  const [err, setErr] = useState<Error>(null);

  function handleUpdate(e) {
    if (e.target.value == '') {
      setValue(null);
      return;
    }
    const newval = +e.target.value;
    // I pass the error setter for validation purposes
    setValue(newval, setErr);
  }

  return (
    <>
      <InputWrapper>
        <InputStyled
          placeholder='Enter a number...'
          type='number'
          value={value == null ? NaN : value}
          onChange={handleUpdate}
          required={required}
        />
      </InputWrapper>
      {value !== null && err && <ErrMessage>{err.message}</ErrMessage>}
      {value == null && <ErrMessage>Required</ErrMessage>}
    </>
  );
}
