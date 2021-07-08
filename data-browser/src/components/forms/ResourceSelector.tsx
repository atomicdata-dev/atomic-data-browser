import { ArrayError, urls } from '@tomic/lib';
import { useArray, useResource, useStore, useTitle } from '@tomic/react';
import React, { Dispatch, SetStateAction } from 'react';
import { ErrMessage } from './InputStyles';
import { DropdownInput } from './DropdownInput';

interface ResourceSelectorProps {
  /**
   * Whether a certain type of Class is required here. Pass the URL of the
   * class. Is used for constructing a list of options.
   */
  classType?: string;
  /** If true, the form will show an error if it is left empty. */
  required?: boolean;
  /**
   * Take the second argument of a `useString` hook and pass the setString part
   * to this property
   */
  setSubject: (
    subject: string,
    errHandler: Dispatch<SetStateAction<Error>>,
  ) => void;
  /** The value (URL of the Resource that is selected) */
  value: string;
  /** A function to remove this item. Only relevant in arrays. */
  handleRemove?: () => void;
  /** Only pass an error if it is applicable to this specific field */
  error: Error;
  /**
   * Set an ArrayError. A special type, because the parent needs to know where
   * in the Array the error occurred
   */
  setError: Dispatch<SetStateAction<ArrayError>>;
  disabled?: boolean;
}

/**
 * Form field for selecting a single resource. Needs external subject &
 * setSubject properties
 */
export function ResourceSelector({
  required,
  setSubject,
  value,
  handleRemove,
  error,
  setError,
  classType,
  disabled,
}: ResourceSelectorProps): JSX.Element {
  // TODO: This list should use the user's Pod instead of a hardcoded collection;
  const [classesCollection] = useResource(getCollectionURL(classType));
  let [options] = useArray(
    classesCollection,
    urls.properties.collection.members,
  );
  const [requiredClass] = useResource(classType);
  const classTypeTitle = useTitle(requiredClass);
  const store = useStore();

  function handleUpdate(newval: string) {
    // Pass the error setter for validation purposes
    // Pass the Error handler to its parent, so validation errors appear locally
    setSubject(newval ? newval : '', setError);
    // Reset the error every time anything changes
    setError(null);
  }

  if (options.length == 0) {
    options = store.getAllSubjects();
  }

  let placeholder = 'Enter an Atomic URL...';
  if (classType && classTypeTitle?.length > 0) {
    placeholder = `Select a ${classTypeTitle} or enter a ${classTypeTitle} URL...`;
  }

  if (classType && !requiredClass.isReady()) {
    placeholder = 'Loading Class...';
  }

  return (
    <div style={{ flex: '1' }}>
      <DropdownInput
        allowOther
        placeholder={placeholder}
        required={required}
        onUpdate={handleUpdate}
        options={options}
        onRemove={handleRemove}
        initial={value}
        disabled={disabled}
      />
      {value !== '' && error && <ErrMessage>{error?.message}</ErrMessage>}
      {required && value == '' && <ErrMessage>Required</ErrMessage>}
    </div>
  );
}

/** For a given class URL, this tries to return a URL of a Collection containing these. */
export function getCollectionURL(classtypeUrl: string): string {
  switch (classtypeUrl) {
    case urls.classes.property:
      return 'https://atomicdata.dev/collections/property';
    case urls.classes.class:
      return 'https://atomicdata.dev/collections/class';
    case urls.classes.agent:
      return 'https://atomicdata.dev/collections/agent';
    case urls.classes.commit:
      return 'https://atomicdata.dev/collections/commit';
    case urls.classes.datatype:
      return 'https://atomicdata.dev/collections/datatype';
  }
}
