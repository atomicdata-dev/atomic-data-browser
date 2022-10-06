import styled from 'styled-components';
import * as React from 'react';
import { useHover } from '../../helpers/useHover';
import { useSettings } from '../../helpers/AppSettings';
import { useWindowSize } from '../../helpers/useWindowSize';
import { appMenuItems } from './menuItems';
import { SideBarMenuItem } from './SideBarMenuItem';
import { SideBarDrive } from './SideBarDrive';
import { SideBarHeader } from './SideBarHeader';
import { DragAreaBase, useResizable } from '../../hooks/useResizable';
import { useCombineRefs } from '../../hooks/useCombineRefs';
import { About } from './About';
import { NavBarSpacer } from '../NavbarSpacer';

/** Amount of pixels where the sidebar automatically shows */
export const SIDEBAR_TOGGLE_WIDTH = 600;

const SideBarDriveMemo = React.memo(SideBarDrive);

export function SideBar(): JSX.Element {
  const { drive, sideBarLocked, setSideBarLocked } = useSettings();
  const [ref, hoveringOverSideBar] = useHover<HTMLElement>(sideBarLocked);
  const windowSize = useWindowSize();

  const { size, targetRef, dragAreaRef, isDragging } = useResizable(
    300,
    200,
    2000,
  );

  const isWideScreen = windowSize.width
    ? windowSize.width > SIDEBAR_TOGGLE_WIDTH
    : false;

  const mountRefs = useCombineRefs([ref, targetRef]);

  /**
   * This is called when the user presses a menu Item, which should result in a
   * closed menu in mobile context
   */
  const closeSideBar = React.useCallback(() => {
    // If the window is small, close the sidebar on click
    if (!isWideScreen) {
      setSideBarLocked(false);
    }
  }, [isWideScreen]);

  return (
    <SideBarContainer>
      <SideBarStyled
        ref={mountRefs}
        size={size}
        data-test='sidebar'
        locked={isWideScreen && sideBarLocked}
        exposed={sideBarLocked || (hoveringOverSideBar && isWideScreen)}
      >
        <NavBarSpacer position='top' />
        {/* The key is set to make sure the component is re-loaded when the baseURL changes */}
        <SideBarDriveMemo handleClickItem={closeSideBar} key={drive} />
        <SideBarBottom>
          <SideBarHeader>App</SideBarHeader>
          {appMenuItems.map(p => (
            <SideBarMenuItem
              key={p.label}
              {...p}
              handleClickItem={closeSideBar}
            />
          ))}{' '}
          <About />
        </SideBarBottom>
        <NavBarSpacer baseMargin='1rem' position='bottom' />
        <SideBarDragArea ref={dragAreaRef} isDragging={isDragging} />
      </SideBarStyled>
      <SideBarOverlay
        onClick={() => setSideBarLocked(false)}
        visible={sideBarLocked && !isWideScreen}
      />
    </SideBarContainer>
  );
}

interface SideBarStyledProps {
  locked: boolean;
  exposed: boolean;
  size: string;
}

interface SideBarOverlayProps {
  visible: boolean;
}

// eslint-disable-next-line prettier/prettier
const SideBarStyled = styled('nav').attrs<SideBarStyledProps>(p => ({
  style: {
    '--width': p.size,
  },
}))<SideBarStyledProps>`
  z-index: ${p => p.theme.zIndex.sidebar};
  box-sizing: border-box;
  background: ${p => p.theme.colors.bg};
  border-right: solid 1px ${p => p.theme.colors.bg2};
  transition: opacity 0.3s, left 0.3s;
  left: ${p => (p.exposed ? '0' : `calc(var(--width) * -1 + 0.5rem)`)};
  /* When the user is hovering, show half opacity */
  opacity: ${p => (p.exposed ? 1 : 0)};
  height: 100vh;
  width: var(--width);
  position: ${p => (p.locked ? 'relative' : 'absolute')};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

const SideBarBottom = styled('div')`
  margin-top: auto;
  flex-direction: column;
  justify-items: flex-end;
  display: flex;
  justify-content: end;
`;

/** Just needed for positioning the overlay */
const SideBarContainer = styled('div')`
  position: relative;
`;

/** Shown on mobile devices to close the panel */
const SideBarOverlay = styled.div<SideBarOverlayProps>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  transition: background-color 0.2s;
  background-color: ${p =>
    p.visible ? 'rgba(0, 0, 0, .5)' : 'rgba(0, 0, 0, 0.0)'};
  pointer-events: ${p => (p.visible ? 'auto' : 'none')};
  height: 100%;
  cursor: pointer;
  z-index: 1;
  -webkit-tap-highlight-color: transparent;
`;

const SideBarDragArea = styled(DragAreaBase)`
  height: 100%;
  width: 12px;
  right: -6px;
  top: 0;
  bottom: 0;
`;
