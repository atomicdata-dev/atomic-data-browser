import React, { useMemo, useState } from 'react';
import { useResource, useStore, Version } from '@tomic/react';

import { ContainerNarrow } from '../../components/Containers';
import { useCurrentSubject } from '../../helpers/useCurrentSubject';
import { Title } from '../../components/Title';
import { ErrorLook } from '../../components/ErrorLook';
import { ResourceCardDefault } from '../../views/Card/ResourceCard';
import { Column } from '../../components/Row';
import styled from 'styled-components';
import { Button } from '../../components/Button';
import { useVersions } from './useVersions';
import { VersionButton } from './VersionButton';
import { Card } from '../../components/Card';
import { VersionTitle } from './VersionTitle';
import {
  dedupeVersions,
  groupVersionsByMonth,
  setResourceToVersion,
} from './versionHelpers';

/** Shows an activity log of previous versions */
export function History(): JSX.Element {
  const store = useStore();
  const [subject] = useCurrentSubject();
  const resource = useResource(subject);
  const { versions, loading, error } = useVersions(resource);
  const [selectedVersion, setSelectedVersion] = useState<Version | undefined>(
    versions[versions.length - 1],
  );

  const groupedVersions: {
    [key: string]: Version[];
  } = useMemo(() => groupVersionsByMonth(dedupeVersions(versions)), [versions]);

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
        <Column>
          <Title resource={resource} prefix='History of' link />
          {selectedVersion && selectedVersion?.resource && (
            <>
              <VersionTitle version={selectedVersion} />
              <Card>
                <ResourceCardDefault resource={selectedVersion.resource} />
              </Card>
              <Button
                onClick={() =>
                  setResourceToVersion(resource, selectedVersion, store)
                }
              >
                Make current version
              </Button>
            </>
          )}
        </Column>
      </CurrentItem>
      <Scroller>
        <Column>
          <h2>Versions</h2>
          {Object.entries(groupedVersions).map(([key, group]) => (
            <React.Fragment key={key}>
              <GroupHeading>{key}</GroupHeading>
              {[...group].map(version => (
                <VersionButton
                  onClick={() => setSelectedVersion(version)}
                  version={version}
                  key={version.commit.id}
                  selected={selectedVersion?.commit.id === version.commit.id}
                />
              ))}
            </React.Fragment>
          ))}
        </Column>
      </Scroller>
    </SplitView>
  );
}

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
  border: 1px solid ${p => p.theme.colors.bg2};
  border-radius: ${p => p.theme.radius};
  margin: 1rem;
  background-color: ${p => p.theme.colors.bg};
  padding: 1rem;
  width: 20rem;
`;

const GroupHeading = styled.h3`
  &::before {
    content: '';
    display: block;
    height: 1px;
    background-color: ${p => p.theme.colors.bg2};
  }
  &::after {
    content: '';
    display: block;
    height: 1px;
    background-color: ${p => p.theme.colors.bg2};
  }
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  color: ${p => p.theme.colors.textLight};
`;
