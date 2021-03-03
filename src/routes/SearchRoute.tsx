import React, { useRef, useState } from 'react';
import { ContainerNarrow } from '../components/Containers';
import { useSearch } from '../helpers/useSearch';
import ResourceInline from '../components/datatypes/ResourceInline';
import { Card } from '../components/Card';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import { openURL } from '../helpers/navigation';

type SearchProps = {
  query: string;
};

const MAX_COUNT = 30;
/** Full text search route */
export function Search({ query }: SearchProps): JSX.Element {
  const [selectedIndex, setSelected] = useState(0);
  const index = useSearch();
  const history = useHistory();
  const htmlElRef = useRef(null);

  /** Moves to the card at the selected index */
  function moveTo(index: number) {
    setSelected(index);
    const offset = -40;
    const y = htmlElRef.current.children[index].getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      const subject = htmlElRef.current.children[selectedIndex].getAttribute('about');
      //@ts-ignore blur does exist though
      document?.activeElement?.blur();
      history.push(openURL(subject));
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
    return <p>Building search index...</p>;
  }

  const resultsIn = index.search(query);

  const tooMany = resultsIn.length > MAX_COUNT;
  let results = resultsIn;
  if (tooMany) {
    results = results.slice(0, MAX_COUNT);
  }

  return (
    <ContainerNarrow ref={htmlElRef}>
      {results.length == 0 && <p>No results found for {query}</p>}
      {results.map((hit, index) => {
        const resource = hit.item;
        return (
          <Card about={resource.subject} key={`${index}${selectedIndex}`} selected={index == selectedIndex}>
            <h3>
              <ResourceInline key={resource.subject} subject={resource.subject} />
            </h3>
          </Card>
        );
      })}
    </ContainerNarrow>
  );
}
