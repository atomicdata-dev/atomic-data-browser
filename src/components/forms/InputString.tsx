import React, { useState } from 'react';
import { useString } from '../../lib/react';
import { ErrMessage, InputProps, InputStyled, InputWrapper } from './Field';

export default function InputString({ resource, property, required }: InputProps): JSX.Element {
  const [value, setVale] = useString(resource, property.subject);
  const [err, setErr] = useState<Error>(null);

  function handleUpdate(e) {
    const newval = e.target.value;
    // I pass the error setter for validation purposes
    setVale(newval, setErr);
  }

  return (
    <>
      <InputWrapper>
        <InputStyled value={value == null ? '' : value} onChange={handleUpdate} required={required} />
      </InputWrapper>
      {value !== '' && err && <ErrMessage>{err.message}</ErrMessage>}
      {value == '' && <ErrMessage>Required</ErrMessage>}
    </>
  );
}
