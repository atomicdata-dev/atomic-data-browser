import React from 'react';
import { FaDownload } from 'react-icons/fa';
import styled from 'styled-components';
import { IconButton } from '../../components/IconButton/IconButton';
import { displayFileSize } from './displayFileSize';

interface DownloadButtonProps {
  downloadFile: () => void;
  fileSize?: number;
}

export function DownloadButton({
  downloadFile,
  fileSize,
}: DownloadButtonProps): JSX.Element {
  return (
    <IconButton
      title={`Download file (${displayFileSize(fileSize ?? 0)})`}
      onClick={downloadFile}
    >
      <DownloadIcon />
    </IconButton>
  );
}

const DownloadIcon = styled(FaDownload)`
  color: ${({ theme }) => theme.colors.main};
`;
