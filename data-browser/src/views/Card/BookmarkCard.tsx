import { urls, useString, useTitle } from '@tomic/react';
import React from 'react';
import styled from 'styled-components';
import AtomicLink from '../../components/AtomicLink.jsx';
import Markdown from '../../components/datatypes/Markdown.jsx';
import {
  ExternalLink,
  ExternalLinkVariant,
} from '../../components/ExternalLink.jsx';
import { truncateMarkdown } from '../../helpers/truncateMarkdown.js';
import { CardViewProps } from './ResourceCard';

export function BookmarkCard({ resource }: CardViewProps): JSX.Element {
  const title = useTitle(resource);
  const [url] = useString(resource, urls.properties.bookmark.url);
  const [preview] = useString(resource, urls.properties.bookmark.preview);

  return (
    <>
      <AtomicLink subject={resource.getSubject()}>
        <Title>{title}</Title>
      </AtomicLink>
      <ExternalLink to={url} variant={ExternalLinkVariant.Button}>
        Open site
      </ExternalLink>
      {preview ? (
        <MarkdownWrapper>
          <Markdown
            renderGFM
            text={truncateMarkdown(preview, 1000) as string}
          />
        </MarkdownWrapper>
      ) : (
        <Spacer />
      )}
    </>
  );
}

const Title = styled.h2`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

const MarkdownWrapper = styled.div`
  margin-top: ${p => p.theme.margin}rem;
  margin-inline: -${p => p.theme.margin}rem;
  padding: ${p => p.theme.margin}rem;
  background-color: ${props => props.theme.colors.bgBody};
  border-top: 1px solid ${props => props.theme.colors.bg2};

  img {
    border-radius: ${props => props.theme.radius};
  }
`;

const Spacer = styled.div`
  height: 1rem;
`;
