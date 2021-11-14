import * as React from 'react';
import { Resource, properties, classes } from '@tomic/lib';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useArray, useCanWrite, useStore, useString } from '@tomic/react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import styled from 'styled-components';
import { FaEdit, FaEye, FaGripVertical } from 'react-icons/fa';

import { ErrorLook } from './ResourceInline';
import { ElementEdit, ElementEditPropsBase, ElementShow } from './Element';
import { Button } from '../components/Button';

type DocumentPageProps = {
  resource: Resource;
};

/** A full page, editable document, consisting of Elements */
function DocumentPage({ resource }: DocumentPageProps): JSX.Element {
  const [canWrite, canWriteMessage] = useCanWrite(resource);
  const [editMode, setEditMode] = useState(canWrite);

  React.useEffect(() => {
    setEditMode(canWrite);
  }, [canWrite]);

  return (
    <DocumentWrapper about={resource.getSubject()}>
      {editMode ? (
        <DocumentPageEdit resource={resource} setEditMode={setEditMode} />
      ) : (
        <DocumentPageShow resource={resource} setEditMode={setEditMode} />
      )}
    </DocumentWrapper>
  );
}

type DocumentSubPageProps = {
  resource: Resource;
  setEditMode: (arg: boolean) => void;
};

function DocumentPageEdit({
  resource,
  setEditMode,
}: DocumentSubPageProps): JSX.Element {
  const [elements, setElements] = useArray(
    resource,
    properties.document.elements,
    { commit: true, validate: false },
  );
  const [title, setTitle] = useString(resource, properties.name, {
    commit: true,
    validate: false,
  });
  const titleRef = React.useRef(null);
  const store = useStore();
  const ref = React.useRef(null);
  const [err, setErr] = useState(null);
  const [current, setCurrent] = React.useState<number | null>(null);

  // On init, focus on the last element
  React.useEffect(() => {
    setCurrent(elements.length - 1);
  }, []);

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
      if (!current || current === 0) {
        titleRef.current.focus();
      } else {
        focusElement(current - 1);
      }
    },
    { enableOnTags: ['TEXTAREA'] },
    [current],
  );

  useHotkeys(
    'down',
    e => {
      e.preventDefault();
      if (!current && document.activeElement === titleRef.current) {
        focusElement(0);
      } else {
        focusElement(current + 1);
      }
    },
    { enableOnTags: ['TEXTAREA', 'INPUT'] },
    [current],
  );

  // Move current element up
  useHotkeys(
    'option+up,alt+up',
    e => {
      e.preventDefault();
      moveElement(current, current - 1);
    },
    { enableOnTags: ['TEXTAREA'] },
    [current],
  );

  // Move element down
  useHotkeys(
    'option+down,alt+down',
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
      const newElement = new Resource(elementSubject, true);
      await Promise.all([
        newElement.set(properties.isA, [classes.elements.paragraph], store),
        newElement.set(properties.parent, resource.getSubject(), store),
        newElement.set(properties.description, '', store),
      ]);
      // This is a dubious hack to make sure the element is instantly usable.
      store.addResource(newElement);
      // This makes things slow, but it prevents that an empty element is added to the store
      newElement.save(store);
      await setElements(elements);
      focusElement(position);
      // window.setTimeout(() => {
      //   focusElement(position);
      // }, 10);
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
    let found =
      ref?.current?.children[goto]?.getElementsByClassName('element')[0];
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
    setElements(elements);
    focusElement(number - 1);
  }

  /** Sets the subject for a specific element and moves to the next element */
  async function setElement(index: number, subject: string) {
    elements[index] = subject;
    setElements(elements);
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

  /** Add a new line, or move to the last line if it is empty */
  async function handleNewLineMaybe() {
    const lastSubject = elements[elements.length - 1];
    const lastElem = await store.getResourceAsync(lastSubject);
    if (lastElem.get(properties.description)?.toString()?.length == 0) {
      focusElement(elements.length - 1);
    } else {
      addElement(elements.length);
    }
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TitleInput
          data-test='document-title'
          ref={titleRef}
          placeholder={'set a title'}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Button
          icon
          subtle
          onClick={() => setEditMode(false)}
          title='Read mode'
        >
          <FaEye />
        </Button>
      </div>

      {err && <ErrorLook>{err.message}</ErrorLook>}
      <div ref={ref}>
        <SortableList
          canDrag={true}
          onSortEnd={handleSortEnd}
          items={elements}
          deleteElement={deleteElement}
          setCurrent={setCurrent}
          current={current}
          setElementSubject={setElement}
          length={elements.length}
          useDragHandle
        />
      </div>
      <NewLine onClick={handleNewLineMaybe} />
    </>
  );
}

function DocumentPageShow({
  resource,
  setEditMode,
}: DocumentSubPageProps): JSX.Element {
  const [elements] = useArray(resource, properties.document.elements);
  const [title] = useString(resource, properties.name);
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h1 style={{ flex: 1 }}>{title}</h1>
        <Button icon subtle onClick={() => setEditMode(true)} title='Edit mode'>
          <FaEdit />
        </Button>
      </div>
      {elements.map((subject, index) => (
        <ElementShow subject={subject} key={subject} />
      ))}
    </>
  );
}

interface SortableListProps extends ElementEditPropsBase {
  items: string[];
  length: number;
}

const DocumentWrapper = styled.div`
  background-color: ${p => p.theme.colors.bg};
  border-left: solid 1px ${p => p.theme.colors.bg2};
  border-right: solid 1px ${p => p.theme.colors.bg2};
  max-width: ${p => p.theme.containerWidth}rem;
  display: flex;
  flex: 1;
  margin: auto;
  flex-direction: column;
  min-height: 100%;
  box-sizing: border-box;
  padding: 2rem;
  @media (max-width: ${props => props.theme.containerWidth}rem) {
    padding: ${p => p.theme.margin}rem;
  }
`;

const NewLine = styled.div`
  height: 20rem;
  flex: 1;
  cursor: text;
`;

const TitleInput = styled.input`
  margin-bottom: ${props => props.theme.margin}rem;
  font-size: ${p => p.theme.fontSizeH1}rem;
  color: ${p => p.theme.colors.text};
  border: none;
  font-weight: bold;
  display: block;
  width: 100%;
  padding: 0;
  margin-top: 0;
  outline: none;
  background-color: ${p => p.theme.colors.bg};
  margin-bottom: ${p => p.theme.margin}rem;
  font-family: ${p => p.theme.fontFamilyHeader};

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

interface SortableElementProps extends ElementEditPropsBase {
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
    canDrag,
    current,
    setElementSubject: setElement,
  }: SortableElementProps) => (
    <SortableItemWrapper>
      <GripItem active={sortIndex == current} />
      <ElementEdit
        canDrag={canDrag}
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
    <SortHandleStyled active={active} title={'Grab to re-order'}>
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
  left: -1rem;
  bottom: 0;
  height: 100%;
  /* TODO fix cursor while dragging */
  cursor: grab;
  border: solid 1px transparent;
  border-radius: ${p => p.theme.radius};

  &:drop(active),
  &:focus,
  &:active {
    opacity: 0.5;
  }

  &:hover {
    opacity: 0.5;
  }
`;

export default DocumentPage;
