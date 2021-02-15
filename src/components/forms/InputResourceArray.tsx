import React, { useState } from 'react';
import { ArrayError } from '../../atomic-lib/datatypes';
import { useArray } from '../../atomic-react/hooks';
import { ButtonMargin } from '../Button';
import { InputProps } from './Field';
import { ErrMessage } from './InputStyles';
import { ResourceSelector } from './ResourceSelector';

export default function InputResourceArray({ resource, property, required }: InputProps): JSX.Element {
  const [array, setArray] = useArray(resource, property.subject);
  const [err, setErr] = useState<ArrayError>(null);

  function handleAdd() {
    array.push(null);
    const newArray = array;
    setArray(newArray);
  }

  function handleRemove(index: number) {
    array.splice(index, 1);
    const newArray = array;
    setArray(newArray);
  }

  function handleSetSubject(value: string, handleErr, index: number) {
    array[index] = value;
    setArray(array, handleErr);
  }

  return (
    <>
      {array.map((subject, index) => (
        <ResourceSelector
          key={`${property.subject}${index}${subject}`}
          subject={subject}
          setSubject={(set, handleErr) => handleSetSubject(set, handleErr, index)}
          error={err?.index == index && err}
          setError={setErr}
          resource={resource}
          property={property}
          required={required}
          handleRemove={() => handleRemove(index)}
        />
      ))}
      <ButtonMargin type='button' onClick={handleAdd}>
        {'add'}
      </ButtonMargin>
      {err?.index == undefined && <ErrMessage>{err?.message}</ErrMessage>}
      {array == [] && <ErrMessage>Required</ErrMessage>}
    </>
  );
}
