import { tryValidURL, useResource, useTitle } from '@tomic/react';
import { transparentize } from 'polished';
import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import {
  constructOpenURL,
  searchURL,
  useSearchQuery,
} from '../helpers/navigation';
import { useFocus } from '../helpers/useFocus';
import { useQueryScopeHandler } from '../hooks/useQueryScope';
import { shortcuts } from './HotKeyWrapper';
import { IconButton, IconButtonVariant } from './IconButton/IconButton';

export interface SearchbarProps {
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  subject?: string;
}

export function Searchbar({
  onFocus,
  onBlur,
  subject,
}: SearchbarProps): JSX.Element {
  const [input, setInput] = useState<string | undefined>('');
  const [query] = useSearchQuery();
  const { scope, clearScope } = useQueryScopeHandler();

  const [inputRef, setInputFocus] = useFocus();
  const navigate = useNavigate();

  function handleSelect(e) {
    e.target.select();
  }

  function handleChange(e) {
    setInput(e.target.value);

    try {
      tryValidURL(e.target.value);
      // Replace instead of push to make the back-button behavior better.
      navigate(constructOpenURL(e.target.value), { replace: true });
    } catch (_err) {
      navigate(searchURL(e.target.value, scope), { replace: true });
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!subject) {
      return;
    }

    event.preventDefault();
    //@ts-ignore this does seem callable
    inputRef.current.blur();
    //@ts-ignore this does seem callable
    document.activeElement.blur();
    navigate(constructOpenURL(subject));
  };

  useEffect(() => {
    // Prevents setting an empty input if the first letter of a query has just been typed
    !query && setInput(subject);
  }, [subject, query]);

  useHotkeys(shortcuts.search, e => {
    e.preventDefault();
    //@ts-ignore this does seem callable
    inputRef.current.select();
    setInputFocus();
  });

  useHotkeys(
    'esc',
    e => {
      e.preventDefault();
      //@ts-ignore this does seem callable
      inputRef.current.blur();
    },
    { enableOnTags: ['INPUT'] },
  );

  useHotkeys(
    'backspace',
    _ => {
      if (input === undefined || input.length === 0) {
        if (scope) {
          clearScope();
        }
      }
    },
    { enableOnTags: ['INPUT'] },
  );

  useEffect(() => {
    setInput(query ?? '');

    if (query || scope) {
      setInputFocus();
    }
  }, [query, scope]);

  return (
    <Form onSubmit={handleSubmit} autoComplete='off'>
      {scope && <ParentTag subject={scope} onClick={clearScope} />}
      <Input
        autoComplete='false'
        // @ts-ignore this seems to work fine
        ref={inputRef}
        type='search'
        data-test='address-bar'
        name='search'
        aria-label='Search'
        onClick={handleSelect}
        onFocus={onFocus}
        onBlur={onBlur}
        value={input || ''}
        onChange={handleChange}
        placeholder='Enter an Atomic URL or search   (press "/" )'
      />
    </Form>
  );
}

interface ParentTagProps {
  subject: string;
  onClick: () => void;
}

function ParentTag({ subject, onClick }: ParentTagProps): JSX.Element {
  const resource = useResource(subject);
  const [title] = useTitle(resource);

  return (
    <Tag>
      <span>in:{title} </span>
      <IconButton
        onClick={onClick}
        title='Clear scope'
        variant={IconButtonVariant.Fill}
        color='textLight'
        size='0.8rem'
      >
        <FaTimes />
      </IconButton>
    </Tag>
  );
}

const Input = styled.input`
  border: none;
  font-size: 0.9rem;
  padding: 0.4rem 1.2rem;
  color: ${props => props.theme.colors.text};
  width: 100%;
  flex: 1;
  min-width: 1rem;
  background-color: ${props => props.theme.colors.bg};
  outline: 0;
  color: ${p => p.theme.colors.textLight};
`;

const Form = styled.form`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  padding-inline: 1rem;
  border-radius: 999px;

  :hover {
    box-shadow: inset 0 0 0 2px
      ${props => transparentize(0.6, props.theme.colors.main)};

    ${Input} {
      color: ${p => p.theme.colors.text};
    }
  }
  :focus-within {
    ${Input} {
      color: ${p => p.theme.colors.text};
    }
    outline: none;
    box-shadow: inset 0 0 0 2px ${props => props.theme.colors.main};
  }
`;

const Tag = styled.span`
  background-color: ${props => props.theme.colors.bg1};
  border-radius: ${props => props.theme.radius};
  padding: 0.2rem 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.3rem;
  span {
    max-width: 15ch;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
