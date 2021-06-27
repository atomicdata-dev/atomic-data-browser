import React, { useState } from 'react';
import { useBoolean } from '@tomic/react';
import { InputProps } from './ResourceField';
import { ErrMessage, InputStyled } from './InputStyles';

export default function InputBoolean({ resource, property, ...props }: InputProps): JSX.Element {
  const [value, setValue] = useBoolean(resource, property.subject);
  const [err, setErr] = useState<Error>(null);

  function handleUpdate(e) {
    setValue(e.target.checked, setErr);
  }

  return (
    <>
      <InputStyled type='checkbox' checked={value} onChange={handleUpdate} {...props} />
      {err && <ErrMessage>{err.message}</ErrMessage>}
    </>
  );
}
