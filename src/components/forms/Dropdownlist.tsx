import Downshift from 'downshift';
import React, { useContext } from 'react';
import { FaCaretDown, FaTrash } from 'react-icons/fa';
import styled, { ThemeContext } from 'styled-components';
import { ButtonInput } from '../Button';
import ResourceLine from '../ResourceLine';
import { InputStyled, InputWrapper } from './InputStyles';

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
}

export function DropDownList({ required, initial, placeholder, onRemove, onUpdate, options }: DropDownListProps) {
  const themeContext = useContext(ThemeContext);

  return (
    <Downshift
      initialSelectedItem={initial ? initial : ''}
      // initialInputValue={initial ? initial : ''}
      onChange={selection => onUpdate(selection)}
      itemToString={item => (item ? item : '')}
    >
      {({
        clearSelection,
        getInputProps,
        getItemProps,
        // getLabelProps,
        getMenuProps,
        getToggleButtonProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
        getRootProps,
      }): JSX.Element => (
        <DropDownStyled>
          <InputWrapper {...getRootProps({}, { suppressRefError: true })}>
            <InputStyled {...getInputProps()} required={required} placeholder={placeholder} />
            {selectedItem ? (
              //@ts-ignore issue with types from Downshift
              <ButtonInput type='button' onClick={clearSelection} title='clear selection' aria-label='clear selection'>
                clear
              </ButtonInput>
            ) : null}
            {options.length > 0 && (
              <ButtonInput type='button' {...getToggleButtonProps()} title='toggle menu' aria-label={'toggle menu'}>
                <FaCaretDown />
              </ButtonInput>
            )}
            {onRemove !== undefined && (
              <ButtonInput type='button' onClick={onRemove} title='remove item' aria-label='remove item'>
                <FaTrash />
              </ButtonInput>
            )}
          </InputWrapper>{' '}
          <DropDownWrapperWrapper {...getMenuProps()}>
            {options.length > 0 && isOpen ? (
              <DropDownWrapper>
                {options
                  .filter(item => !inputValue || item.includes(inputValue))
                  .map((item, index) => (
                    <DropDownItem
                      key={item}
                      {...getItemProps({
                        key: item,
                        index,
                        item,
                        style: {
                          backgroundColor: highlightedIndex === index ? themeContext.colors.main : themeContext.colors.bg1,
                          color: highlightedIndex === index ? themeContext.colors.bg : themeContext.colors.text,
                        },
                      })}
                    >
                      <ResourceLine subject={item} />
                    </DropDownItem>
                  ))}
              </DropDownWrapper>
            ) : null}
          </DropDownWrapperWrapper>
        </DropDownStyled>
      )}
    </Downshift>
  );
}

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
  background-color: ${props => props.theme.colors.bg1};
  border: solid 1px ${props => props.theme.colors.bg2};
  border-radius: ${props => props.theme.radius};
  position: absolute;
  z-index: 1000;
  max-height: 30rem;
  overflow-y: auto;
  left: 0;
  right: 0;
`;

/** A wrapper all dropdown items */
const DropDownItem = styled.li`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.colors.bg1};
  border: solid 1px ${props => props.theme.colors.bg2};
  cursor: pointer;
  margin: 0;
  padding: 0.3rem;

  &:hover,
  &:active,
  &:focus {
    background-color: ${props => props.theme.colors.main};
    color: ${props => props.theme.colors.bg};
  }
`;
