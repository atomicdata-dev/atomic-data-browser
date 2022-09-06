import { ArrayError, urls } from '@tomic/lib';
import { useArray, useResource, useStore, useTitle } from '@tomic/react';
import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { ErrMessage } from './InputStyles';
import { DropdownInput } from './DropdownInput';
import { Dialog, useDialog } from '../Dialog';
import { DialogTreeContext } from '../Dialog/dialogContext';
import { NewFormDialog } from './NewForm';
import { useCallback } from 'react';
import { useSettings } from '../../helpers/AppSettings';

interface ResourceSelectorProps {
  /**
   * Whether a certain type of Class is required here. Pass the URL of the
   * class. Is used for constructing a list of options.
   */
  classType?: string;
  /** If true, the form will show an error if it is left empty. */
  required?: boolean;
  /**
   * This callback is called when the Subject Changes. You can pass an Error
   * Handler as the second argument to set an error message. Take the second
   * argument of a `useString` hook and pass the setString part to this property
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
  autoFocus?: boolean;
  /** Is used when a new item is created using the ResourceSelector */
  parent?: string;
}

/**
 * Form field for selecting a single resource. Needs external subject &
 * setSubject properties
 */
export const ResourceSelector = React.memo(function ResourceSelector({
  required,
  setSubject,
  value,
  handleRemove,
  error,
  setError,
  classType,
  disabled,
  parent,
  ...props
}: ResourceSelectorProps): JSX.Element {
  // TODO: This list should use the user's Pod instead of a hardcoded collection;
  const classesCollection = useResource(getCollectionURL(classType));
  let [options] = useArray(
    classesCollection,
    urls.properties.collection.members,
  );
  const requiredClass = useResource(classType);
  const classTypeTitle = useTitle(requiredClass);
  const store = useStore();
  const [dialogProps, showDialog, closeDialog, isDialogOpen] = useDialog();
  const parentResource = useResource(parent);
  const { drive } = useSettings();

  const [
    /** The value of the input underneath, updated through a callback */
    inputValue,
    setInputValue,
  ] = useState(value);

  const handleUpdate = useCallback(
    (newval: string) => {
      // Pass the error setter for validation purposes
      // Pass the Error handler to its parent, so validation errors appear locally
      setSubject(newval, setError);
      // Reset the error every time anything changes
      // setError(null);
    },
    [setSubject],
  );

  const handleBlur = useCallback(() => {
    value === null && handleUpdate(inputValue);
  }, [inputValue, value]);

  const isInDialogTree = useContext(DialogTreeContext);

  if (options.length === 0) {
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
        placeholder={placeholder}
        required={required}
        onUpdate={handleUpdate}
        options={options}
        onRemove={handleRemove}
        initial={value}
        disabled={disabled}
        classType={classType}
        // setValue={setValue}
        onCreateClick={showDialog}
        onInputChange={setInputValue}
        onBlur={handleBlur}
        {...props}
      />
      {value && value !== '' && error && (
        <ErrMessage>{error?.message}</ErrMessage>
      )}
      {!isInDialogTree && (
        <Dialog {...dialogProps}>
          {isDialogOpen && (
            <NewFormDialog
              // Any resource needs a parent, but what do we do if the logical parent does not exist yet?
              // https://github.com/atomicdata-dev/atomic-data-browser/issues/195
              parent={parentResource.new ? drive : parent}
              classSubject={classType}
              closeDialog={closeDialog}
              initialTitle={inputValue}
              onSave={handleUpdate}
            />
          )}
        </Dialog>
      )}
      {required && value === '' && <ErrMessage>Required</ErrMessage>}
    </div>
  );
});

/** For a given class URL, this tries to return a URL of a Collection containing these. */
export function getCollectionURL(classtypeUrl: string): string | null {
  switch (classtypeUrl) {
    case urls.classes.property:
      return urls.properties.getAll;
    case urls.classes.class:
      return urls.classes.getAll;
    case urls.classes.agent:
      return 'https://atomicdata.dev/agents/';
    case urls.classes.commit:
      return 'https://atomicdata.dev/commits';
    case urls.classes.datatype:
      return 'https://atomicdata.dev/datatypes';
    default:
      return null;
  }
}
