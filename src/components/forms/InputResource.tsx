import React from 'react';
import { InputProps } from './Field';
import { useString } from '../../atomic-react/hooks';
import { ResourceSelector } from './ResourceSelector';

export function InputResource({ resource, property, required }: InputProps): JSX.Element {
  const [subject, setSubject] = useString(resource, property.subject);

  return <ResourceSelector resource={resource} property={property} setSubject={setSubject} subject={subject} required={required} />;
}
