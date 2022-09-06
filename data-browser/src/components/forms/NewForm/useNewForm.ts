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
  subject: string,
  setSubject: (v: string) => void,
  parent: string,
) => {
  // TODO: Don't push to history, but replace, because currenlty back is broken
  const [klassShortname] = useString(klass, properties.shortname);

  const [subjectErr, setSubjectErr] = useState<Error>(null);
  const store = useStore();
  const [subjectValue, setSubjectValue] = useState<string>(subject.toString());
  const resource = useResource(subject.toString(), resourseOpts);
  const [_, setParent] = useString(resource, properties.parent);

  useEffect(() => {
    if (subject === undefined) {
      setSubject(store.createSubject(klassShortname));
    }
  }, [subject]);

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
    const oldSubject = resource.getSubject();

    if (oldSubject === defferedSubjectValue) {
      return;
    }

    setSubjectErr(null);
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
