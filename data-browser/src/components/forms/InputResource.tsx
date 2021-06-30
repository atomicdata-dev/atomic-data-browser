import React, { useState } from 'react';
import { InputProps } from './ResourceField';
import { useString } from '@tomic/react';
import { ResourceSelector } from './ResourceSelector';

/** Input field for a single Resource. Renders a dropdown select menu. */
export function InputResource({ resource, property, ...props }: InputProps): JSX.Element {
  const [subject, setSubject] = useString(resource, property.subject);
  const [error, setError] = useState<Error>(null);
  return (
    <ResourceSelector error={error} setError={setError} classType={property.classType} setSubject={setSubject} value={subject} {...props} />
  );
}
