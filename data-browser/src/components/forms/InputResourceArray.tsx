import React, { useState } from 'react';
import { ArrayError } from '@tomic/lib';
import { useArray } from '@tomic/react';
import { Button } from '../Button';
import { InputProps } from './ResourceField';
import { ErrMessage } from './InputStyles';
import { ResourceSelector } from './ResourceSelector';
import { FaPlus } from 'react-icons/fa';

export default function InputResourceArray({
  resource,
  property,
  ...props
}: InputProps): JSX.Element {
  const [err, setErr] = useState<ArrayError>(null);
  const [array, setArray] = useArray(resource, property.subject, {
    handleValidationError: setErr,
  });

  function handleAdd() {
    setArray([...array, null]);
    // TODO: Add focus when adding a new item
  }

  function handleRemove(index: number) {
    array.splice(index, 1);
    const newArray = [...array];
    setArray(newArray);
  }

  function handleSetSubject(value: string, handleErr, index: number) {
    array[index] = value;
    setArray(array);
  }

  return (
    <>
      {array.map((subject, index) => (
        <ResourceSelector
          key={`${property.subject}${index}${subject}`}
          value={subject}
          setSubject={(set, handleErr) =>
            handleSetSubject(set, handleErr, index)
          }
          error={err?.index == index && err}
          setError={setErr}
          classType={property.classType}
          handleRemove={() => handleRemove(index)}
          {...props}
        />
      ))}
      <Button
        disabled={props.disabled}
        title='Add an item to this list'
        subtle
        type='button'
        onClick={handleAdd}
        style={{ marginBottom: '-1rem' }}
      >
        <FaPlus />
      </Button>
      {err?.index == undefined && <ErrMessage>{err?.message}</ErrMessage>}
    </>
  );
}
