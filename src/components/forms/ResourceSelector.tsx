import React, { Dispatch, SetStateAction } from 'react';
import { InputProps } from './Field';
import { useArray, useResource, useStore, useTitle } from '../../atomic-react/hooks';
import { urls } from '../../helpers/urls';
import { ArrayError } from '../../atomic-lib/datatypes';
import { ErrMessage } from './InputStyles';
import { DropDownList } from './Dropdownlist';

interface ResourceSelectorProps extends InputProps {
  /** Take the second argument of a `useString` hook and pass the setString part to this property */
  setSubject: (subject: string, errHandler: Dispatch<SetStateAction<Error>>) => void;
  subject: string;
  /** A function to remove this item. Only relevant in arrays. */
  handleRemove?: () => void;
  /** Only pass an error if it is applicable to this specific field */
  error: Error;
  /** Set an ArrayError. A special type, because the parent needs to know where in the Array the error occurred */
  setError: Dispatch<SetStateAction<ArrayError>>;
}

/** Form field for selecting a single resource. Needs external subject & setSubject properties */
export function ResourceSelector({
  required,
  setSubject,
  subject,
  handleRemove,
  error,
  setError,
  property,
}: ResourceSelectorProps): JSX.Element {
  // TODO: This list should use the user's Pod instead of a hardcoded collection;
  const [classesCollection] = useResource(getCollection(property.classType));
  let [options] = useArray(classesCollection, urls.properties.collection.members);
  const [classType] = useResource(property.classType);
  const classTypeTitle = useTitle(classType);
  const store = useStore();

  function handleUpdate(newval: string) {
    // Pass the error setter for validation purposes
    // Pass the Error handler to its parent, so validation errors appear locally
    setSubject(newval ? newval : '', setError);
  }

  let placeholder = 'Enter an Atomic URL...';

  if (options.length == 0) {
    options = store.getAllSubjects();
  }

  if (property.classType && classTypeTitle?.length > 0) {
    placeholder = `Enter a ${classTypeTitle} URL...`;
  }

  return (
    <>
      <DropDownList
        placeholder={placeholder}
        required={required}
        onUpdate={handleUpdate}
        options={options}
        onRemove={handleRemove}
        initial={subject}
      />
      {subject !== '' && error && <ErrMessage>{error?.message}</ErrMessage>}
      {subject == '' && <ErrMessage>Required</ErrMessage>}
    </>
  );
}

function getCollection(classtypeUrl: string) {
  switch (classtypeUrl) {
    case urls.classes.property:
      return 'https://atomicdata.dev/properties';
    case urls.classes.class:
      return 'https://atomicdata.dev/classes';
    case urls.classes.agent:
      return 'https://atomicdata.dev/agents';
    case urls.classes.commit:
      return 'https://atomicdata.dev/commits';
    case urls.classes.datatype:
      return 'https://atomicdata.dev/datatypes';
  }
}
