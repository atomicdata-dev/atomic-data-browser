import React, {
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import styled from 'styled-components';
import { useClickAwayListener } from '../../hooks/useClickAwayListener';
import { Button } from '../Button';
import { DropdownTriggerRenderFunction } from './DropdownTrigger';
import { shortcuts } from '../HotKeyWrapper';
import { Shortcut } from '../Shortcut';
import { transition } from '../../helpers/transition';
import { createPortal } from 'react-dom';
import { DropdownPortalContext } from './dropdownContext';
import { loopingIndex } from '../../helpers/loopingIndex';
import { useControlLock } from '../../hooks/useControlLock';

export const DIVIDER = 'divider' as const;

export type MenuItemMinimial = {
  onClick: () => unknown;
  label: string;
  helper?: string;
  id: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Keyboard shortcut helper */
  shortcut?: string;
};

export type Item = typeof DIVIDER | MenuItemMinimial;

interface DropdownMenuProps {
  /** The list of menu items */
  items: Item[];
  trigger: DropdownTriggerRenderFunction;
  /** Enables the keyboard shortcut */
  isMainMenu?: boolean;
  bindActive?: (active: boolean) => void;
}

export const isItem = (
  item: MenuItemMinimial | string | undefined,
): item is MenuItemMinimial =>
  typeof item !== 'string' && typeof item?.label === 'string';

const shouldSkip = (item?: Item) => !isItem(item) || item.disabled;

const getAdditionalOffest = (increment: number) =>
  increment === 0 ? 1 : Math.sign(increment);

/**
 * Returns a function that finds the next available index, it skips disabled
 * items and dividers and loops around when at the start or end of the list.
 * Returns 0 when no suitable index is found.
 */
const createIndexOffset =
  (items: Item[]) => (startingPoint: number, offset: number) => {
    const findNextAvailable = (
      scopedStartingPoint: number,
      scopedOffset: number,
    ) => {
      const newIndex = loopingIndex(
        scopedStartingPoint + scopedOffset,
        items.length,
      );

      const additionalIncrement = getAdditionalOffest(offset);

      if (shouldSkip(items[newIndex])) {
        return findNextAvailable(newIndex, additionalIncrement);
      }

      return newIndex;
    };

    return findNextAvailable(startingPoint, offset);
  };

function normalizeItems(items: Item[]) {
  return items.reduce((acc: Item[], current, i) => {
    // If the item is a divider at the start or end of the list, remove it.
    if ((i === 0 || i === items.length - 1) && !isItem(current)) {
      return acc;
    }

    // If the current and previous item are dividers, remove the current one.
    if (!isItem(current) && !isItem(acc[i - 1])) {
      return acc;
    }

    return [...acc, current];
  }, []);
}

/**
 * Menu that opens on click and shows a bunch of items. Closes on Escape and on
 * clicking outside. Use arrow keys to select items, and open items on Enter.
 * Renders the Dropdown on a place where there is room on screen.
 */
export function DropdownMenu({
  items,
  trigger,
  isMainMenu,
  bindActive = () => undefined,
}: DropdownMenuProps): JSX.Element {
  const menuId = useId();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isActive, _setIsActive] = useState(false);

  useControlLock(isActive);

  const setIsActive = useCallback(
    (active: boolean) => {
      _setIsActive(active);
      bindActive(active);
    },
    [bindActive],
  );

  const handleClose = useCallback(() => {
    triggerRef.current?.focus();
    setTimeout(() => {
      setIsActive(false);
    }, 100);
  }, [setIsActive]);

  useClickAwayListener([triggerRef, dropdownRef], handleClose, isActive, [
    'click',
    'mouseout',
  ]);

  const normalizedItems = useMemo(() => normalizeItems(items), [items]);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const getNewIndex = createIndexOffset(normalizedItems);
  const [selectedIndex, setSelectedIndex] = useState<number>(getNewIndex(0, 0));
  // if the keyboard is used to navigate the menu items
  const [useKeys, setUseKeys] = useState(true);

  const handleToggle = useCallback(() => {
    if (isActive) {
      handleClose();

      return;
    }

    setIsActive(true);

    requestAnimationFrame(() => {
      if (!triggerRef.current || !dropdownRef.current) {
        return;
      }

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuRect = dropdownRef.current.getBoundingClientRect();
      const topPos = triggerRect.y - menuRect.height;

      // If the top is outside of the screen, render it below
      if (topPos < 0) {
        setY(triggerRect.y + triggerRect.height / 2);
      } else {
        setY(topPos + triggerRect.height / 2);
      }

      const leftPos = triggerRect.x - menuRect.width;

      // If the left is outside of the screen, render it to the right
      if (leftPos < 0) {
        setX(triggerRect.x);
      } else {
        setX(triggerRect.x - menuRect.width + triggerRect.width);
      }

      // The dropdown is hidden at first because in the first few frames it is still position at 0,0.
      // We only want to show the dropdown after it has been positioned correctly.
      requestAnimationFrame(() => {
        dropdownRef.current!.style.visibility = 'visible';
      });
    });
  }, [isActive, setIsActive]);

  const handleMouseOverMenu = useCallback(() => {
    setUseKeys(false);
  }, []);

  const handleTriggerActivate = useCallback(() => {
    setUseKeys(true);
    setSelectedIndex(getNewIndex(0, 0));
    handleToggle();
  }, [handleToggle]);

  // Close the menu
  useHotkeys('esc', handleClose, { enabled: isActive });
  useHotkeys(
    'tab',
    e => {
      e.preventDefault();
      handleClose();
    },
    { enabled: isActive },
  );

  // Toggle menu
  useHotkeys(
    shortcuts.menu,
    e => {
      e.preventDefault();
      handleToggle();
      setUseKeys(true);
    },
    { enabled: !!isMainMenu },
    [isActive],
  );
  // Click / open the item
  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      (normalizedItems[selectedIndex] as MenuItemMinimial).onClick();
      handleClose();
    },
    { enabled: isActive },
    [selectedIndex, normalizedItems],
  );
  // Move up (or to bottom if at top)
  useHotkeys(
    'up',
    e => {
      e.preventDefault();
      e.stopPropagation();
      setUseKeys(true);
      setSelectedIndex(prev => getNewIndex(prev, -1));
    },
    { enabled: isActive },
    [getNewIndex],
  );
  // Move down (or to top if at bottom)
  useHotkeys(
    'down',
    e => {
      e.preventDefault();
      e.stopPropagation();
      setUseKeys(true);
      setSelectedIndex(prev => getNewIndex(prev, 1));

      return false;
    },
    { enabled: isActive },
    [getNewIndex],
  );

  const Trigger = useMemo(() => React.forwardRef(trigger), []);

  const handleBlur = useCallback(() => {
    // Doesn't work without delay, maybe the browser sets document.activeElement after firering the blur event?
    requestAnimationFrame(() => {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(document.activeElement)) {
        handleClose();
      }
    });
  }, [handleClose]);

  return (
    <>
      <Trigger
        ref={triggerRef}
        onClick={handleTriggerActivate}
        isActive={isActive}
        menuId={menuId}
      />
      {isActive && (
        <DropdownPortal>
          <Menu
            ref={dropdownRef}
            isActive={isActive}
            x={x}
            y={y}
            id={menuId}
            onMouseOver={handleMouseOverMenu}
            onBlur={handleBlur}
            aria-labelledby={triggerRef.current?.id}
            role='menu'
          >
            {normalizedItems.map((props, i) => {
              if (!isItem(props)) {
                return <ItemDivider key={i} />;
              }

              const { label, onClick, helper, id, disabled, shortcut, icon } =
                props;

              return (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    onClick();
                  }}
                  id={id}
                  data-test={`menu-item-${id}`}
                  disabled={disabled}
                  key={id}
                  helper={shortcut ? `${helper} (${shortcut})` : helper}
                  label={label}
                  selected={useKeys && selectedIndex === i}
                  icon={icon}
                  shortcut={shortcut}
                />
              );
            })}
          </Menu>
        </DropdownPortal>
      )}
    </>
  );
}

const DropdownPortal = ({ children }: React.PropsWithChildren) => {
  const portalRef = useContext(DropdownPortalContext);

  if (!portalRef.current) {
    return null;
  }

  return createPortal(children, portalRef.current);
};

interface MenuProps {
  isActive: boolean;
  x: number;
  y: number;
}

export interface MenuItemSidebarProps extends MenuItemMinimial {
  handleClickItem?: () => unknown;
}

interface MenuItemPropsExtended extends MenuItemSidebarProps {
  selected: boolean;
}

export function MenuItem({
  onClick,
  selected,
  helper,
  disabled,
  shortcut,
  icon,
  label,
  ...props
}: MenuItemPropsExtended): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);

  if (selected && document.activeElement !== ref.current) {
    ref.current?.focus();
  }

  return (
    <MenuItemStyled
      clean
      ref={ref}
      onClick={onClick}
      selected={selected}
      title={helper}
      disabled={disabled}
      role='menuitem'
      tabIndex={-1}
      {...props}
    >
      {icon}
      <StyledLabel>{label}</StyledLabel>
      {shortcut && <StyledShortcut shortcut={shortcut} />}
    </MenuItemStyled>
  );
}

const StyledShortcut = styled(Shortcut)`
  margin-left: 0.3rem;
`;

const StyledLabel = styled.span`
  flex: 1;
`;

interface MenuItemStyledProps {
  selected: boolean;
}

const MenuItemStyled = styled(Button)<MenuItemStyledProps>`
  align-items: center;
  display: flex;
  gap: 0.5rem;
  width: 100%;
  text-align: left;
  color: ${p => p.theme.colors.text};
  padding: 0.4rem 1rem;
  height: auto;
  text-transform: capitalize;
  background-color: ${p =>
    p.selected ? p.theme.colors.bg1 : p.theme.colors.bg};
  text-decoration: ${p => (p.selected ? 'underline' : 'none')};

  &:hover {
    background-color: ${p => p.theme.colors.bg1};
  }
  &:active {
    background-color: ${p => p.theme.colors.bg2};
  }
  &:disabled {
    color: ${p => p.theme.colors.textLight};
    cursor: default;
    &:hover {
      cursor: 'default';
    }
    background-color: ${p => p.theme.colors.bg};
  }

  svg {
    color: ${p => p.theme.colors.textLight};
  }
`;

const ItemDivider = styled.div`
  width: 100%;
  border-bottom: 1px solid ${p => p.theme.colors.bg2};
`;

const Menu = styled.div<MenuProps>`
  visibility: hidden;
  font-size: 0.9rem;
  overflow: hidden;
  background: ${p => p.theme.colors.bg};
  border: ${p =>
    p.theme.darkMode ? `solid 1px ${p.theme.colors.bg2}` : 'none'};
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  border-radius: 8px;
  position: fixed;
  z-index: ${p => p.theme.zIndex.dropdown};
  top: ${p => p.y}px;
  left: ${p => p.x}px;
  width: auto;
  box-shadow: ${p => p.theme.boxShadowSoft};
  opacity: ${p => (p.isActive ? 1 : 0)};

  ${transition('opacity')};
`;
