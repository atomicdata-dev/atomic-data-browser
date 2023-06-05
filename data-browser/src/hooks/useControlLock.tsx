import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

interface ControlLockContextType {
  locks: Set<string>;
  requestLock: (lockId: string) => void;
  releaseLock: (lockId: string) => void;
}

const ControlLockContext = createContext<ControlLockContextType>({
  locks: new Set(),
  requestLock: () => undefined,
  releaseLock: () => undefined,
});

export function ControlLockProvider({ children }: React.PropsWithChildren) {
  const [locks, setLocks] = useState<Set<string>>(new Set());

  const requestLock = useCallback((lockId: string) => {
    setLocks(items => new Set([...items, lockId]));
  }, []);

  const releaseLock = useCallback(
    (lockId: string) => {
      if (!locks.has(lockId)) {
        return;
      }

      setLocks(items => {
        const newItems = new Set(items);
        newItems.delete(lockId);

        return newItems;
      });
    },
    [locks],
  );

  const context = useMemo(
    () => ({
      locks,
      requestLock,
      releaseLock,
    }),
    [locks, requestLock, releaseLock],
  );

  return (
    <ControlLockContext.Provider value={context}>
      {children}
    </ControlLockContext.Provider>
  );
}

/** If used a lock will be requested on the controls so other keyboard controlled UI elements won't work while this component is mounted.
 * Primarily used by dialogs, dropdowns and popovers.
 */
export function useControlLock(active: boolean): void {
  const id = useId();
  const { requestLock, releaseLock } = useContext(ControlLockContext);

  useEffect(() => {
    if (active) {
      requestLock(id);

      return () => {
        releaseLock(id);
      };
    } else {
      releaseLock(id);
    }
  }, [active]);
}

export function useHasControlLock() {
  const { locks } = useContext(ControlLockContext);

  return locks.size > 0;
}
