import {
  Resource,
  Store,
  urls,
  useDebounce,
  useStore,
  useString,
} from '@tomic/react';
//@ts-ignore
import React, { useEffect, useState, useTransition } from 'react';
import styled from 'styled-components';
import { ContainerNarrow } from '../../components/Containers.jsx';
import Markdown from '../../components/datatypes/Markdown.jsx';

export interface BookmarkPreviewProps {
  resource: Resource;
}

async function fetchBookmarkData(url: string, name: string, store: Store) {
  const bookmarkRoute = new URL('/fetchbookmark', store.serverUrl);

  const searchParams = new URLSearchParams({
    name,
    url,
  });

  bookmarkRoute.search = searchParams.toString();

  const res = await fetch(bookmarkRoute, {
    headers: {
      Accept: 'application/json-ad',
    },
  });

  return await res.json();
}

export function BookmarkPreview({
  resource,
}: BookmarkPreviewProps): JSX.Element {
  const store = useStore();
  const [preview, setPreview] = useString(
    resource,
    urls.properties.bookmark.preview,
  );
  const [url] = useString(resource, urls.properties.bookmark.url);
  const [name, setName] = useString(resource, urls.properties.name);
  const [hasError, setHasError] = useState(false);

  const debouncedURL: string = useDebounce(url, 500);
  const [_, startTransition] = useTransition();

  useEffect(() => {
    console.log('fetching');
    try {
      new URL(debouncedURL);
    } catch (e) {
      return;
    }

    startTransition(() => {
      fetchBookmarkData(debouncedURL, name, store)
        .then(res => {
          setPreview(res.preview);
          setName(res.name);
          setHasError(false);
          resource.save(store);
        })
        .catch(err => {
          console.error(err);
          setHasError(true);
        });
    });
  }, [debouncedURL]);

  if (hasError) {
    return <ErrorPage />;
  }
  return (
    <StyledContainerNarrow>
      <Markdown renderGFM text={preview} />
    </StyledContainerNarrow>
  );
}

const ErrorPage = () => {
  return (
    <StyledError>
      <p>Could not load preview 😞</p>
    </StyledError>
  );
};

const StyledError = styled.div`
  display: grid;
  height: min(80vh, 1000px);
  width: 100%;
  place-items: center;
  font-size: calc(clamp(1rem, 5vw, 2.4rem) + 0.1rem);
`;

const StyledContainerNarrow = styled(ContainerNarrow)`
  max-width: 85ch;
`;
