import {
  Resource,
  urls,
  useArray,
  useLocalStorage,
  useResource,
  useResources,
} from '@tomic/react';
import React, { useEffect, useMemo } from 'react';
import { FaCog, FaRegCheckCircle, FaRegCircle, FaServer } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../helpers/AppSettings';
import { paths } from '../../routes/paths';
import { DIVIDER, DropdownMenu } from '../Dropdown';
import { buildDefaultTrigger } from '../Dropdown/DefaultTrigger';

const MAX_DRIVE_HISTORY = 5;

const Trigger = buildDefaultTrigger(<FaServer />);

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
  const drives = useDrives();
  const currentDriveResource = useResource(drive);
  const history = useDriveHistory(drives);

  const items = useMemo(
    () => [
      ...Array.from(dedupeAFromB(history, drives).entries()).map(
        ([subject, resource]) => ({
          label: getTitle(resource),
          id: subject,
          helper: `Switch to ${getTitle(resource)}`,
          icon: subject === drive ? <FaRegCheckCircle /> : <FaRegCircle />,
          onClick: () => setDrive(subject),
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

function useDriveHistory(userDrives: Map<string, Resource>) {
  const { drive } = useSettings();
  const [storedDriveHistory, setDriveHistory] = useLocalStorage<string[]>(
    'driveHistory',
    [],
  );

  const driveHistory = useResources(storedDriveHistory);

  useEffect(() => {
    if (!userDrives.has(drive) && storedDriveHistory[0] !== drive) {
      setDriveHistory(prev =>
        [drive, ...prev.filter(d => d !== drive)].slice(0, MAX_DRIVE_HISTORY),
      );
    }
  }, [userDrives, drive, setDriveHistory, storedDriveHistory]);

  return driveHistory;
}

function useDrives() {
  const { agent } = useSettings();
  const agentResource = useResource(agent?.subject);
  const [driveSubjects] = useArray(agentResource, urls.properties.drives);
  const drives = useResources(driveSubjects);

  return drives;
}
