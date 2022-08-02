import { ResourcePageProps } from '../ResourcePage';
import React, { useCallback } from 'react';
import { urls, useString } from '@tomic/react';
import { EditableTitle } from '../../components/EditableTitle';
import styled from 'styled-components';
import { ContainerFull, ContainerNarrow } from '../../components/Containers';
import { BookmarkPreview } from './BookmarkPreview';
import {
  ExternalLink,
  ExternalLinkVariant,
} from '../../components/ExternalLink';
import { usePreview } from './usePreview';
import { InputStyled, InputWrapper } from '../../components/forms/InputStyles';

export function BookmarkPage({ resource }: ResourcePageProps): JSX.Element {
  const [url, setUrl] = useString(resource, urls.properties.bookmark.url, {
    commit: true,
  });

  const [preview, previewHasError, updatePreview] = usePreview(resource);

  const handleUrlChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      await setUrl(e.target.value);
      updatePreview(e.target.value);
    },
    [setUrl, updatePreview],
  );

  return (
    <>
      <Wrapper>
        <ContainerFull>
          <EditableTitle
            resource={resource}
            propertyURL={urls.properties.name}
          />
        </ContainerFull>
        <ControlWrapper>
          <ContainerFull>
            <ControlBar>
              <FieldWrapper>
                <InputWrapper>
                  <InputStyled
                    placeholder='https://example.com'
                    value={url}
                    onChange={handleUrlChange}
                  />
                </InputWrapper>
              </FieldWrapper>
              <ExternalLink to={url} variant={ExternalLinkVariant.Button}>
                Open site{' '}
              </ExternalLink>
            </ControlBar>
          </ContainerFull>
        </ControlWrapper>
        <PreviewWrapper>
          <BookmarkPreview preview={preview} error={previewHasError} />
        </PreviewWrapper>
      </Wrapper>
    </>
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
  top: 0.5rem;
  background-color: ${p => p.theme.colors.bgBody};
  border-bottom: solid 1px ${props => props.theme.colors.bg2};
  padding: 0rem;
  align-items: center;
`;

const FieldWrapper = styled.div`
  flex: 1;
`;

const ControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => p.theme.margin}rem;
  margin-bottom: ${p => p.theme.margin}rem;
`;

const PreviewWrapper = styled.div`
  background-color: ${props => props.theme.colors.bg};
  flex: 1;
`;
