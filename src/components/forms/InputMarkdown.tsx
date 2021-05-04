import React, { useState } from 'react';
import { useString } from '../../atomic-react/hooks';
import { InputProps } from './ResourceField';
import { ErrMessage, InputWrapper } from './InputStyles';
import Yamde from 'yamde';
import { useSettings } from '../../helpers/AppSettings';
import styled from 'styled-components';

export default function InputMarkdown({ resource, property }: InputProps): JSX.Element {
  const [value, setVale] = useString(resource, property.subject);
  const [err, setErr] = useState<Error>(null);
  const { darkMode } = useSettings();

  return (
    <>
      <InputWrapper>
        <YamdeStyling>
          <Yamde value={value} handler={e => setVale(e, setErr)} theme={darkMode ? 'dark' : 'light'} />
        </YamdeStyling>
        {/* <TextAreaStyled rows={3} value={value == null ? '' : value} onChange={handleUpdate} required={required} autoFocus={autoFocus} /> */}
      </InputWrapper>
      {value !== '' && err && <ErrMessage>{err.message}</ErrMessage>}
      {value == '' && <ErrMessage>Required</ErrMessage>}
    </>
  );
}

const YamdeStyling = styled.div`
  display: flex;
  flex: 1;

  .yamde-0-2-1 {
    margin: 0;
  }
`;
