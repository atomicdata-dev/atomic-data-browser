import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaCaretDown, FaTimes, FaTrash } from 'react-icons/fa';
import styled, { css } from 'styled-components';
import { useLocalSearch } from '../../helpers/useLocalSearch';
import { ButtonInput } from '../Button';
import ResourceInline from '../../views/ResourceInline';
import { InputOverlay, InputStyled, InputWrapper } from './InputStyles';
import ResourceLine from '../../views/ResourceLine';

interface DropDownListProps {
  required?: boolean;
  initial?: string;
  /** Is called when a value is selected */
  onUpdate: (value: string) => unknown;
  /** A set of Subjects from which the user can choose */
  options: string[];
  /** Is called when the entire value is removed. Renders a trashcan button if passed */
  onRemove?: () => unknown;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Renders an input field with a dropdown menu. You can search through the
 * items, select them from a list, clear the entire thing
 */
export function DropdownInput({
  required,
  initial,
  placeholder,
  onRemove,
  onUpdate,
  options,
  disabled,
  ...props
}: DropDownListProps): JSX.Element {
  const [inputValue, setInputValue] = useState<string>(initial ? initial : '');
  const [selectedItem, setSelectedItem] = useState<string | undefined>(initial);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  // if the keyboard is used to navigate the dropdown items
  // hides the mouse cursor interactions with elements
  const [useKeys, setUseKeys] = useState<boolean>(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close the dropdown when the user clicks outside of it
  useEffect(() => {
    const onClick = e => {
      // If the active element exists and is clicked outside of
      if (
        !isFocus &&
        dropdownRef.current !== null &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(!isOpen);
      }
    };

    // If the item is active (ie open) then listen for clicks outside
    if (isOpen) {
      window.addEventListener('click', onClick);
    }

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [isOpen, dropdownRef, isFocus]);

  // Close the menu
  useHotkeys(
    'esc',
    e => {
      e.preventDefault();
      setIsOpen(false);
    },
    { enabled: isOpen, enableOnTags: ['INPUT'] },
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputValue(val);
    setUseKeys(true);
    setIsFocus(true);
    setIsOpen(true);
    onUpdate(val);
    setSelectedIndex(0);
    if (val == '') {
      setSelectedItem(null);
    } else {
      setSelectedItem(val);
    }
  }

  function clearSelection() {
    setInputValue('');
    setSelectedItem(null);
    onUpdate(null);
    inputRef.current.focus();
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setSelectedIndex(0);
    setIsFocus(true);
    setIsOpen(true);
    e.target.select();
    // This delay helps make sure the entire text is selected
    setTimeout(function () {
      e.target.select();
    }, 20);
  }

  function handleBlur() {
    setIsFocus(false);
    // for some reason this prevents that no item can be selected from the dropdown.
    // HandleBlur is called before the setInput handle is called, so the click on the DropdownInput is not caught.
    setTimeout(function () {
      setIsOpen(false);
    }, 150);
  }

  return (
    <DropDownStyled>
      <InputWrapper>
        <ResourceInputOverlayWrapper>
          {selectedItem && !isFocus && (
            <InputOverlay>
              <ResourceInline subject={selectedItem} untabbable />
            </InputOverlay>
          )}
          <InputStyled
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            size={5}
            required={required}
            placeholder={placeholder}
            // This might not be the most pretty approach, maybe I should use an overlay element
            // That would also allow for a richer resource view in the input
            value={inputValue}
            onChange={handleInputChange}
            ref={inputRef}
            {...props}
          />
        </ResourceInputOverlayWrapper>
        {selectedItem ? (
          <ButtonInput
            disabled={disabled}
            type='button'
            onClick={clearSelection}
            title='clear selection'
            aria-label='clear selection'
          >
            <FaTimes />
          </ButtonInput>
        ) : null}
        {options.length > 0 && selectedItem == undefined && (
          <ButtonInput
            disabled={disabled}
            type='button'
            onClick={() => setIsOpen(!isOpen)}
            title='toggle menu'
            aria-label={'toggle menu'}
          >
            <FaCaretDown />
          </ButtonInput>
        )}
        {onRemove !== undefined && (
          <ButtonInput
            disabled={disabled}
            type='button'
            onClick={onRemove}
            title='remove item'
            aria-label='remove item'
          >
            <FaTrash />
          </ButtonInput>
        )}
      </InputWrapper>{' '}
      <DropDownWrapperWrapper onMouseEnter={() => setUseKeys(false)}>
        {isOpen ? (
          <DropDownItemsMenu
            options={options}
            dropdownRef={dropdownRef}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            setInputValue={setInputValue}
            setSelectedItem={setSelectedItem}
            onUpdate={onUpdate}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            useKeys={useKeys}
            setUseKeys={setUseKeys}
            inputValue={inputValue}
          />
        ) : null}
      </DropDownWrapperWrapper>
    </DropDownStyled>
  );
}

interface DropDownItemsMenuProps {
  dropdownRef: React.MutableRefObject<null>;
  options: string[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  useKeys: boolean;
  setUseKeys: (useKeys: boolean) => void;
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  setSelectedItem: (item: string | null) => void;
  onUpdate: (item: string | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}

function scrollIntoView(
  index: number,
  dropdownRef: React.MutableRefObject<null>,
) {
  // @ts-ignore
  const currentElm = dropdownRef?.current?.children[index];
  currentElm?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * The actual Items of the dropdown are quite expensive to calculate, as they
 * require building a search index from potentially unfetched resources. That is
 * why this component is only rendered if needed
 */
function DropDownItemsMenu({
  dropdownRef,
  inputValue,
  isOpen,
  onUpdate,
  options,
  selectedIndex,
  setInputValue,
  setIsOpen,
  setSelectedIndex,
  setSelectedItem,
  setUseKeys,
  useKeys,
}: DropDownItemsMenuProps): JSX.Element {
  const results = useLocalSearch(inputValue, options);

  function handleSelectItem(item: string) {
    setInputValue(item);
    setSelectedItem(item);
    onUpdate(item);
    setIsOpen(false);
  }

  // Select the item
  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      if (results.length > 0) {
        handleSelectItem(results[selectedIndex].item.subject);
      } else {
        handleSelectItem(inputValue);
      }
    },
    { enabled: isOpen, enableOnTags: ['INPUT'] },
    [selectedIndex],
  );

  // Move up (or to bottom if at top)
  useHotkeys(
    'up',
    e => {
      e.preventDefault();
      setUseKeys(true);
      const newSelected =
        selectedIndex > 0 ? selectedIndex - 1 : results.length - 1;
      setSelectedIndex(newSelected);
      scrollIntoView(newSelected, dropdownRef);
    },
    { enabled: isOpen, enableOnTags: ['INPUT'] },
    [selectedIndex],
  );

  // Move down (or to top if at bottom)
  useHotkeys(
    'down',
    e => {
      e.preventDefault();
      setUseKeys(true);
      const newSelected =
        selectedIndex == results.length - 1 ? 0 : selectedIndex + 1;
      setSelectedIndex(newSelected);
      scrollIntoView(newSelected, dropdownRef);
      return false;
    },
    { enabled: isOpen, enableOnTags: ['INPUT'] },
    [selectedIndex],
  );

  return (
    <DropDownWrapper ref={dropdownRef}>
      {results.length > 0 &&
        results.map((item, index) => (
          <DropDownItem
            onClick={() => handleSelectItem(item.item.subject)}
            key={item.item.subject}
            selected={index == selectedIndex}
            useKeys={useKeys}
          >
            <ResourceLine subject={item.item.subject} />
          </DropDownItem>
        ))}
      {inputValue && (
        <DropDownItem
          onClick={() => handleSelectItem(inputValue)}
          useKeys={useKeys}
        >
          Select {inputValue}
        </DropDownItem>
      )}
    </DropDownWrapper>
  );
}

/** A wrapper all dropdown items */
const ResourceInputOverlayWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
`;

/** A wrapper all dropdown items */
const DropDownStyled = styled.div`
  position: relative;
  flex: 1;
`;

const DropDownWrapperWrapper = styled.ul`
  margin-bottom: 0;
`;

/** A wrapper all dropdown items */
const DropDownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.bg};
  border: solid 1px ${props => props.theme.colors.bg2};
  border-radius: ${props => props.theme.radius};
  box-shadow: ${props => props.theme.boxShadowIntense};
  position: absolute;
  z-index: 1000;
  max-height: 30rem;
  overflow-y: auto;
  left: 0;
  right: 0;
  min-width: 10rem;
`;

interface DropDownItemProps {
  selected?: boolean;
  useKeys?: boolean;
}

/** A wrapper all dropdown items */
const DropDownItem = styled.li<DropDownItemProps>`
  display: flex;
  flex-direction: row;
  border-bottom: solid 1px ${props => props.theme.colors.bg2};
  cursor: pointer;
  margin: 0;
  padding: 0.3rem;
  text-decoration: ${p => (p.selected ? 'underline' : 'none')};

  ${props =>
    props.selected &&
    css`
      background-color: ${props => props.theme.colors.main};
      color: ${props => props.theme.colors.bg};
    `}

  ${props =>
    !props.useKeys &&
    css`
      &:hover,
      &:active,
      &:focus {
        background-color: ${props => props.theme.colors.main};
        color: ${props => props.theme.colors.bg};
      }
    `}
`;

/** A wrapper for wrapping around the dropdown if you want it tiny */
export const DropDownMini = styled.div`
  display: inline-flex;
  margin-bottom: 1rem;
  flex: 1;
  max-width: 20rem;
`;
