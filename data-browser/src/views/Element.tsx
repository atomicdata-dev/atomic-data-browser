import * as React from 'react';
import { properties, classes } from '@tomic/lib';
import { useArray, useResource, useString } from '@tomic/react';

import styled, { css } from 'styled-components';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSearch } from '../helpers/useSearch';
import ResourceInline, { ErrorLook } from './ResourceInline';
import ResourceLine from './ResourceLine';
import { useState } from 'react';

interface ElementProps {
  subject: string;
  deleteElement: (i: number) => void;
  current: number;
  setCurrent: (i: number) => void;
  index: number;
  setElement: (i: number, subject: string) => void;
  // If it's the last item in the array, it will render a hint.
  last?: boolean;
}

const searchChar = '@';

export function Element({
  subject,
  deleteElement,
  index,
  setCurrent,
  current,
  setElement,
  last,
}: ElementProps): JSX.Element {
  const [resource] = useResource(subject);
  const [text, setText] = useString(resource, properties.description, true);
  const [klass] = useArray(resource, properties.isA);
  const ref = React.useRef(null);
  const [err, setErr] = useState(null);

  const active = current == index;
  /** If it is not a text element */
  const isAResource =
    klass.length > 0 && !klass.includes(classes.elements.paragraph);

  function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    handleResize();
    setErr(null);
    setText(e.target.value, setErr);
  }

  /** Let the textarea grow */
  function handleResize() {
    console.log('resize');
    if (ref.current) {
      ref.current.style.height = '0';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }

  React.useEffect((): void => {
    handleResize();
  }, [ref, text, active]);

  useHotkeys(
    'backspace',
    e => {
      const isEmpty = text == '' || text == null;
      if ((active && isEmpty) || (active && isAResource)) {
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

  function Err() {
    if (err) {
      return <ErrorLook>{err.message}</ErrorLook>;
    } else {
      return null;
    }
  }

  if (isAResource) {
    return (
      <ElementWrapper
        tabIndex={0}
        className='element'
        active={active}
        onFocus={() => setCurrent(index)}
        onBlur={() => setCurrent(null)}
      >
        <ResourceLine subject={subject} clickable />
        <Err />
      </ElementWrapper>
    );
  }

  if (!active) {
    return (
      <ElementWrapper active={active} onClick={() => setCurrent(index)}>
        {text}
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
        placeholder={
          active
            ? `type something (try ${searchChar})`
            : last
              ? '+ new line'
              : ''
        }
        // Not working, I think
        autoFocus={current == index}
        value={text ? text : ''}
      />
      {active && text?.startsWith(searchChar) && (
        <SearchElement
          active={active}
          query={text.substring(1)}
          setElement={(s: string) => setElement(index, s)}
        />
      )}
      <Err />
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
  background-color: ${p => p.theme.colors.bg};
  color: ${p => p.theme.colors.text};
  padding: 0;
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
