import * as React from 'react';
import { Resource, properties } from '@tomic/lib';
import { useArray, useResource, useStore, useString } from '@tomic/react';

import { ContainerNarrow } from '../components/Containers';
import styled, { css } from 'styled-components';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSearch } from '../helpers/useSearch';
import ResourceInline from './ResourceInline';
import ResourceLine from './ResourceLine';

type DrivePageProps = {
  resource: Resource;
};

const searchChar = '@';

/** A full page, editable document, consisting of Elements */
function DocumentPage({ resource }: DrivePageProps): JSX.Element {
  const [elements, setElements] = useArray(
    resource,
    properties.document.elements,
  );
  const store = useStore();
  const ref = React.useRef(null);
  const [current, setCurrent] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (elements.length == 0) {
      handleCreateElement(0);
    }
  }, [JSON.stringify(elements)]);

  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      handleCreateElement(current + 1);
    },
    // no keybaord events captured by ContentEditable
    { enableOnTags: ['TEXTAREA'] },
  );

  useHotkeys(
    'up',
    e => {
      e.preventDefault();
      setFocusToElement(current - 1);
    },
    // no keybaord events captured by ContentEditable
    { enableOnTags: ['TEXTAREA'] },
  );

  useHotkeys(
    'down',
    e => {
      e.preventDefault();
      setFocusToElement(current + 1);
    },
    // no keybaord events captured by ContentEditable
    { enableOnTags: ['TEXTAREA'] },
  );

  function handleCreateElement(position: number) {
    // When an element is created, it should be a Resource that has this document as its parent.
    // or maybe a nested resource?
    const subject = store.createSubject('element');
    elements.splice(position, 0, subject);
    setElements(elements);
    setFocusToElement(position);
    window.setTimeout(() => {
      setFocusToElement(position);
    }, 10);
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

  function deleteElement(number: number) {
    elements.splice(number, 1);
    setElements(elements);
    setFocusToElement(number - 1);
  }

  /** Sets the subject for a specific element and moves to the next element */
  function setElement(index: number, subject: string) {
    elements[index] = subject;
    setElements(elements);
    if (index == elements.length - 1) {
      handleCreateElement(index + 1);
    } else {
      setFocusToElement(index + 1);
    }
  }

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <h1>Document</h1>
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
          />
        ))}
      </div>
    </ContainerNarrow>
  );
}

interface ElementProps {
  subject: string;
  deleteElement: (i: number) => void;
  current: number;
  setCurrent: (i: number) => void;
  index: number;
  setElement: (i: number, subject: string) => void;
}

function Element({
  subject,
  deleteElement,
  index,
  setCurrent,
  current,
  setElement,
}: ElementProps): JSX.Element {
  const [resource] = useResource(subject);
  const [text, setText] = useString(resource, properties.description);
  const [klass] = useArray(resource, properties.isA);
  const ref = React.useRef(null);

  const active = current == index;
  /** If it is not a text element */
  const isAResource = klass.length > 0;

  function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    // setCurrent(index);
    setText(e.target.value);
    handleResize();
  }

  function handleResize() {
    ref.current.style.height = '1rem';
    ref.current.style.height = ref.current.scrollHeight + 'px';
  }

  React.useEffect((): void => {
    // setCurrent(index);
    handleResize();
  }, [ref]);

  useHotkeys(
    'backspace',
    e => {
      const isEmpty = text == '' || text == null;
      if ((active && isEmpty) || isAResource) {
        e.preventDefault();
        deleteElement(index);
      }
    },
    // no keybaord events captured by ContentEditable
    {
      enableOnTags: ['TEXTAREA'],
      enabled: active,
    },
    [index, text, active],
  );

  if (klass.length > 0) {
    return (
      <ElementWrapper
        tabIndex={0}
        className='element'
        active={active}
        ref={ref}
        onFocus={() => setCurrent(index)}
        onBlur={() => setCurrent(null)}
      >
        <ResourceLine subject={subject} clickable />
      </ElementWrapper>
    );
  }

  return (
    <ElementWrapper active={active} onClick={() => setCurrent(index)}>
      <ElementView
        className='element'
        active={active}
        ref={ref}
        onChange={handleOnChange}
        onFocus={() => setCurrent(index)}
        onBlur={() => setCurrent(null)}
        placeholder={active && `Type something (try ${searchChar})`}
      >
        {text}
      </ElementView>
      {active && text?.startsWith(searchChar) && (
        <SearchElement
          active={active}
          query={text.substring(1)}
          setElement={(s: string) => setElement(index, s)}
        />
      )}
    </ElementWrapper>
  );
}

const ElementFocusStyle = css`
  /* background-color: ${p => p.theme.colors.bg1}; */
  border-radius: 5px;
  outline: none;
`;

const ElementWrapper = styled.div<ElementViewProps>`
  position: relative;
  border: ${p => (p.active ? `solid 1px ${p.theme.colors.bg1}` : 'none')};
  display: block;
  width: 100%;
  border: none;
  resize: none;
  background-color: ${p => p.theme.colors.bg};
  color: ${p => p.theme.colors.text};
  /* border: ${p => (p.active ? `solid 1px ${p.theme.colors.bg1}` : 'none')}; */
  padding: 0.5rem;
  cursor: text;

  ${p => p.active && ElementFocusStyle}

  &:focus {
    ${ElementFocusStyle}
  }

  &::after {
    content: '';
    display: ${p => (p.active ? 'inline-block' : 'none')};
    position: absolute;
    left: -1rem;
    top: 0;
    bottom: 0.3rem;
    background-color: ${p => p.theme.colors.bg1};
    border-radius: 5px;
    width: 1rem;
    /* height: 100%; */
  }
`;

interface ElementViewProps {
  active: boolean;
}

const ElementView = styled.textarea<ElementViewProps>`
  border: none;
  width: 100%;
  resize: none;
  &:focus {
    outline: none;
    ${ElementFocusStyle}
  }
`;

interface SearchElementProps {
  query: string;
  active: boolean;
  setElement: (subject: string) => void;
}

function SearchElement({ query, setElement, active }: SearchElementProps) {
  const results = useSearch(query);

  useHotkeys(
    'tab',
    e => {
      e.preventDefault();
      setElement(results[0].item.subject);
    },
    { enableOnTags: ['TEXTAREA'], enabled: active },
    [active],
  );

  if (query == '') {
    return <span>Search something...</span>;
  }

  return (
    <span>
      <ResourceInline subject={results[0]?.item?.subject} />
      <span> (press tab to select)</span>
    </span>
  );
}

export default DocumentPage;
