import React from 'react';
import NewIntanceButton from '../../components/NewInstanceButton';
import { Card, CardInsideFull, CardRow } from '../../components/Card';
import { ResourceInline } from '../../views/ResourceInline';
import { urls } from '@tomic/react';
import styled from 'styled-components';
import { Button } from '../../components/Button';
import { useSettings } from '../../helpers/AppSettings';
import { isDev } from '../../config';

export interface DriveCardProps {
  userDrives: string[];
  onDriveSelect: (drive: string) => void;
}

const rootDrives = [
  'https://atomicdata.dev',
  window.location.origin,
  ...(isDev() ? ['http://localhost:9883'] : []),
];

export function DrivesCard({
  userDrives,
  onDriveSelect,
}: DriveCardProps): JSX.Element {
  const { drive } = useSettings();

  return (
    <Card>
      <CardInsideFull>
        {rootDrives.map((subject, i) => {
          return (
            <CardRow key={subject} noBorder={i === 0}>
              <DriveRow
                subject={subject}
                onClick={onDriveSelect}
                disabled={subject === drive}
              />
            </CardRow>
          );
        })}
        {userDrives.map(subject => {
          return (
            <CardRow key={subject}>
              <DriveRow
                subject={subject}
                onClick={onDriveSelect}
                disabled={subject === drive}
              />
            </CardRow>
          );
        })}
        <CardRow>
          <StyledNewInstanceButton
            klass={urls.classes.drive}
            subtle
            icon
            label='New Drive'
          />
        </CardRow>
      </CardInsideFull>
    </Card>
  );
}

interface DriveRowProps {
  subject: string;
  onClick: (subject: string) => void;
  disabled?: boolean;
}

function DriveRow({ subject, onClick, disabled }: DriveRowProps) {
  return (
    <DriveRowWrapper>
      <ResourceInline subject={subject} />
      <SelectButton onClick={() => onClick(subject)} disabled={disabled}>
        Select
      </SelectButton>
    </DriveRowWrapper>
  );
}

const DriveRowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledNewInstanceButton = styled(NewIntanceButton)`
  border: none;
  box-shadow: none;
  padding: 0;

  &&:hover,
  &&:focus {
    box-shadow: none;
  }
`;

const SelectButton = styled(Button)`
  background-color: ${p => (p.disabled ? p.theme.colors.main : 'transparent')};
  color: ${p => (p.disabled ? 'white' : p.theme.colors.main)};
`;
