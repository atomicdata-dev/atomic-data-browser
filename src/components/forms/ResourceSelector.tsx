import React, { Dispatch, SetStateAction, useContext } from 'react';
import Downshift from 'downshift';
import { ErrMessage, InputProps, InputStyled, InputWrapper } from './Field';
import { useArray, useResource } from '../../atomic-react/hooks';
import { FaCaretDown, FaTrash } from 'react-icons/fa';
import { urls } from '../../helpers/urls';
import { ButtonInput } from '../Button';
import ResourceLine from '../ResourceLine';
import styled, { ThemeContext } from 'styled-components';
import { ArrayError } from '../../atomic-lib/datatypes';

interface ResourceSelectorProps extends InputProps {
  /** Take the second argument of a `useString` hook and pass the setString part to this property */
  setSubject: (subject: string, errHandler: Dispatch<SetStateAction<Error>>) => void;
  subject: string;
  /** A function to remove this item. Only relevant in arrays. */
  handleRemove?: () => void;
  /** Only pass an error if it is applicable to this specific field */
  error: Error;
  /** Set an ArrayError. A special type, because the parent needs to know where in the Array the error occurred */
  setError: Dispatch<SetStateAction<ArrayError>>;
}

/** Form field for selecting a single resource. Needs external subject & setSubject properties */
export function ResourceSelector({
  required,
  setSubject,
  subject,
  handleRemove,
  error,
  setError,
  property,
}: ResourceSelectorProps): JSX.Element {
  // TODO: This list should use the user's Pod instead of a hardcoded collection;
  const [classesCollection] = useResource(getCollection(property.classType));
  const [options] = useArray(classesCollection, urls.properties.collection.members);
  const themeContext = useContext(ThemeContext);

  function handleUpdate(newval: string) {
    // Pass the error setter for validation purposes
    console.log('handleUpdate ResoureceSelector', newval);
    // Pass the Error handler to its parent, so validation errors appear locally
    setSubject(newval, setError);
  }

  return (
    <div>
      <Downshift onChange={selection => handleUpdate(selection)} itemToString={item => (item ? item : '')}>
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
              <InputStyled {...getInputProps()} required={required} />
              {selectedItem ? (
                //@ts-ignore issue with types from Downshift
                <ButtonInput type='button' onClick={clearSelection} aria-label='clear selection'>
                  clear
                </ButtonInput>
              ) : null}
              {options.length > 0 && (
                <ButtonInput type='button' {...getToggleButtonProps()} aria-label={'toggle menu'}>
                  <FaCaretDown />
                </ButtonInput>
              )}
              {handleRemove !== undefined && (
                <ButtonInput type='button' onClick={handleRemove} aria-label='clear selection'>
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
      {subject !== '' && error && <ErrMessage>{error?.message}</ErrMessage>}
      {subject == '' && <ErrMessage>Required</ErrMessage>}
    </div>
  );
}

function getCollection(classtypeUrl: string) {
  switch (classtypeUrl) {
    case urls.classes.property:
      return 'https://atomicdata.dev/properties';
    case urls.classes.class:
      return 'https://atomicdata.dev/classes';
    case urls.classes.agent:
      return 'https://atomicdata.dev/agents';
    case urls.classes.commit:
      return 'https://atomicdata.dev/commits';
    case urls.classes.datatype:
      return 'https://atomicdata.dev/datatypes';
  }
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
