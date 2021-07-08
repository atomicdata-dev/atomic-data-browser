import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaEdit } from 'react-icons/fa';
import styled from 'styled-components';
import { Resource } from '@tomic/lib';
import { useProperty, useStore, useValue } from '@tomic/react';
import { Button } from '../Button';
import ValueComp from '../ValueComp';
import { ErrMessage } from './InputStyles';
import InputSwitcher from './InputSwitcher';
import { useSettings } from '../../helpers/AppSettings';

interface ValueFormProps {
  // Maybe pass Value instead of Resource?
  resource: Resource;
  propertyURL: string;
}

/**
 * A form for a single Value. Presents a normal value, but let's the user click
 * on a button to turn it into an input.
 */
export function ValueForm({
  resource,
  propertyURL,
}: ValueFormProps): JSX.Element {
  const [editMode, setEditMode] = useState(false);
  const property = useProperty(propertyURL);
  const [value] = useValue(resource, propertyURL);
  const store = useStore();
  const { agent } = useSettings();
  useHotkeys(
    'esc',
    () => {
      setEditMode(false);
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'],
    },
  );
  const [err, setErr] = useState<Error>(null);
  const haveAgent = agent !== null;

  if (!value) {
    return null;
  }

  if (!property) {
    return <span title={`loading ${propertyURL}...`}>...</span>;
  }

  if (!editMode) {
    return (
      <ValueFormWrapper>
        <ValueComp value={value} datatype={property.datatype} />
        <EditButton title='Edit value'>
          <FaEdit onClick={() => setEditMode(!editMode)} />
        </EditButton>
      </ValueFormWrapper>
    );
  }

  function handleSave() {
    try {
      (async () => await resource.save(store))();
      resource.save(store);
      setEditMode(false);
    } catch (e) {
      setErr(e);
      setEditMode(true);
    }
  }

  return (
    <ValueFormWrapper>
      <InputSwitcher resource={resource} property={property} autoFocus />
      <Button
        disabled={!haveAgent}
        title={
          haveAgent
            ? 'Save the edits'
            : 'You cannot save - there is no Agent set. Go to settings.'
        }
        onClick={handleSave}
      >
        save
      </Button>
      <Button subtle onClick={() => setEditMode(false)}>
        cancel
      </Button>
      {err && <ErrMessage>{err.message}</ErrMessage>}
    </ValueFormWrapper>
  );
}

const ValueFormWrapper = styled.div`
  /* Used for positioning the edit button*/
  position: relative;
  flex: 1;
`;

const EditButton = styled.div`
  position: absolute;
  top: 0;
  color: ${p => p.theme.colors.main};
  right: 100%;
  cursor: pointer;
  opacity: 0;

  /** Only show hover edit button on mouse devices, prevents having to tap twice on some mobile devices */
  @media (hover: hover) and (pointer: fine) {
    ${ValueFormWrapper}:hover & {
      opacity: 0.5;
      &:hover {
        opacity: 1;
      }
    }
  }
`;
