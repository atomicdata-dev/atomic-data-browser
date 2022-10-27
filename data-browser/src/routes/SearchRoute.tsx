import React, { useRef, useState } from 'react';
import { ContainerNarrow } from '../components/Containers';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router-dom';
import { constructOpenURL, useSearchQuery } from '../helpers/navigation';
import ResourceCard from '../views/Card/ResourceCard';
import { useServerSearch } from '@tomic/react';
import { ErrorLook } from '../components/ErrorLook';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { useQueryScopeHandler } from '../hooks/useQueryScope';
import { useSettings } from '../helpers/AppSettings';

/** Full text search route */
export function Search(): JSX.Element {
  const [query] = useSearchQuery();
  const { drive } = useSettings();
  const { scope } = useQueryScopeHandler();

  const [selectedIndex, setSelected] = useState(0);
  const { results, loading, error } = useServerSearch(query, {
    debounce: 0,
    scope: scope || drive,
  });
  const navigate = useNavigate();
  const htmlElRef = useRef<HTMLDivElement | null>(null);

  function selectResult(index: number) {
    setSelected(index);
    const currentElm = htmlElRef?.current?.children[index];
    currentElm?.scrollIntoView({ block: 'nearest' });
  }

  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      const subject =
        htmlElRef?.current?.children[selectedIndex]?.getAttribute('about');

      if (subject) {
        //@ts-ignore blur does exist though
        document?.activeElement?.blur();
        const openURL = constructOpenURL(subject);
        navigate(openURL);
      }
    },
    { enableOnTags: ['INPUT'] },
  );
  useHotkeys(
    'up',
    e => {
      e.preventDefault();
      const newSelected = selectedIndex > 0 ? selectedIndex - 1 : 0;
      selectResult(newSelected);
    },
    { enableOnTags: ['INPUT'] },
  );
  useHotkeys(
    'down',
    e => {
      e.preventDefault();
      const newSelected =
        selectedIndex === results.length - 1
          ? results.length - 1
          : selectedIndex + 1;
      selectResult(newSelected);
    },
    { enableOnTags: ['INPUT'] },
  );

  let message = 'No hits';

  if (query?.length === 0) {
    message = 'Enter a search query';
  }

  if (loading) {
    message = 'Loading results...';
  }

  return (
    <ContainerNarrow ref={htmlElRef}>
      {error && <ErrorLook>{error.message}</ErrorLook>}
      {query?.length !== 0 && results.length !== 0 ? (
        <>
          <Heading>
            <FaSearch />
            <span>
              {results.length} {results.length > 1 ? 'Results' : 'Result'} for{' '}
              <QueryText>{query}</QueryText>
            </span>
          </Heading>
          {results.map((subject, index) => (
            <ResourceCard
              initialInView={index < 5}
              small
              subject={subject}
              key={subject}
              highlight={index === selectedIndex}
            />
          ))}
        </>
      ) : (
        <>{message}</>
      )}
    </ContainerNarrow>
  );
}

const Heading = styled.h1`
  color: ${p => p.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.7ch;
  white-space: nowrap;
  overflow: hidden;
  line-height: 1.5;
  margin-bottom: ${p => p.theme.margin * 3}rem;
  > span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const QueryText = styled.span`
  color: ${p => p.theme.colors.textLight};
`;
