import {
  properties,
  Resource,
  useCanWrite,
  useString,
  useTitle,
} from '@tomic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaEdit } from 'react-icons/fa';
import styled, { css } from 'styled-components';

export interface EditableTitleProps {
  resource: Resource;
  /** Uses `name` by default */
  propertyURL?: string;
  parentRef?: React.RefObject<HTMLInputElement>;
}

export function EditableTitle({
  resource,
  propertyURL,
  parentRef,
  ...props
}: EditableTitleProps): JSX.Element {
  propertyURL = propertyURL || properties.name;
  const [text, setText] = useString(resource, propertyURL, {
    commit: true,
    validate: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  const innerRef = useRef<HTMLInputElement>(null);
  const ref = parentRef || innerRef;

  const [canEdit] = useCanWrite(resource);
  const starndardTitle = useTitle(resource);

  useHotkeys(
    'enter',
    () => {
      setIsEditing(false);
    },
    { enableOnTags: ['INPUT'] },
  );

  function handleClick() {
    setIsEditing(true);
  }

  const placeholder = 'set a title';

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, [isEditing]);

  return canEdit && isEditing ? (
    <TitleInput
      ref={ref}
      data-test='editable-title'
      {...props}
      onFocus={handleClick}
      placeholder={placeholder}
      onChange={e => setText(e.target.value)}
      value={text || ''}
      onBlur={() => setIsEditing(false)}
      style={{ visibility: isEditing ? 'visible' : 'hidden' }}
    />
  ) : (
    <Title
      canEdit={canEdit}
      title={canEdit ? 'Edit title' : 'View title'}
      data-test='editable-title'
      onClick={handleClick}
      style={{ display: isEditing ? 'hidden' : 'visible' }}
      subtle={canEdit && !text}
    >
      <>
        {text ? text : canEdit ? placeholder : starndardTitle || 'Untitled'}
        {canEdit && <Icon />}
      </>
    </Title>
  );
}

const TitleShared = css`
  line-height: 1.1;
  width: 100%;
`;

interface TitleProps {
  subtle: boolean;
  canEdit: boolean;
}

const Title = styled.h1<TitleProps>`
  ${TitleShared}
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  cursor: ${props => (props.canEdit ? 'pointer' : 'initial')};
  opacity: ${props => (props.subtle ? 0.5 : 1)};
`;

const TitleInput = styled.input`
  ${TitleShared}
  margin-bottom: ${props => props.theme.margin}rem;
  font-size: ${p => p.theme.fontSizeH1}rem;
  color: ${p => p.theme.colors.text};
  border: none;
  font-weight: bold;
  display: block;
  padding: 0;
  margin-top: 0;
  outline: none;
  background-color: transparent;
  margin-bottom: ${p => p.theme.margin}rem;
  font-family: ${p => p.theme.fontFamilyHeader};
  word-wrap: break-word;
  word-break: break-all;
  overflow: visible;

  &:focus {
    outline: none;
  }
`;

const Icon = styled(FaEdit)`
  opacity: 0;
  margin-left: auto;

  ${Title}:hover & {
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
`;
