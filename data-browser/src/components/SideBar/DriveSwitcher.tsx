import { Resource, urls, useResource } from '@tomic/react';
import React, { useMemo } from 'react';
import { FaCog, FaRegCheckCircle, FaRegCircle, FaServer } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../helpers/AppSettings';
import { useDriveHistory } from '../../hooks/useDriveHistory';
import { useUserDrives } from '../../hooks/useUserDrives';
import { paths } from '../../routes/paths';
import { DIVIDER, DropdownMenu } from '../Dropdown';
import { buildDefaultTrigger } from '../Dropdown/DefaultTrigger';
import { SideBarButton } from './ResourceSideBar/FloatingActions';

const Trigger = buildDefaultTrigger(
  <FaServer />,
  SideBarButton,
  'Open Drive Settings',
);

function getTitle(resource: Resource): string {
  return (
    (resource.get(urls.properties.name) as string) ?? resource.getSubject()
  );
}

function dedupeAFromB<K, V>(a: Map<K, V>, b: Map<K, V>): Map<K, V> {
  return new Map([...a].filter(([key]) => !b.has(key)));
}

export function DriveSwitcher() {
  const navigate = useNavigate();
  const { drive, setDrive } = useSettings();
  const drives = useUserDrives();
  const currentDriveResource = useResource(drive);
  const [history, addToHistory] = useDriveHistory();

  const buildHandleHistoryDriveClick = (subject: string) => () => {
    setDrive(subject);
    addToHistory(subject);
  };

  const items = useMemo(
    () => [
      // Dedupe history as there might be user drives in there if they were not loaded yet.
      ...Array.from(dedupeAFromB(history, drives).entries()).map(
        ([subject, resource]) => ({
          label: getTitle(resource),
          id: subject,
          helper: `Switch to ${getTitle(resource)}`,
          icon: subject === drive ? <FaRegCheckCircle /> : <FaRegCircle />,
          onClick: buildHandleHistoryDriveClick(subject),
          disabled: subject === drive,
        }),
      ),
      DIVIDER,
      ...Array.from(drives.entries()).map(([subject, resource]) => ({
        id: subject,
        label: getTitle(resource),
        helper: `Switch to ${getTitle(resource)}`,
        disabled: subject === drive,
        onClick: () => setDrive(subject),
        icon: subject === drive ? <FaRegCheckCircle /> : <FaRegCircle />,
      })),
      DIVIDER,
      {
        id: 'advanced',
        label: 'Configure Drives',
        icon: <FaCog />,
        helper: 'Load drives not displayed in this list.',
        onClick: () => navigate(paths.serverSettings),
      },
    ],
    [drives, currentDriveResource, drive, history],
  );

  return <DropdownMenu trigger={Trigger} items={items} />;
}
