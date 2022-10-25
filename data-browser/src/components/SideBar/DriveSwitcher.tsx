import { classes, Resource, urls, useResources } from '@tomic/react';
import React, { useMemo } from 'react';
import {
  FaCog,
  FaHdd,
  FaPlus,
  FaRegCheckCircle,
  FaRegCircle,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../helpers/AppSettings';
import { constructOpenURL } from '../../helpers/navigation';
import { useDriveHistory } from '../../hooks/useDriveHistory';
import { useSavedDrives } from '../../hooks/useSavedDrives';
import { paths } from '../../routes/paths';
import { DIVIDER, DropdownMenu } from '../Dropdown';
import { buildDefaultTrigger } from '../Dropdown/DefaultTrigger';
import { useDefaultNewInstanceHandler } from '../NewInstanceButton';

const Trigger = buildDefaultTrigger(<FaHdd />, 'Open Drive Settings');

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
  const { drive, setDrive, agent } = useSettings();
  const [savedDrives] = useSavedDrives();
  const [history, addToHistory] = useDriveHistory(savedDrives, 5);

  const savedDrivesMap = useResources(savedDrives);
  const historyMap = useResources(history);

  const buildHandleHistoryDriveClick = (subject: string) => () => {
    setDrive(subject);
    addToHistory(subject);
    navigate(constructOpenURL(subject));
  };

  const createNewDrive = useDefaultNewInstanceHandler(
    classes.drive,
    agent?.subject,
  );

  const items = useMemo(
    () => [
      ...Array.from(savedDrivesMap.entries())
        .map(([subject, resource]) => ({
          id: subject,
          label: getTitle(resource),
          helper: `Switch to ${getTitle(resource)}`,
          disabled: subject === drive,
          onClick: () => {
            setDrive(subject);
            navigate(constructOpenURL(subject));
          },
          icon: subject === drive ? <FaRegCheckCircle /> : <FaRegCircle />,
        }))
        .slice(0, 5),
      DIVIDER,
      // Dedupe history from savedDrives bause not all savedDrives might be loaded yet.
      ...Array.from(dedupeAFromB(historyMap, savedDrivesMap))
        .map(([subject, resource]) => ({
          label: getTitle(resource),
          id: subject,
          helper: `Switch to ${getTitle(resource)}`,
          icon: subject === drive ? <FaRegCheckCircle /> : <FaRegCircle />,
          onClick: buildHandleHistoryDriveClick(subject),
          disabled: subject === drive,
        }))
        .slice(0, 5),
      DIVIDER,
      {
        id: 'configure-drives',
        label: 'Configure Drives',
        icon: <FaCog />,
        helper: 'Load drives not displayed in this list.',
        onClick: () => navigate(paths.serverSettings),
      },
      {
        id: 'new-drive',
        label: 'New Drive',
        icon: <FaPlus />,
        helper: 'Create a new drive',
        onClick: createNewDrive,
      },
    ],
    [savedDrivesMap, drive, historyMap],
  );

  return <DropdownMenu trigger={Trigger} items={items} />;
}
