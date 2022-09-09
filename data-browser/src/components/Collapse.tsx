import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { timeoutEffect, timeoutEffects } from '../helpers/timeoutEffect';
import { animationDuration } from '../styling';

export interface CollapseProps {
  open: boolean;
  /** Animation speed in ms, Defaults to the animation duration defined in the theme */
  duration?: number;
  className?: string;
}

const SPEED_MODIFIER = 1.5;

export function Collapse({
  open,
  children,
  duration,
  className,
}: React.PropsWithChildren<CollapseProps>): JSX.Element {
  const node = useRef<HTMLDivElement>(null);
  const [initialHeight, setInitialHeight] = React.useState(0);
  const openRef = useRef(open);

  const measureAndSet = () => {
    const div = node.current;

    div.style.height = 'inital';
    const height = div.scrollHeight;

    setInitialHeight(height);

    div.style.position = 'static';

    // When this function is used as a callback for the MutationObserver the scope will be outdated when the props update.
    // To work around this we have to use a ref in order to reference the most up to date value.
    if (!openRef.current) {
      div.style.height = '0px';
      div.style.visibility = 'hidden';
    } else {
      div.style.height = `${height}px`;
      div.style.visibility = 'visible';
    }
  };

  const mutationObserver = useRef(new MutationObserver(measureAndSet));

  const speed = duration ?? animationDuration * SPEED_MODIFIER;

  // Measure the height of the element when it is added to the DOM.
  const onRefConnect = useCallback((div: HTMLDivElement) => {
    if (!div) return;

    node.current = div;
    measureAndSet();
  }, []);

  // Measure the height again when a child is added or removed.
  useEffect(() => {
    mutationObserver.current.observe(node.current, { childList: true });

    return () => mutationObserver.current.disconnect();
  }, []);

  useLayoutEffect(() => {
    openRef.current = open;
    if (!node.current) return;

    const wrapper = node.current;

    if (open) {
      wrapper.style.visibility = 'visible';
      wrapper.style.height = `${initialHeight}px`;

      // after the animation has finished, remove the set height so the element can grow if it needs to.
      return timeoutEffect(() => {
        wrapper.style.overflowY = 'visible';
        wrapper.style.height = 'initial';
      }, speed);
    } else {
      // recalculate the height as it might have changed, then set it so it can be animated from.
      const newHeight = wrapper.scrollHeight;
      setInitialHeight(newHeight);
      wrapper.style.height = `${newHeight}px`;
      wrapper.style.overflowY = 'hidden';

      return timeoutEffects(
        [
          () => {
            wrapper.style.height = '0px';
          },
          0,
        ],
        [
          () => {
            wrapper.style.visibility = 'hidden';
          },
          speed,
        ],
      );
    }
  }, [open]);

  return (
    <Wrapper ref={onRefConnect} duration={speed} className={className}>
      {children}
    </Wrapper>
  );
}

interface WrapperProps {
  duration: number;
}

const Wrapper = styled.div<WrapperProps>`
  overflow-y: hidden;
  transition: height ${p => p.duration}ms ease-in-out;

  @media (prefers-reduced-motion) {
    transition: unset;
  }
`;
