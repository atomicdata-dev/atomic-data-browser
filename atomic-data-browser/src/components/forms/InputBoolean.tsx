import React, { useState } from 'react';
import { useBoolean } from '../../../atomic-react/hooks';
import { InputProps } from './ResourceField';
import { ErrMessage, InputStyled } from './InputStyles';

export default function InputBoolean({ resource, property, required }: InputProps): JSX.Element {
  const [value, setValue] = useBoolean(resource, property.subject);
  const [err, setErr] = useState<Error>(null);

  function handleUpdate(e) {
    setValue(e.target.checked, setErr);
  }

  return (
    <>
      <InputStyled type='checkbox' checked={value} onChange={handleUpdate} required={required} />
      {err && <ErrMessage>{err.message}</ErrMessage>}
    </>
  );
}
