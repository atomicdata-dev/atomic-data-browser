import { Resource, useStore, useString } from '@tomic/react';
import React, { useState, useCallback } from 'react';
import { FaEdit } from 'react-icons/fa';
import styled from 'styled-components';
import ResourceField from './forms/ResourceField';

export interface EditableTitleProps {
  resource: Resource;
  propertyURL: string;
}

export function EditableTitle({
  resource,
  propertyURL,
}: EditableTitleProps): JSX.Element {
  const store = useStore();
  const [editing, setEditing] = useState(false);
  const [text] = useString(resource, propertyURL);

  const handleClick = useCallback(() => {
    setEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setEditing(false);
    resource.save(store);
  }, [store]);

  return (
    <>
      {editing ? (
        <span onBlur={handleBlur}>
          <ResourceField
            resource={resource}
            propertyURL={propertyURL}
            autoFocus
          />
        </span>
      ) : (
        <Hoverable onClick={handleClick} role='button'>
          <h2>{text}</h2>
          <FaEdit />
        </Hoverable>
      )}
    </>
  );
}

const Hoverable = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  & h2 {
    margin: 0;
  }
`;
