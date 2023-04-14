import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router';
import { useSettings } from '../helpers/AppSettings';
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

export function useNavigateWithTransition(onTransitionStart?: () => void) {
  const navigate = useNavigate();
  const { viewTransitionsEnabled } = useSettings();

  const navigateWithTransition = useCallback(
    (to: string | number) => {
      // @ts-ignore
      if (!viewTransitionsEnabled || !document.startViewTransition) {
        //@ts-ignore
        navigate(to);

        return;
      }

      // @ts-ignore
      document.startViewTransition(async () => {
        onTransitionStart?.();

        return new Promise<void>(resolve => {
          flushSync(() => {
            // @ts-ignore
            navigate(to);
            wait(1).then(() => {
              resolve();
            });
          });
        });
      });
    },
    [navigate, onTransitionStart],
  );

  return navigateWithTransition;
}
