import React, { useState } from 'react';
import { useArray } from '../../atomic-react/hooks';
import { ButtonMargin } from '../Button';
import { ErrMessage, InputProps, InputStyled, InputWrapper } from './Field';
import { InputResource } from './InputResource';
import { ResourceSelector } from './ResourceSelector';

export default function InputResourceArray({ resource, property, required }: InputProps): JSX.Element {
  const [array, setArray] = useArray(resource, property.subject);
  const [err, setErr] = useState<Error>(null);

  function handleUpdate(e) {
    const newval = e.target.value;
    // I pass the error setter for validation purposes
    setArray(newval, setErr);
  }

  function handleAdd() {
    array.push(null);
    const newArray = array;
    setArray(newArray, setErr);
  }

  function handleRemove(index: number) {
    array.splice(index, 1);
    const newArray = array;
    setArray(newArray, setErr);
  }

  function handleSetSubject(value: string, handleErr, index: number) {
    console.log('handleSetSubject', value, index);
    array[index] = value;
    console.log('handleSetSubject array', array);
    setErr(null);
    setArray(array, handleErr);
  }

  return (
    <>
      {array.map((subject, index) => (
        <>
          <ResourceSelector
            subject={subject}
            setSubject={(set, handleErr) => handleSetSubject(set, handleErr, index)}
            resource={resource}
            property={property}
            required={required}
          />
          <ButtonMargin type='button' onClick={() => handleRemove(index)}>
            Remove item
          </ButtonMargin>
        </>
      ))}
      <ButtonMargin type='button' onClick={handleAdd}>
        Add item
      </ButtonMargin>
      {array !== [] && err && <ErrMessage>{err.message}</ErrMessage>}
      {array == [] && <ErrMessage>Required</ErrMessage>}
    </>
  );
}
