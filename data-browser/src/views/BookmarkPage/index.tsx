import { ResourcePageProps } from '../ResourcePage';
//@ts-ignore
import React from 'react';
import ResourceField from '../../components/forms/ResourceField';
import { urls, useString } from '@tomic/react';
import { EditableTitle } from '../../components/EditableTitle';
import styled from 'styled-components';
import { ContainerFull, ContainerNarrow } from '../../components/Containers';
import { BookmarkPreview } from './BookmarkPreview';
import {
  ExternalLink,
  ExternalLinkVariant,
} from '../../components/ExternalLink.jsx';
import ValueComp from '../../components/ValueComp.jsx';
import PropVal from '../../components/PropVal.jsx';

export function BookmarkPage({ resource }: ResourcePageProps): JSX.Element {
  const [url] = useString(resource, urls.properties.bookmark.url);

  return (
    <Wrapper>
      <ContainerFull>
        <EditableTitle resource={resource} propertyURL={urls.properties.name} />
      </ContainerFull>
      <ControlWrapper>
        <ContainerFull>
          <ControlBar>
            <FieldWrapper>
              {/* <ResourceField
                required
                resource={resource}
                propertyURL={urls.properties.bookmark.url}
              /> */}
              <PropVal
                propertyURL={urls.properties.bookmark.url}
                resource={resource}
                editable
              />
            </FieldWrapper>
            <ExternalLink to={url} variant={ExternalLinkVariant.Button}>
              Open site{' '}
            </ExternalLink>
          </ControlBar>
        </ContainerFull>
      </ControlWrapper>
      <PreviewWrapper>
        <BookmarkPreview resource={resource} />
      </PreviewWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: ${p => p.theme.margin}rem;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;

  ${ContainerFull}, ${ContainerNarrow} {
    padding-bottom: unset;
  }
`;

const ControlWrapper = styled.div`
  position: sticky;
  top: 0rem;
  background-color: ${p => p.theme.colors.bgBody};
  border-bottom: solid 1px ${props => props.theme.colors.bg2};
  padding: 0rem;
`;

const FieldWrapper = styled.div`
  flex: 1;
`;

const ControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => p.theme.margin}rem;
`;

const PreviewWrapper = styled.div`
  background-color: ${props => props.theme.colors.bg};
  flex: 1;
`;
