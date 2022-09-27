import { properties, useArray, useResources } from '@tomic/react';
import React from 'react';
import styled from 'styled-components';
import { EditableTitle } from '../../components/EditableTitle';
import { useNewRoute } from '../../helpers/useNewRoute';
import { ResourcePageProps } from '../ResourcePage';
import { ListView } from './ListView';

export function FolderPage({ resource }: ResourcePageProps) {
  const [subResourceSubjects] = useArray(resource, properties.subResources);

  const subResources = useResources(subResourceSubjects);
  const navigateToNewRoute = useNewRoute(resource.getSubject());

  return (
    <FullPageWrapper>
      <TitleBar>
        <TitleBarInner>
          <EditableTitle resource={resource} />
        </TitleBarInner>
      </TitleBar>
      <Wrapper>
        <ListView subResources={subResources} onNewClick={navigateToNewRoute} />
      </Wrapper>
    </FullPageWrapper>
  );
}

const TitleBar = styled.div`
  display: flex;
  padding: ${p => p.theme.margin}rem;
  background: ${p => p.theme.colors.bgBody};
`;

const TitleBarInner = styled.div`
  width: var(--container-width);
  margin-inline: auto;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: ${p => p.theme.margin}rem;
`;

const FullPageWrapper = styled.div`
  --container-width: min(1300px, 100%);
  background-color: ${p => p.theme.colors.bg};
  min-height: ${p => p.theme.heights.fullPage};
`;
