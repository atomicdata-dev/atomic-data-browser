import React, { useState } from 'react';
import { useString } from '@tomic/react';
import { InputProps } from './ResourceField';
import { ErrMessage, InputStyled, InputWrapper } from './InputStyles';

export default function InputString({
  resource,
  property,
  ...props
}: InputProps): JSX.Element {
  const [err, setErr] = useState<Error>(null);
  const [value, setVale] = useString(resource, property.subject, {
    handleValidationError: setErr,
  });

  function handleUpdate(e) {
    const newval = e.target.value;
    // I pass the error setter for validation purposes
    setVale(newval);
  }

  return (
    <>
      <InputWrapper>
        <InputStyled
          value={value == undefined ? '' : value}
          onChange={handleUpdate}
          {...props}
        />
      </InputWrapper>
      {value !== '' && err && <ErrMessage>{err.message}</ErrMessage>}
      {value == '' && <ErrMessage>Required</ErrMessage>}
    </>
  );
}
