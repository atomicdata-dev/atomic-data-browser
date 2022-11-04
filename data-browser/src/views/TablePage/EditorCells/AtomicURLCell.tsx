import {
  JSONValue,
  urls,
  useArray,
  useResource,
  useServerSearch,
  useTitle,
} from '@tomic/react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Popover } from '../../../components/Popover';
import {
  CursorMode,
  useTableEditorContext,
} from '../../../components/TableEditor/TableEditorContext';
import { useSettings } from '../../../helpers/AppSettings';
import { getIconForClass } from '../../FolderPage/iconMap';
import { AgentCell } from './ResourceCells/AgentCell';
import { FileCell } from './ResourceCells/FileCell';
import { SimpleResourceLink } from './ResourceCells/SimpleResourceLink';
import {
  CellContainer,
  DisplayCellProps,
  EditCellProps,
  ResourceCellProps,
} from './Type';

function AtomicURLCellEdit({
  value,
  onChange,
}: EditCellProps<JSONValue>): JSX.Element {
  const resource = useResource(value as string);
  const [title] = useTitle(resource);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { drive } = useSettings();
  const [open, setOpen] = useState(true);
  const { setCursorMode } = useTableEditorContext();

  const searchOpts = useMemo(
    () => ({
      scope: drive,
    }),
    [drive],
  );

  const [searchValue, setSearchValue] = useState(title);
  const { results } = useServerSearch(searchValue, searchOpts);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(0, i - 1));
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(results.length - 1, i + 1));
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        onChange(results[selectedIndex]);
      }
    },
    [results, onChange, selectedIndex],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchValue(e.target.value);
    setSelectedIndex(0);
  }, []);

  const handleResultClick = useCallback(
    (result: string) => {
      onChange(result);
      setOpen(false);
    },
    [onChange],
  );

  const handleOpenChange = useCallback(
    (state: boolean) => {
      setOpen(state);

      if (!state) {
        setCursorMode(CursorMode.Visual);
      }
    },
    [setCursorMode],
  );

  return (
    <>
      <Popover
        label={title as string}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <SearchInput
          type='search'
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <ResultWrapper>
          {results.length > 0 && (
            <ol>
              {results.map((result, index) => (
                <li key={result} data-selected={index === selectedIndex}>
                  <Result subject={result} onClick={handleResultClick} />
                </li>
              ))}
            </ol>
          )}
          {results.length === 0 && 'No results found'}
        </ResultWrapper>
      </Popover>
    </>
  );
}

function AtomicURLCellDisplay({
  value,
}: DisplayCellProps<JSONValue>): JSX.Element {
  const resource = useResource(value as string);
  const [[classType]] = useArray(resource, urls.properties.isA);

  if (!value) {
    return <></>;
  }

  const Comp = getCellComponent(classType);

  return <Comp resource={resource} />;
}

function BasicCell({ resource }: ResourceCellProps) {
  const [title] = useTitle(resource);

  return <SimpleResourceLink resource={resource}>{title}</SimpleResourceLink>;
}

const getCellComponent = (classType: string) => {
  switch (classType) {
    case urls.classes.agent:
      return AgentCell;
    case urls.classes.file:
      return FileCell;
    default:
      return BasicCell;
  }
};

interface ResultProps {
  subject: string;
  onClick: (subject: string) => void;
}

function Result({ subject, onClick }: ResultProps) {
  const resource = useResource(subject);
  const [title] = useTitle(resource);
  const [[classType]] = useArray(resource, urls.properties.isA);

  const Icon = getIconForClass(classType);

  const handleClick = useCallback(() => {
    onClick(subject);
  }, [subject]);

  return (
    <ResultButton onClick={handleClick}>
      <Icon />
      {title}
    </ResultButton>
  );
}

export const AtomicURLCell: CellContainer<JSONValue> = {
  Edit: AtomicURLCellEdit,
  Display: AtomicURLCellDisplay,
};

const SearchInput = styled.input`
  margin-right: var(--popover-close-safe-area);
  padding: 0.5rem;
  border-radius: ${p => p.theme.radius};
  border: 1px solid ${p => p.theme.colors.bg2};
  outline: none;

  :focus {
    box-shadow: 0 0 0 2px ${p => p.theme.colors.main};
  }
`;

const ResultButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 0.2rem;

  :hover {
    background: ${p => p.theme.colors.bg1};
  }

  svg {
    color: ${p => p.theme.colors.textLight};
  }
`;

const ResultWrapper = styled.div`
  height: min(90vh, 20rem);
  width: min(90vw, 35rem);
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 1rem;

  ol {
    padding: 0;
    margin: 0;
  }

  li {
    list-style: none;
    &[data-selected='true'] {
      color: ${p => p.theme.colors.main};
    }
  }
`;
