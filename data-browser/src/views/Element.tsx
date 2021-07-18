import * as React from 'react';
import { properties, classes } from '@tomic/lib';
import { useArray, useResource, useString } from '@tomic/react';

import styled, { css } from 'styled-components';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSearch } from '../helpers/useSearch';
import ResourceInline, { ErrorLook } from './ResourceInline';
import ResourceLine from './ResourceLine';
import { useState } from 'react';
import Markdown from '../components/datatypes/Markdown';

/** Shared between all elements */
export interface ElementPropsBase {
  /** Removes element from the Array */
  deleteElement: (i: number) => void;
  /** Position of the active Element */
  current: number;
  /** Sets the position of the active Element */
  setCurrent: (i: number) => void;
  /** Changes the subject of a specific item in the array */
  setElementSubject: (i: number, subject: string) => void;
}

interface ElementProps extends ElementPropsBase {
  subject: string;
  /** Position in the array of Elements */
  index: number;
  active: boolean;
}

const searchChar = '/';
const helpChar = '?';
const linkChar = '[';
const headerChar = '#';

export function Element({
  subject,
  deleteElement,
  index,
  setCurrent,
  setElementSubject: setElement,
  active,
}: ElementProps): JSX.Element {
  const [resource] = useResource(subject);
  const [text, setText] = useString(resource, properties.description, true);
  const [klass] = useArray(resource, properties.isA);
  const ref = React.useRef(null);
  const [err, setErr] = useState(null);

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
    if (ref.current) {
      ref.current.style.height = '0';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }

  /** Resize the text area when the text changes, or it is set to active */
  React.useEffect((): void => {
    handleResize();
  }, [ref, text, active]);

  /** Auto focus on select, move cursor to end */
  React.useEffect(() => {
    ref?.current?.focus();
    text && ref?.current?.setSelectionRange(text?.length, text?.length);
  }, [active]);

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

  useHotkeys(
    'cmd+backspace',
    e => {
      if (active) {
        e.preventDefault();
        deleteElement(index);
      }
    },
    {
      enableOnTags: ['TEXTAREA'],
      enabled: active,
    },
    [index, active],
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
      <ElementWrapper
        tabIndex={0}
        active={active}
        // onClick={() => setCurrent(index)}
        onFocus={() => setCurrent(index)}
        onBlur={() => setCurrent(null)}
      >
        <Markdown text={text} noMargin />
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
        placeholder={`type something (try ${helpChar} or ${searchChar})`}
        // Not working, I think
        autoFocus={active}
        value={text ? text : ''}
      />
      {text?.startsWith(searchChar) && (
        <SearchWidget
          query={text.substring(1)}
          setElement={(s: string) => setElement(index, s)}
        />
      )}
      {text?.startsWith(helpChar) && (
        <HelperWidget
          query={text.substring(1)}
          setElement={(s: string) => setElement(index, s)}
        />
      )}
      {text?.startsWith(linkChar) && (
        <WidgetWrapper>
          <p>[link text](https://example.com)</p>
        </WidgetWrapper>
      )}
      {text?.startsWith(headerChar) && (
        <WidgetWrapper>
          <p># Big Header</p>
          <p>## Header</p>
          <p>### Smaller Header</p>
        </WidgetWrapper>
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

const ElementTextStyle = css`
  line-height: 1.4rem;
  font-family: ${p => p.theme.fontFamily};
  font-size: ${p => p.theme.fontSizeBody}rem;
`;

const ElementWrapper = styled.div<ElementViewProps>`
  position: relative;
  display: block;
  width: 100%;
  border: none;
  resize: none;
  padding: 0.5rem;
  padding-left: 0rem;
  cursor: text;
  min-height: 1.5rem;
  /* Maintain enters / newlines */
  white-space: pre-line;
  display: flex;
  flex-direction: column;

  ${p => p.active && ElementFocusStyle}

  ${ElementTextStyle}

  &:focus {
    ${ElementFocusStyle}
  }
`;

interface ElementViewProps {
  active: boolean;
}

const ElementView = styled.textarea<ElementViewProps>`
  ${ElementTextStyle}
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

interface WidgetProps {
  // Input without the matched string / character
  query: string;
  setElement: (subject: string) => void;
}

/** Allows the user to search for Resources and include these as an Element. */
function SearchWidget({ query, setElement }: WidgetProps) {
  const results = useSearch(query);
  // The currently selected result
  const [index, setIndex] = useState(0);

  useHotkeys(
    'tab,enter',
    e => {
      e.preventDefault();
      setElement(results[index].item.subject);
    },
    { enableOnTags: ['TEXTAREA'] },
    [],
  );

  useHotkeys(
    'left',
    e => {
      e.preventDefault();
      let next = index - 1;
      if (next < 0) {
        next = results.length - 1;
      }
      setIndex(index - 1);
    },
    { enableOnTags: ['TEXTAREA'] },
    [index],
  );

  useHotkeys(
    'right',
    e => {
      e.preventDefault();
      let next = index + 1;
      if (next > results.length - 1) {
        next = 0;
      }
      setIndex(index + 1);
    },
    { enableOnTags: ['TEXTAREA'] },
    [index],
  );

  if (query == '') {
    return (
      <WidgetWrapper>
        <p>Search something...</p>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper>
      <p> (press tab to select, left / right to browse)</p>
      <p>
        <ResourceInline subject={results[index]?.item?.subject} />
      </p>
    </WidgetWrapper>
  );
}

const WidgetWrapper = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  left: -1rem;
  border-radius: ${p => p.theme.radius};
  border: solid 1px ${p => p.theme.colors.bg2};
  padding: ${p => p.theme.margin}rem;
  padding-bottom: 0;
  background-color: ${p => p.theme.colors.bg1};
  backdrop-filter: blur(6px);
  opacity: 0.9;
  z-index: 1;
`;

function HelperWidget({ query }: WidgetProps) {
  return (
    <WidgetWrapper>
      {query && <Markdown text={query} />}
      <p>Try typing these:</p>
      <p>
        {'links: '}
        <code>[clickable link](https://example.com)</code>
      </p>
      <p>
        {'styling:'}
        <code>**bold** and _cursive_</code>
      </p>
      <p>
        {'headings:'}
        <code>## Header</code>
      </p>
    </WidgetWrapper>
  );
}
