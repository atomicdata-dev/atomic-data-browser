import React, { useRef, useState } from 'react';
import { ContainerNarrow } from '../components/Containers';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router-dom';
import { constructOpenURL, useSearchQuery } from '../helpers/navigation';
import ResourceCard from '../views/Card/ResourceCard';
import { useServerSearch } from '@tomic/react';
import { ErrorLook } from '../views/ResourceInline';

/** Full text search route */
export function Search(): JSX.Element {
  const [query] = useSearchQuery();
  const [selectedIndex, setSelected] = useState(0);
  const { results, loading, error } = useServerSearch(query, {
    debounce: 0,
  });
  const navigate = useNavigate();
  const htmlElRef = useRef<HTMLDivElement | null>(null);

  /** Moves the viewport to the card at the selected index */
  function moveTo(index: number) {
    setSelected(index);
    const currentElm = htmlElRef?.current?.children[index];
    currentElm?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
      moveTo(newSelected);
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
      moveTo(newSelected);
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
