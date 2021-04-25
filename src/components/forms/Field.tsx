import React, { useState } from 'react';
import { FaInfo } from 'react-icons/fa';
import { ButtonIcon } from '../Button';
import { ErrMessage, FieldStyled, LabelHelper, LabelStyled, LabelWrapper } from './InputStyles';

/** High level form field skeleton. Pass the actual input as a child component. */
function Field({ label, helper, children, error }: IFieldProps): JSX.Element {
  const [collapsedHelper, setCollapsed] = useState(true);

  return (
    <FieldStyled>
      <LabelWrapper>
        <LabelStyled>
          {label}
          {helper && (
            <React.Fragment>
              {' '}
              <ButtonIcon type='button' onClick={() => setCollapsed(!collapsedHelper)}>
                <FaInfo />
              </ButtonIcon>
            </React.Fragment>
          )}
        </LabelStyled>
      </LabelWrapper>
      {!collapsedHelper && <LabelHelper>{helper}</LabelHelper>}
      {children}
      {error && <ErrMessage title={`Error: ${JSON.stringify(error)}`}>{error.message}</ErrMessage>}
    </FieldStyled>
  );
}

interface IFieldProps {
  /** Label */
  label?: string;
  /** Helper text / collapsible info */
  helper?: React.ReactNode;
  /** Here goes the input */
  children: React.ReactNode;
  /** The error to be shown in the component */
  error?: Error;
}

export default Field;
