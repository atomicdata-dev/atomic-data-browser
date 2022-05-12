import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaEdit } from 'react-icons/fa';
import styled from 'styled-components';
import {
  useProperty,
  useStore,
  useValue,
  Datatype,
  Resource,
} from '@tomic/react';
import { Button } from '../Button';
import ValueComp from '../ValueComp';
import { ErrMessage } from './InputStyles';
import InputSwitcher from './InputSwitcher';
import { useSettings } from '../../helpers/AppSettings';
import toast from 'react-hot-toast';

interface ValueFormProps {
  // Maybe pass Value instead of Resource?
  resource: Resource;
  propertyURL: string;
  /**
   * The datatype is automatically determined using the propertyUrl, but you can
   * also override it manually
   */
  datatype?: Datatype;
  noMargin?: boolean;
}

/**
 * A form for a single Value. Presents a normal value, but let's the user click
 * on a button to turn it into an input.
 */
export function ValueForm({
  resource,
  noMargin,
  propertyURL,
  datatype,
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

  if (value === null) {
    return null;
  }

  if (!property && !datatype) {
    return <span title={`loading ${propertyURL}...`}>...</span>;
  }

  if (!editMode) {
    return (
      <ValueFormWrapper>
        <ValueComp
          value={value}
          datatype={datatype || property.datatype}
          noMargin={noMargin}
        />
        <EditButton title='Edit value'>
          <FaEdit onClick={() => setEditMode(!editMode)} />
        </EditButton>
      </ValueFormWrapper>
    );
  }

  function handleCancel() {
    setErr(null);
    setEditMode(false);
    // Should this maybe also remove the edits to the resource?
    // https://github.com/joepio/atomic-data-browser/issues/36
  }

  async function handleSave() {
    try {
      await resource.save(store);
      setEditMode(false);
      toast.success('Resource saved');
    } catch (e) {
      setErr(e);
      setEditMode(true);
      toast.error('Could not save resource...');
    }
  }

  return (
    <ValueFormWrapper>
      <InputSwitcher
        data-test={`input-${property.subject}`}
        resource={resource}
        property={property}
        autoFocus
      />
      {err && <ErrMessage>{err.message}</ErrMessage>}
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
      <Button subtle onClick={handleCancel}>
        cancel
      </Button>
    </ValueFormWrapper>
  );
}

const ValueFormWrapper = styled.div`
  /* Used for positioning the edit button*/
  position: relative;
  flex: 1;
  word-wrap: break-word;
  max-width: 100%;
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
