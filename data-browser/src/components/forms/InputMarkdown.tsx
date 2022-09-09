import React, { useCallback, useState } from 'react';
import { useString } from '@tomic/react';
import { InputProps } from './ResourceField';
import { ErrMessage, InputWrapper } from './InputStyles';
import Yamde from 'yamde';
import { useSettings } from '../../helpers/AppSettings';
import styled from 'styled-components';

export default function InputMarkdown({
  resource,
  property,
  ...props
}: InputProps): JSX.Element {
  const [err, setErr] = useState<Error>(null);
  const [value, setVale] = useString(resource, property.subject, {
    handleValidationError: setErr,
  });
  const { darkMode } = useSettings();

  // Since Yamde always sets the required attribute we have to remove it when we don't want it.
  // Should not be needed anymore with https://github.com/AdrianApan/yamde/pull/8
  const removeRequiredRef = useCallback(
    (el: HTMLDivElement) => {
      if (!el) {
        return;
      }

      const textArea = el.querySelector('textarea');

      if (!props.required) {
        textArea.removeAttribute('required');
      }
    },
    [props.required],
  );

  return (
    <>
      <InputWrapper>
        <RemoveRequiredWrapper ref={removeRequiredRef}>
          <YamdeStyling>
            <Yamde
              value={value ? value : ''}
              handler={e => setVale(e)}
              theme={darkMode ? 'dark' : 'light'}
              {...props}
            />
          </YamdeStyling>
        </RemoveRequiredWrapper>
        {/* <TextAreaStyled rows={3} value={value === null ? '' : value} onChange={handleUpdate} required={required} autoFocus={autoFocus} /> */}
      </InputWrapper>
      {value !== '' && err && <ErrMessage>{err.message}</ErrMessage>}
      {value === '' && <ErrMessage>Required</ErrMessage>}
    </>
  );
}

const RemoveRequiredWrapper = styled.div`
  display: contents;
`;

const YamdeStyling = styled.div`
  display: flex;
  flex: 1;

  .yamde-0-2-1 {
    margin: 0;
  }

  .contentArea-0-2-8 textarea,
  .preview-0-2-9 {
    background: ${p => p.theme.colors.bg};
    font-size: ${p => p.theme.fontSizeBody}rem;
  }
`;
