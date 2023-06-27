import React from 'react';
import { HistoryViewProps } from './HistoryViewProps';
import styled from 'styled-components';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Column } from '../../components/Row';
import { Title } from '../../components/Title';
import { ResourceCardDefault } from '../../views/Card/ResourceCard';
import { VersionTitle } from './VersionTitle';
import { VersionScroller } from './VersionScroller';

export function HistoryDesktopView({
  resource,
  groupedVersions,
  selectedVersion,
  isCurrentVersion,
  onNextVersion,
  onPreviousVersion,
  onSelectVersion,
  onVersionAccept,
}: HistoryViewProps) {
  return (
    <>
      <CurrentItem>
        <Column fullHeight>
          <Title resource={resource} prefix='History of' link />
          {selectedVersion && selectedVersion?.resource && (
            <>
              <VersionTitle version={selectedVersion} />
              <StyledCard>
                <ResourceCardDefault resource={selectedVersion.resource} />
              </StyledCard>
              <Button onClick={onVersionAccept} disabled={isCurrentVersion}>
                Make current version
              </Button>
            </>
          )}
        </Column>
      </CurrentItem>
      <VersionScroller
        persistSelection
        subject={resource.getSubject()}
        groupedVersions={groupedVersions}
        onNextItem={onPreviousVersion}
        onPreviousItem={onNextVersion}
        selectedVersion={selectedVersion}
        onSelectVersion={onSelectVersion}
        title='Versions'
      />
    </>
  );
}

const StyledCard = styled(Card)`
  flex: 1;
  overflow: auto;
  width: 100%;
`;

const CurrentItem = styled.div`
  flex: 1;

  & h1 {
    margin-bottom: 0;
  }
`;
