import { useEffect } from 'react';

type RefList = Array<React.RefObject<HTMLElement | null>>;

const elementsHaveFocus = (refs: RefList) =>
  refs.some(ref => document.activeElement === ref.current);

const elementsContainTarget = (refs: RefList, target: HTMLElement) =>
  refs
    .filter(r => r.current)
    .some(ref => ref.current === target || ref.current.contains(target));

/**
 * Detects when a user clicks outside of any of the given elements.
 *
 * @param refs List of element refs that will not trigger the listener when clicked.
 * @param onClickAway Callback that will be called when the user clicks outside
 *   of any of the given elements.
 * @param shouldListen When false the callback will not be called.
 */
export const useClickAwayListener = (
  refs: RefList,
  onClickAway: () => void,
  shouldListen = true,
): void => {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        shouldListen &&
        !elementsHaveFocus(refs) &&
        !elementsContainTarget(refs, e.target as HTMLElement)
      ) {
        e.preventDefault();
        onClickAway();
        window.removeEventListener('click', onClick);
      }
    };

    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [refs, onClickAway, shouldListen]);
};
