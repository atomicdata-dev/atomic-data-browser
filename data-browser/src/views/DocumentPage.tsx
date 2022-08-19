import * as React from 'react';
import { Resource, properties, classes } from '@tomic/lib';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useArray, useCanWrite, useStore, useString } from '@tomic/react';
import styled from 'styled-components';
import { FaEdit, FaEye, FaGripVertical } from 'react-icons/fa';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ErrorLook } from './ResourceInline';
import { ElementEdit, ElementEditPropsBase, ElementShow } from './Element';
import { Button } from '../components/Button';
import { ResourcePageProps } from './ResourcePage';
import { UploadWrapper } from '../components/forms/UploadForm';
import toast from 'react-hot-toast';
import { shortcuts } from '../components/HotKeyWrapper';
import { EditableTitle } from '../components/EditableTitle';

/** A full page, editable document, consisting of Elements */
export function DocumentPage({ resource }: ResourcePageProps): JSX.Element {
  const [canWrite] = useCanWrite(resource);
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
    { commit: true, validate: false, commitDebounce: 0 },
  );

  const titleRef = React.useRef(null);
  const store = useStore();
  const ref = React.useRef(null);
  const [err, setErr] = useState(null);
  const [current, setCurrent] = React.useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
      addElement(0);
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
    shortcuts.moveLineUp,
    e => {
      e.preventDefault();
      moveElement(current, current - 1);
    },
    { enableOnTags: ['TEXTAREA'] },
    [current],
  );

  // Move element down
  useHotkeys(
    shortcuts.moveLineDown,
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

  /** Creates a new Element at the given position, with the Document as its parent */
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
      // Edit: seems like it's no longer needed!
      // store.addResource(newElement);
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
    if (elements.length == 1) {
      setElements([]);
      focusElement(0);
      return;
    }
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

  function handleSortEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = elements.indexOf(active.id);
      const newIndex = elements.indexOf(over.id);
      moveElement(oldIndex, newIndex);
    }
  }

  /** Create elements for every new File resource */
  function handleUploadedFiles(fileSubjects: string[]) {
    toast.success('Upload succeeded!');
    fileSubjects.map(subject => elements.push(subject));
    setElements([...elements]);
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
        <EditableTitle ref={titleRef} resource={resource} />
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
      <UploadWrapper
        onFilesUploaded={handleUploadedFiles}
        parentResource={resource}
      >
        <div ref={ref}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSortEnd}
          >
            <SortableContext
              // Not sue why, but creating a new array from elements fixes jumping behavior
              items={[...elements]}
              strategy={verticalListSortingStrategy}
            >
              {elements.map((elementSubject, index) => (
                <SortableElement
                  key={index + elementSubject}
                  canDrag={true}
                  index={index}
                  subject={elementSubject}
                  deleteElement={deleteElement}
                  setCurrent={setCurrent}
                  current={current}
                  setElementSubject={setElement}
                  active={index == current}
                />
              ))}
            </SortableContext>
          </DndContext>
          <NewLine onClick={handleNewLineMaybe} />
        </div>
      </UploadWrapper>
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
        <Button
          data-test='document-edit'
          icon
          subtle
          onClick={() => setEditMode(true)}
          title='Edit mode'
        >
          <FaEdit />
        </Button>
      </div>
      {elements.map(subject => (
        <ElementShow subject={subject} key={subject} />
      ))}
    </>
  );
}

interface SortableElementProps extends ElementEditPropsBase {
  subject: string;
  index: number;
  active: boolean;
}

function SortableElement(props: SortableElementProps) {
  const { subject, active } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: subject });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <SortableItemWrapper ref={setNodeRef} style={style}>
      <GripItem active={active} {...attributes} {...listeners} />
      <ElementEdit {...props} />
    </SortableItemWrapper>
  );
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

const SortableItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const GripItem = (props: GripItemProps) => {
  return (
    <SortHandleStyled {...props} title={'Grab to re-order'}>
      <FaGripVertical />
    </SortHandleStyled>
  );
};

interface GripItemProps {
  /** The element is currently selected */
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
