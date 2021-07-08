import React, { useRef, useState } from 'react';
import { ContainerNarrow } from '../components/Containers';
import { useSearch } from '../helpers/useSearch';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import { openURL, useSearchQuery } from '../helpers/navigation';
import ResourceCard from '../components/ResourceCard';
import AtomicLink from '../components/Link';

const MAX_COUNT = 30;

/** Full text search route */
export function Search(): JSX.Element {
  const [query] = useSearchQuery();
  const [selectedIndex, setSelected] = useState(0);
  let results = useSearch(query);
  const history = useHistory();
  const htmlElRef = useRef(null);

  const tooMany = results.length > MAX_COUNT;
  if (tooMany) {
    results = results.slice(0, MAX_COUNT);
  }

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

  return (
    <ContainerNarrow ref={htmlElRef}>
      {results.length == 0 && (
        <p>
          No results found for {query}. Keep in mind that at this moment, this only searches the data that has already been loaded into your
          browser during this session. <AtomicLink subject={'https://atomicdata.dev/collections'}>Load in some resources</AtomicLink> and
          try again!
        </p>
      )}
      {results.map((hit, index) => (
        <ResourceCard
          initialInView={index < 5}
          small
          subject={hit.item.subject}
          key={`${hit.item.subject}${index}`}
          highlight={index == selectedIndex}
        />
      ))}
    </ContainerNarrow>
  );
}
