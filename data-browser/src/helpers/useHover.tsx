import { MutableRefObject, useEffect, useRef, useState } from 'react';

// hook returns tuple(array) with type [any, boolean]
// T - could be any type of HTML element like: HTMLDivElement, HTMLParagraphElement and etc.
export function useHover<T>(disabled: boolean): [MutableRefObject<T>, boolean] {
  const [value, setValue] = useState<boolean>(false);

  const ref = useRef<T | null>(null);
  const { current } = ref;

  const handleMouseOver = (): void => setValue(true);
  const handleMouseOut = (): void => setValue(false);

  useEffect(
    () => {
      // eslint-disable-next-line
      const node: any = current;
      // This could be expensive, and triggers re-renders for some reasons.
      // That's why it's disabled as much as possible.
      if (!disabled && node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener('mouseout', handleMouseOut);

        return () => {
          node.removeEventListener('mouseover', handleMouseOver);
          node.removeEventListener('mouseout', handleMouseOut);
        };
      }
    },
    [current, disabled], // Recall only if ref changes
  );

  // don't hover on touch screen devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    return [ref, false];
  }

  return [ref, value];
}
