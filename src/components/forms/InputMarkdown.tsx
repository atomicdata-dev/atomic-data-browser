import React, { useState } from 'react';
import { useString } from '../../atomic-react/hooks';
import { InputProps } from './ResourceField';
import { ErrMessage, InputWrapper, TextAreaStyled } from './InputStyles';

export default function InputMarkdown({ resource, property, required, autoFocus }: InputProps): JSX.Element {
  const [value, setVale] = useString(resource, property.subject);
  const [err, setErr] = useState<Error>(null);

  function handleUpdate(e) {
    const newval = e.target.value;
    setVale(newval, setErr);
  }

  return (
    <>
      <InputWrapper>
        <TextAreaStyled rows={3} value={value == null ? '' : value} onChange={handleUpdate} required={required} autoFocus={autoFocus} />
      </InputWrapper>
      {value !== '' && err && <ErrMessage>{err.message}</ErrMessage>}
      {value == '' && <ErrMessage>Required</ErrMessage>}
    </>
  );
}
