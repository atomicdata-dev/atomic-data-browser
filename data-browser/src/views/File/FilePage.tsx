import { properties } from '@tomic/react';
import React from 'react';
import styled from 'styled-components';
import { ContainerWide } from '../../components/Containers';
import { EditableTitle } from '../../components/EditableTitle';
import { ValueForm } from '../../components/forms/ValueForm';
import { Column, Row } from '../../components/Row';
import { useFileInfo } from '../../hooks/useFile';
import { ResourcePageProps } from '../ResourcePage';
import { DownloadButton } from './DownloadButton';
import { FilePreview } from './FilePreview';

/** Full page File resource for showing and downloading files */
export function FilePage({ resource }: ResourcePageProps) {
  const { downloadFile, bytes } = useFileInfo(resource);

  return (
    <ContainerWide about={resource.getSubject()}>
      <Column>
        <Row center>
          <DownloadButton downloadFile={downloadFile} fileSize={bytes} />
          <StyledEditableTitle resource={resource} />
        </Row>
        <ValueForm resource={resource} propertyURL={properties.description} />
        <FilePreview resource={resource} />
      </Column>
    </ContainerWide>
  );
}

const StyledEditableTitle = styled(EditableTitle)`
  margin: 0;
`;
