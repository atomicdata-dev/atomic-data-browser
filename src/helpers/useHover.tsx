import { MutableRefObject, useEffect, useRef, useState } from 'react';

// hook returns tuple(array) with type [any, boolean]
// T - could be any type of HTML element like: HTMLDivElement, HTMLParagraphElement and etc.
export function useHover<T>(): [MutableRefObject<T>, boolean] {
  const [value, setValue] = useState<boolean>(false);

  const ref = useRef<T | null>(null);

  const handleMouseOver = (): void => setValue(true);
  const handleMouseOut = (): void => setValue(false);

  useEffect(
    () => {
      const node: any = ref.current;
      if (node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener('mouseout', handleMouseOut);

        return () => {
          node.removeEventListener('mouseover', handleMouseOver);
          node.removeEventListener('mouseout', handleMouseOut);
        };
      }
    },
    [ref.current], // Recall only if ref changes
  );

  // don't hover on touch screen devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    return [ref, false];
  }

  return [ref, value];
}
