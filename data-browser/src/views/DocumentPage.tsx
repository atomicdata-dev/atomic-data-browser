import * as React from 'react';
import { Resource, properties, classes } from '@tomic/lib';
import { useArray, useStore, useString } from '@tomic/react';

import { ContainerNarrow } from '../components/Containers';
import { useHotkeys } from 'react-hotkeys-hook';
import { ErrorLook } from './ResourceInline';
import { Element, ElementPropsBase } from './Element';
import { useState } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import styled from 'styled-components';
import { FaGripVertical } from 'react-icons/fa';

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
  const [title, setTitle] = useString(resource, properties.name);
  const store = useStore();
  const ref = React.useRef(null);
  const [err, setErr] = useState(null);
  const [current, setCurrent] = React.useState<number | null>(null);

  // Always have one element
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

  /** Move from title to first element */
  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      focusElement(0);
    },
    { enableOnTags: ['INPUT'] },
    [current],
  );

  useHotkeys(
    'up',
    e => {
      e.preventDefault();
      focusElement(current - 1);
    },
    { enableOnTags: ['TEXTAREA'] },
    [current],
  );

  useHotkeys(
    'down',
    e => {
      e.preventDefault();
      focusElement(current + 1);
    },
    { enableOnTags: ['TEXTAREA'] },
    [current],
  );

  // Move current element up
  useHotkeys(
    'option+shift+up',
    e => {
      e.preventDefault();
      moveElement(current, current - 1);
    },
    { enableOnTags: ['TEXTAREA'] },
    [current],
  );

  // Move element down
  useHotkeys(
    'option+shift+down',
    e => {
      e.preventDefault();
      moveElement(current, current + 1);
    },
    { enableOnTags: ['TEXTAREA'] },
    [current],
  );

  // Lose focus
  useHotkeys(
    'esc',
    e => {
      e.preventDefault();
      setCurrent(null);
    },
    { enableOnTags: ['TEXTAREA'] },
  );

  async function addElement(position: number) {
    // When an element is created, it should be a Resource that has this document as its parent.
    // or maybe a nested resource?
    const elementSubject = store.createSubject('element');
    elements.splice(position, 0, elementSubject);
    try {
      setElements(elements);
      focusElement(position);
      window.setTimeout(() => {
        focusElement(position);
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

  function focusElement(goto: number) {
    if (goto > elements.length - 1) {
      goto = elements.length - 1;
    } else if (goto < 0) {
      goto = 0;
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
      // const strLength = 5;
      // const textarea = found.getElementsByTagName('textarea')[0];
      // textarea?.setSelectionRange(strLength, strLength);
      // console.log(found, textarea);
    } else {
      ref.current.focus();
    }
  }

  async function deleteElement(number: number) {
    elements.splice(number, 1);
    setElements(elements, setErr);
    focusElement(number - 1);
  }

  /** Sets the subject for a specific element and moves to the next element */
  async function setElement(index: number, subject: string) {
    elements[index] = subject;
    setElements(elements, setErr);
    if (index == elements.length - 1) {
      addElement(index + 1);
    } else {
      focusElement(index + 1);
    }
  }

  function moveElement(from: number, to: number) {
    const element = elements[from];
    elements.splice(from, 1);
    elements.splice(to, 0, element);
    setElements(elements);
    focusElement(to);
  }

  function handleSortEnd({ oldIndex, newIndex }) {
    moveElement(oldIndex, newIndex);
  }

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <TitleInput
        placeholder={'set a title'}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      {err && <ErrorLook>{err.message}</ErrorLook>}
      <div ref={ref}>
        <SortableList
          onSortEnd={handleSortEnd}
          items={elements}
          deleteElement={deleteElement}
          setCurrent={setCurrent}
          current={current}
          setElementSubject={setElement}
          length={elements.length}
          useDragHandle
        />
        <NewLine />
      </div>
    </ContainerNarrow>
  );
}

interface SortableListProps extends ElementPropsBase {
  items: string[];
  length: number;
}

const NewLine = styled.div`
  flex: 1;
  cursor: pointer;
`;

const TitleInput = styled.input`
  border: none;
  font-weight: bold;
  font-size: ${p => p.theme.fontSizeH1}rem;
  display: block;
  width: 100%;
  background-color: ${p => p.theme.colors.bg};
  color: ${p => p.theme.colors.text};
  margin-bottom: ${p => p.theme.margin}rem;

  &:focus {
    outline: none;
  }
`;

const SortableList = SortableContainer(
  ({ items, ...props }: SortableListProps) => {
    return (
      <div>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${value}`}
            index={index}
            sortIndex={index}
            value={value}
            {...props}
          />
        ))}
      </div>
    );
  },
);

interface SortableElementProps extends ElementPropsBase {
  value: string;
  index: number;
  sortIndex: number;
}

const SortableItem = SortableElement(
  ({
    value,
    sortIndex,
    deleteElement,
    setCurrent,
    current,
    setElementSubject: setElement,
  }: SortableElementProps) => (
    <SortableItemWrapper>
      <GripItem active={sortIndex == current} />
      <Element
        index={sortIndex}
        key={value}
        subject={value}
        deleteElement={deleteElement}
        setCurrent={setCurrent}
        current={current}
        setElementSubject={setElement}
        active={sortIndex == current}
      />
    </SortableItemWrapper>
  ),
);

const SortableItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const GripItem = SortableHandle(({ active }: GripItemProps) => {
  return (
    <SortHandleStyled active={active}>
      <FaGripVertical />
    </SortHandleStyled>
  );
});

interface GripItemProps {
  active: boolean;
}

const SortHandleStyled = styled.div<GripItemProps>`
  width: 1rem;
  flex: 1;
  display: flex;
  align-items: center;
  opacity: ${p => (p.active ? 0.3 : 0)};
  position: absolute;
  left: -1.2rem;
  bottom: 0;
  height: 100%;
  /* TODO fix cursor while dragging */
  cursor: grab;

  &:drop(active),
  &:focus,
  &:active {
    opacity: 0.5;
  }

  &:hover {
    opacity: 0.3;
  }
`;

export default DocumentPage;
