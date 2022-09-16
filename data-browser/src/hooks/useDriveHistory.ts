import { Resource, useLocalStorage, useResources } from '@tomic/react';
import { useCallback } from 'react';
import { useUserDrives } from './useUserDrives';

const MAX_DRIVE_HISTORY = 5;

export function useDriveHistory(): [
  driveHistory: Map<string, Resource>,
  addDriveToHistory: (drive: string) => void,
] {
  const userDrives = useUserDrives();
  const [storedDriveHistory, setDriveHistory] = useLocalStorage<string[]>(
    'driveHistory',
    [],
  );

  const driveHistory = useResources(storedDriveHistory);

  const addDriveToHistory = useCallback(
    (drive: string) => {
      if (!userDrives.has(drive)) {
        setDriveHistory(prev => {
          if (prev[0] === drive) {
            return prev;
          }

          return [drive, ...prev.filter(d => d !== drive)].slice(
            0,
            MAX_DRIVE_HISTORY,
          );
        });
      }
    },
    [userDrives, setDriveHistory],
  );

  return [driveHistory, addDriveToHistory];
}
