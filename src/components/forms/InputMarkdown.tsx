import React, { useState } from 'react';
import { useString } from '../../atomic-react/hooks';
import { InputProps } from './ResourceField';
import { ErrMessage, InputWrapper, TextAreaStyled } from './InputStyles';
import Yamde from 'yamde';
import { useSettings } from '../../helpers/AppSettings';
import styled from 'styled-components';

export default function InputMarkdown({ resource, property, required, autoFocus }: InputProps): JSX.Element {
  const [value, setVale] = useString(resource, property.subject);
  const [err, setErr] = useState<Error>(null);
  const { darkMode } = useSettings();

  // function handleUpdate(e) {
  //   const newval = e.target.value;
  //   setVale(newval, setErr);
  // }

  return (
    <>
      <InputWrapper>
        <YamdeS value={value} handler={e => setVale(e, setErr)} theme={darkMode ? 'dark' : 'light'} />
        {/* <TextAreaStyled rows={3} value={value == null ? '' : value} onChange={handleUpdate} required={required} autoFocus={autoFocus} /> */}
      </InputWrapper>
      {value !== '' && err && <ErrMessage>{err.message}</ErrMessage>}
      {value == '' && <ErrMessage>Required</ErrMessage>}
    </>
  );
}

const YamdeS = styled(Yamde)`
  margin: 0;
  background: red;
`;
