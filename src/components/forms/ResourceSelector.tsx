import React, { useContext, useState } from 'react';
import Downshift from 'downshift';
import { ErrMessage, InputProps, InputStyled, InputWrapper } from './Field';
import { useArray, useResource, useString } from '../../atomic-react/hooks';
import { FaCaretDown } from 'react-icons/fa';
import { urls } from '../../helpers/urls';
import { ButtonInput } from '../Button';
import ResourceLine from '../ResourceLine';
import styled, { ThemeContext } from 'styled-components';
import { Datatype } from '../../atomic-lib/datatypes';

interface ResourceSelectorProps extends InputProps {
  setSubject: (subject: string, errHandler: () => Error) => void;
  subject: string;
}

export function ResourceSelector({ resource, property, required, setSubject, subject }: ResourceSelectorProps): JSX.Element {
  // If it's used for a single resource
  // const [subjectSingle, setSubjectSingle] = useString(parentResource, property.subject);
  // If it's used for a ResourceArray...
  // const [array, setArray] = useArray(parentResource, property.subject);
  const [err, setErr] = useState<Error>(null);
  // TODO: This list should use the user's Pod instead of a hardcoded collection;
  const [classesCollection] = useResource('https://atomicdata.dev/properties');
  const [options] = useArray(classesCollection, urls.properties.collection.members);
  const themeContext = useContext(ThemeContext);

  function handleUpdate(newval: string) {
    // Pass the error setter for validation purposes
    console.log('handleUpdate ResoureceSelector', newval);
    setSubject(newval, setErr);
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
              <ButtonInput type='button' {...getToggleButtonProps()} aria-label={'toggle menu'}>
                <FaCaretDown />
              </ButtonInput>
              {selectedItem ? (
                //@ts-ignore issue with types from Downshift
                <ButtonInput type='button' onClick={clearSelection} aria-label='clear selection'>
                  clear
                </ButtonInput>
              ) : null}
            </InputWrapper>{' '}
            <DropDownWrapperWrapper {...getMenuProps()}>
              {isOpen ? (
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
      {subject !== '' && err && <ErrMessage>{err.message}</ErrMessage>}
      {subject == '' && <ErrMessage>Required</ErrMessage>}
    </div>
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
