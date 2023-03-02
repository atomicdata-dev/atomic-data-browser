import {
  Resource,
  useString,
  properties,
  useStore,
  useResource,
  useArray,
} from '@tomic/react';
import { useState, useEffect, useDeferredValue } from 'react';

const resourseOpts = { newResource: true };

/** Shared logic for NewForm components. */
export const useNewForm = (
  klass: Resource,
  subject: string | undefined,
  setSubject: (v: string) => void,
  parent?: string,
) => {
  const store = useStore();
  // TODO: Don't push to history, but replace, because currenlty back is broken
  const [klassShortname] = useString(klass, properties.shortname);
  const [subjectValue, setSubjectValue] = useState<string>(() => {
    if (subject === undefined) {
      return store.createSubject(klassShortname);
    }

    return subject;
  });

  const [subjectErr, setSubjectErr] = useState<Error | undefined>(undefined);
  const resource = useResource(subjectValue, resourseOpts);
  const [_, setParent] = useString(resource, properties.parent);

  useEffect(() => {
    setParent(parent);
  }, [parent]);

  // Set the class for new resources
  const [currentClass] = useArray(resource, properties.isA);

  if (currentClass.length === 0) {
    resource.set(properties.isA, [klass.getSubject()], store);
  }

  const defferedSubjectValue = useDeferredValue(subjectValue);
  /** Changes the URL of a subject. Updates the store */
  // Should be debounced as it is quite expensive, but getting that to work turned out to be really hard
  useEffect(() => {
    if (!defferedSubjectValue) {
      return;
    }

    const oldSubject = resource.getSubject();

    if (oldSubject === defferedSubjectValue) {
      return;
    }

    setSubjectErr(undefined);
    // Expensive!
    store
      .renameSubject(oldSubject, defferedSubjectValue)
      .then(() => {
        setSubject(defferedSubjectValue);
      })
      .catch(e => setSubjectErr(e));
  }, [defferedSubjectValue, resource]);

  return {
    subjectErr,
    subjectValue,
    setSubjectValue,
    resource,
  };
};
