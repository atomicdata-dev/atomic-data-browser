import React, { useState } from 'react';
import { ArrayError } from '@tomic/react';
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
  const [err, setErr] = useState<ArrayError | undefined>(undefined);
  const [array, setArray] = useArray(resource, property.subject, {
    handleValidationError: setErr,
  });
  /** Add focus to the last added item */
  const [lastIsNew, setLastIsNew] = useState(false);

  function handleAdd() {
    setArray([...array, undefined]);
    setLastIsNew(true);
  }

  function handleRemove(index: number) {
    array.splice(index, 1);
    const newArray = [...array];
    setArray(newArray);
  }

  function handleSetSubject(
    value: string | undefined,
    _handleErr,
    index: number,
  ) {
    if (value) {
      array[index] = value;
      setArray(array);
      setLastIsNew(false);
    }
  }

  function errMaybe(index: number) {
    if (err && err.index === index) {
      return err;
    }

    return undefined;
  }

  return (
    <>
      {array.map((subject, index) => (
        <ResourceSelector
          key={`${property.subject}${index}`}
          value={subject}
          setSubject={(set, handleErr) =>
            handleSetSubject(set, handleErr, index)
          }
          error={errMaybe(index)}
          setError={setErr}
          classType={property.classType}
          handleRemove={() => handleRemove(index)}
          parent={resource.getSubject()}
          {...props}
          autoFocus={lastIsNew && index === array.length - 1}
        />
      ))}
      <Button
        disabled={props.disabled}
        title='Add an item to this list'
        data-test={`input-${property.shortname}-add-resource`}
        subtle
        type='button'
        onClick={handleAdd}
        style={{ marginBottom: '-1rem' }}
      >
        <FaPlus />
      </Button>
      {err?.index === undefined && <ErrMessage>{err?.message}</ErrMessage>}
    </>
  );
}
