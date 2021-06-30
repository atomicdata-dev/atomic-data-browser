import React, { useEffect, useRef, useState } from 'react';
import { ContainerNarrow } from '../components/Containers';
import { Hit, useSearch } from '../helpers/useSearch';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import { openURL, useSearchQuery } from '../helpers/navigation';
import ResourceCard from '../components/ResourceCard';
import { useDebounce } from '../helpers/useDebounce';

const MAX_COUNT = 50;
/** Full text search route */
export function Search(): JSX.Element {
  const [query] = useSearchQuery();
  // TODO: This would feel even snappier if we'd use a throttle instead of a debounce
  const debouncedQuery = useDebounce(query, 50);
  const [selectedIndex, setSelected] = useState(0);
  const index = useSearch();
  const history = useHistory();
  const htmlElRef = useRef(null);
  const [results, setResults] = useState<Hit[]>([]);

  useEffect(() => {
    if (index == null) {
      return;
    }
    const resultsIn = index.search(debouncedQuery);
    const tooMany = resultsIn.length > MAX_COUNT;
    const results = resultsIn;
    if (tooMany) {
      setResults(results.slice(0, MAX_COUNT));
    } else {
      setResults(resultsIn);
    }
  }, [index, debouncedQuery]);

  /** Moves the viewport to the card at the selected index */
  function moveTo(index: number) {
    setSelected(index);
    const currentElm = htmlElRef.current.children[index];
    currentElm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      const subject = htmlElRef.current.children[selectedIndex].getAttribute('about');
      if (subject) {
        //@ts-ignore blur does exist though
        document?.activeElement?.blur();
        history.push(openURL(subject));
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
      const newSelected = selectedIndex == results.length - 1 ? results.length - 1 : selectedIndex + 1;
      moveTo(newSelected);
    },
    { enableOnTags: ['INPUT'] },
  );

  if (index == null) {
    return (
      <ContainerNarrow>
        <p>Building search index...</p>
      </ContainerNarrow>
    );
  }

  return (
    <ContainerNarrow ref={htmlElRef}>
      {results.length == 0 && (
        <p>
          No results found for {query}. Keep in mind that at this moment, this only searches the data that has already been loaded into your
          browser during this session.{' '}
        </p>
      )}
      {results.map((hit, index) => {
        return (
          <ResourceCard
            initialInView={index < 5}
            small
            subject={hit.item.subject}
            key={`${hit.item.subject}${index}`}
            highlight={index == selectedIndex}
          />
        );
      })}
    </ContainerNarrow>
  );
}
