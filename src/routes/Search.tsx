import React, { useRef, useState } from 'react';
import { ContainerNarrow } from '../components/Containers';
import { useSearch as useSearchIndex } from '../helpers/useSearch';
import ResourceInline from '../components/datatypes/ResourceInline';
import { Card } from '../components/Card';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import { openURL } from '../helpers/navigation';
import styled from 'styled-components';

type SearchProps = {
  query: string;
};

const MAX_COUNT = 30;
/** Full text search route */
export function Search({ query }: SearchProps): JSX.Element {
  const [selectedIndex, setSelected] = useState(0);
  const index = useSearchIndex();
  const history = useHistory();
  const htmlElRef = useRef(null);

  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      console.log('open sesame');
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
      setSelected(selectedIndex > 0 ? selectedIndex - 1 : 0);
    },
    { enableOnTags: ['INPUT'] },
  );
  useHotkeys(
    'down',
    e => {
      e.preventDefault();
      setSelected(selectedIndex == results.length - 1 ? results.length - 1 : selectedIndex + 1);
      htmlElRef.current.children[selectedIndex].scrollIntoView({ behavior: 'smooth' });
    },
    { enableOnTags: ['INPUT'] },
  );

  if (index == null) {
    return null;
  }

  const resultsIn = index.search(query);

  const tooMany = resultsIn.length > MAX_COUNT;
  let results = resultsIn;
  if (tooMany) {
    results = results.slice(0, MAX_COUNT);
  }

  return (
    <ContainerNarrow ref={htmlElRef}>
      {results.map((hit, index) => {
        return (
          <Card about={hit.item} key={`${index}${selectedIndex}`} selected={index == selectedIndex}>
            {/* {JSON.stringify(hit.matches)} */}
            <h3>
              <ResourceInline key={hit.item} subject={hit.item} />
            </h3>
            <Highlight>{highglight(hit.item, hit.matches)}</Highlight>
          </Card>
        );
      })}
    </ContainerNarrow>
  );
}

const Highlight = styled.div`
  margin-bottom: 1rem;
  /* font-size: 0.8em; */
  line-height: 1rem;
  font-family: monospace;
`;

function highglight(string, matches) {
  const substrings = [];
  let previousEnd = 0;

  for (const [start, end] of matches) {
    const prefix = string.substring(previousEnd, start);
    const match = <mark>{string.substring(start, end)}</mark>;

    substrings.push(prefix, match);
    previousEnd = end;
  }

  substrings.push(string.substring(previousEnd));

  return <span>{React.Children.toArray(substrings)}</span>;
}
