import * as React from 'react';
import { Resource, properties, classes } from '@tomic/lib';
import { useArray, useStore } from '@tomic/react';

import { ContainerNarrow } from '../components/Containers';
import { useHotkeys } from 'react-hotkeys-hook';
import { ErrorLook } from './ResourceInline';
import { Element } from './Element';
import { useState } from 'react';

type DrivePageProps = {
  resource: Resource;
};

/** A full page, editable document, consisting of Elements */
function DocumentPage({ resource }: DrivePageProps): JSX.Element {
  const [elements, setElements] = useArray(
    resource,
    properties.document.elements,
    true,
  );
  const store = useStore();
  const ref = React.useRef(null);
  const [err, setErr] = useState(null);
  const [current, setCurrent] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (elements.length == 0) {
      addElement(0);
    }
  }, [JSON.stringify(elements)]);

  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      addElement(current + 1);
    },
    { enableOnTags: ['TEXTAREA'] },
    [current],
  );

  useHotkeys(
    'up',
    e => {
      e.preventDefault();
      setFocusToElement(current - 1);
    },
    { enableOnTags: ['TEXTAREA'] },
    [current],
  );

  useHotkeys(
    'down',
    e => {
      e.preventDefault();
      setFocusToElement(current + 1);
    },
    { enableOnTags: ['TEXTAREA'] },
    [current],
  );

  async function addElement(position: number) {
    // When an element is created, it should be a Resource that has this document as its parent.
    // or maybe a nested resource?
    const elementSubject = store.createSubject('element');
    elements.splice(position, 0, elementSubject);
    try {
      setElements(elements);
      setFocusToElement(position);
      window.setTimeout(() => {
        setFocusToElement(position);
      }, 10);
      const newElement = new Resource(elementSubject, true);
      await newElement.set(properties.isA, [classes.elements.paragraph], store);
      await newElement.set(properties.parent, resource.getSubject(), store);
      await newElement.set(properties.description, '', store);
      await newElement.save(store);
    } catch (e) {
      setErr(e);
    }
  }

  function setFocusToElement(number: number) {
    let goto = number;
    if (number > elements.length - 1) {
      goto = 0;
    } else if (number < 0) {
      goto = elements.length - 1;
    }
    setCurrent(goto);
    let found = ref?.current?.children[goto]?.getElementsByClassName(
      'element',
    )[0];
    if (!found) {
      found = ref?.current?.children[goto];
    }
    if (found) {
      found.focus();
    } else {
      ref.current.focus();
    }
  }

  async function deleteElement(number: number) {
    elements.splice(number, 1);
    setElements(elements, setErr);
    setFocusToElement(number - 1);
  }

  /** Sets the subject for a specific element and moves to the next element */
  async function setElement(index: number, subject: string) {
    elements[index] = subject;
    setElements(elements, setErr);
    if (index == elements.length - 1) {
      addElement(index + 1);
    } else {
      setFocusToElement(index + 1);
    }
  }

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <h1>Document</h1>
      {err && <ErrorLook>{err.message}</ErrorLook>}
      <div ref={ref}>
        {elements.map((element, i) => (
          <Element
            index={i}
            key={element}
            subject={element}
            deleteElement={deleteElement}
            setCurrent={setFocusToElement}
            current={current}
            setElement={setElement}
            last={i == elements.length - 1}
          />
        ))}
      </div>
    </ContainerNarrow>
  );
}

export default DocumentPage;
