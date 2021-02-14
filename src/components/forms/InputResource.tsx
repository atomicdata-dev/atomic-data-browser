import React, { useState } from 'react';
import { InputProps } from './Field';
import { useString } from '../../atomic-react/hooks';
import { ResourceSelector } from './ResourceSelector';

export function InputResource({ resource, property, required }: InputProps): JSX.Element {
  const [subject, setSubject] = useString(resource, property.subject);
  const [error, setError] = useState<Error>(null);

  return (
    <ResourceSelector
      error={error}
      setError={setError}
      resource={resource}
      property={property}
      setSubject={setSubject}
      subject={subject}
      required={required}
    />
  );
}
