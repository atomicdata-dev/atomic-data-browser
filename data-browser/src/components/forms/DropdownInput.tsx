import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaCaretDown, FaTrash } from 'react-icons/fa';
import styled, { css } from 'styled-components';
import { useSearch } from '../../helpers/useSearch';
import { ButtonInput } from '../Button';
import ResourceInline from '../ResourceInline';
import ResourceLine from '../ResourceLine';
import { InputOverlay, InputStyled, InputWrapper } from './InputStyles';

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
  const results = useSearch(inputValue, options, !isOpen && !isFocus);

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

  // Close the menu
  useHotkeys(
    'esc',
    e => {
      e.preventDefault();
      setIsOpen(false);
    },
    { enabled: isOpen, enableOnTags: ['INPUT'] },
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
      scrollIntoView(newSelected);
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
      scrollIntoView(newSelected);
      return false;
    },
    { enabled: isOpen, enableOnTags: ['INPUT'] },
    [selectedIndex],
  );

  function scrollIntoView(index: number) {
    const currentElm = dropdownRef?.current?.children[index];
    currentElm?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputValue(val);
    setUseKeys(true);
    setIsFocus(true);
    setIsOpen(true);
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
  }

  function handleSelectItem(item: string) {
    setInputValue(item);
    setSelectedItem(item);
    onUpdate(item);
    setIsOpen(false);
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
            clear
          </ButtonInput>
        ) : null}
        {options.length > 0 && (
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
          <DropDownWrapper ref={dropdownRef}>
            {results.length > 0 ? (
              results.map((item, index) => (
                <DropDownItem
                  onClick={() => handleSelectItem(item.item.subject)}
                  key={item.item.subject}
                  selected={index == selectedIndex}
                  useKeys={useKeys}
                >
                  <ResourceLine subject={item.item.subject} />
                </DropDownItem>
              ))
            ) : (
              <DropDownItem
                onClick={() => handleSelectItem(inputValue)}
                useKeys={useKeys}
              >
                Set {inputValue} as value
              </DropDownItem>
            )}
          </DropDownWrapper>
        ) : null}
      </DropDownWrapperWrapper>
    </DropDownStyled>
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
`;
