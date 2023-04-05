import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Resource, useResource, useStore, Version } from '@tomic/react';

import { ContainerNarrow } from '../components/Containers';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { Title } from '../components/Title';
import { ErrorLook } from '../components/ErrorLook';
import { ResourceCardDefault } from '../views/Card/ResourceCard';
import { Column } from '../components/Row';
import styled from 'styled-components';
import DateTime from '../components/datatypes/DateTime';
import { Button, ButtonClean } from '../components/Button';

interface VersionsHook {
  versions: Version[];
  loading: boolean;
  error: Error | undefined;
}

function useVersions(resource: Resource): VersionsHook {
  const [versions, setVersions] = useState<Version[]>([]);
  const store = useStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    setLoading(true);

    async function getVers() {
      try {
        const foundVersions = await resource.getHistory(store);
        setVersions(foundVersions);
      } catch (e) {
        setError(e);
      }

      setLoading(false);
    }

    getVers();
  }, [resource.getSubject()]);

  return { versions, loading, error };
}

/** Shows an activity log of previous versions */
function History(): JSX.Element {
  const [subject] = useCurrentSubject();
  const resource = useResource(subject);
  const { versions, loading, error } = useVersions(resource);
  const scroller = React.createRef<HTMLDivElement>();
  const [selectedVersion, setSelectedVersion] = useState<Version | undefined>(
    undefined,
  );

  const observer = useMemo(() => {
    return new IntersectionObserver(entries => {
      const intersecting = entries
        .filter(entry => {
          return entry.isIntersecting;
        })
        .map(entry => entry.target.getAttribute('about'));

      if (intersecting[0]) {
        setSelectedVersion(
          versions.filter(v => v.commit.id === intersecting[0])[0],
        );
      }
    });
  }, []);

  function makeCurrentVersion() {
    // Iterate over all items in
  }

  if (loading) {
    return <ContainerNarrow>Loading history of {subject}...</ContainerNarrow>;
  }

  if (error) {
    return (
      <ContainerNarrow>
        <ErrorLook>{error.message}</ErrorLook>
      </ContainerNarrow>
    );
  }

  return (
    <SplitView about={subject}>
      <CurrentItem>
        <Title resource={resource} prefix='History of' link />
        <Button onClick={makeCurrentVersion}>Make current version</Button>
        {selectedVersion?.resource && (
          <ResourceCardDefault resource={selectedVersion.resource} />
        )}
      </CurrentItem>
      <Scroller ref={scroller}>
        <Column>
          {versions.map(version => (
            <VersionButton
              onClick={() => setSelectedVersion(version)}
              version={version}
              key={version.commit.id}
              selected={selectedVersion?.commit.id === version.commit.id}
              observer={observer}
            />
          ))}
        </Column>
      </Scroller>
    </SplitView>
  );
}

interface VersionButtonProps {
  version: Version;
  selected: boolean;
  onClick: () => void;
  observer: IntersectionObserver;
}

function VersionButton({
  version,
  selected,
  onClick,
  observer,
}: VersionButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);

      console.log('observer', observer);

      // return observer.unobserve(ref.current);
    }
  }, [observer]);

  return (
    <VersionRow
      ref={ref}
      selected={selected}
      key={version.commit.signature}
      onClick={onClick}
      about={version.commit.id}
    >
      <DateTime date={new Date(version.commit.createdAt)} />
      {/* <CommitDetail commitSubject={version.commit.id} /> */}
    </VersionRow>
  );
}

interface VProps {
  selected: boolean;
}

const VersionRow = styled(ButtonClean)<VProps>`
  padding: 1rem;
  box-shadow: ${p =>
    p.selected ? `0 0 0 1px inset ${p.theme.colors.text}` : 'none'};

  :hover,
  :focus {
    background: ${p => p.theme.colors.bg1};
  }
  :active {
    background: ${p => p.theme.colors.bg2};
  }
`;

const SplitView = styled.div`
  display: flex;
  /* Fills entire view on all devices */
  width: 100%;
  height: 100%;
  height: calc(100vh - 4rem);
`;

const CurrentItem = styled.div`
  flex: 1;
  padding: 1rem;
`;

const Scroller = styled.div`
  overflow: auto;
  /* flex: 1; */
  width: 20rem;x
`;

export default History;
