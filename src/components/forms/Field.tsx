import React, { useState } from 'react';
import { FaInfo, FaTrash } from 'react-icons/fa';
import { ButtonIcon } from '../Button';
import { ErrMessage, FieldStyled, LabelHelper, LabelStyled, LabelWrapper } from './InputStyles';

/** High level form field skeleton. Pass the actual input as a child component. */
function Field({ label, helper, children, error, handleDelete }: IFieldProps): JSX.Element {
  const [collapsedHelper, setCollapsed] = useState(true);

  return (
    <FieldStyled>
      <LabelWrapper>
        <LabelStyled>
          {label}{' '}
          {helper && (
            <ButtonIcon type='button' onClick={() => setCollapsed(!collapsedHelper)} style={{ marginRight: '.2rem' }}>
              <FaInfo />
            </ButtonIcon>
          )}
        </LabelStyled>
        {handleDelete && (
          <ButtonIcon title='Delete this property' type='button' onClick={() => handleDelete('test')}>
            <FaTrash />
          </ButtonIcon>
        )}
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
  /** This function will be called when the delete icon is clicked. This should remove the item from any parent list */
  handleDelete?: (url: string) => unknown;
}

export default Field;
