import React, { useState } from 'react';
import { FaAsterisk, FaInfo, FaTrash } from 'react-icons/fa';
import styled from 'styled-components';
import { ButtonIcon } from '../Button';
import { ErrMessage, FieldStyled, LabelHelper, LabelStyled, LabelWrapper } from './InputStyles';

/** High level form field skeleton. Pass the actual input as a child component. */
function Field({ label, helper, children, error, handleDelete, required, disabled }: IFieldProps): JSX.Element {
  const [collapsedHelper, setCollapsed] = useState(true);

  return (
    <FieldStyled>
      <LabelWrapper>
        <LabelStyled>
          {label}{' '}
          {helper && (
            <ButtonIcon
              subtle={collapsedHelper}
              type='button'
              onClick={() => setCollapsed(!collapsedHelper)}
              style={{ marginRight: '.2rem' }}
              title='Show helper'
            >
              <FaInfo />
            </ButtonIcon>
          )}
          {required && (
            <IconWrapper title='Required field'>
              <FaAsterisk />
            </IconWrapper>
          )}
        </LabelStyled>
        {!disabled && handleDelete && (
          <ButtonIcon subtle title='Delete this property' type='button' onClick={() => handleDelete('test')}>
            <FaTrash />
          </ButtonIcon>
        )}
      </LabelWrapper>
      {!collapsedHelper && (
        <LabelHelper>
          {helper}
          {required && <p>Required field.</p>}
        </LabelHelper>
      )}
      {children}
      {error && <ErrMessage title={`Error: ${JSON.stringify(error)}`}>{error.message}</ErrMessage>}
    </FieldStyled>
  );
}

const IconWrapper = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textLight};
`;

interface IFieldProps {
  /** Label */
  label?: string;
  /** Helper text / collapsible info */
  helper?: React.ReactNode;
  /** Here goes the input */
  children: React.ReactNode;
  /** If the field is requires. Shows an aterisk with hover text */
  required?: boolean;
  disabled?: boolean;
  /** The error to be shown in the component */
  error?: Error;
  /** This function will be called when the delete icon is clicked. This should remove the item from any parent list */
  handleDelete?: (url: string) => unknown;
}

export default Field;
