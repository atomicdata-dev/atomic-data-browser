import Downshift from "../../pkg/downshift.js";
import React, {useContext} from "../../pkg/react.js";
import {FaCaretDown, FaTrash} from "../../pkg/react-icons/fa.js";
import styled, {ThemeContext} from "../../pkg/styled-components.js";
import {ButtonInput} from "../Button.js";
import ResourceLine from "../ResourceLine.js";
import {InputStyled, InputWrapper} from "./InputStyles.js";
export function DropDownList({required, initial, placeholder, onRemove, onUpdate, options}) {
  const themeContext = useContext(ThemeContext);
  return /* @__PURE__ */ React.createElement(Downshift, {
    initialSelectedItem: initial ? initial : "",
    onChange: (selection) => onUpdate(selection),
    itemToString: (item) => item ? item : ""
  }, ({
    clearSelection,
    getInputProps,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    isOpen,
    inputValue,
    highlightedIndex,
    selectedItem,
    getRootProps
  }) => /* @__PURE__ */ React.createElement(DropDownStyled, null, /* @__PURE__ */ React.createElement(InputWrapper, {
    ...getRootProps({}, {suppressRefError: true})
  }, /* @__PURE__ */ React.createElement(InputStyled, {
    ...getInputProps(),
    required,
    placeholder
  }), selectedItem ? /* @__PURE__ */ React.createElement(ButtonInput, {
    type: "button",
    onClick: clearSelection,
    title: "clear selection",
    "aria-label": "clear selection"
  }, "clear") : null, options.length > 0 && /* @__PURE__ */ React.createElement(ButtonInput, {
    type: "button",
    ...getToggleButtonProps(),
    title: "toggle menu",
    "aria-label": "toggle menu"
  }, /* @__PURE__ */ React.createElement(FaCaretDown, null)), onRemove !== void 0 && /* @__PURE__ */ React.createElement(ButtonInput, {
    type: "button",
    onClick: onRemove,
    title: "remove item",
    "aria-label": "remove item"
  }, /* @__PURE__ */ React.createElement(FaTrash, null))), " ", /* @__PURE__ */ React.createElement(DropDownWrapperWrapper, {
    ...getMenuProps()
  }, options.length > 0 && isOpen ? /* @__PURE__ */ React.createElement(DropDownWrapper, null, options.filter((item) => !inputValue || item.includes(inputValue)).map((item, index) => /* @__PURE__ */ React.createElement(DropDownItem, {
    key: item,
    ...getItemProps({
      key: item,
      index,
      item,
      style: {
        backgroundColor: highlightedIndex === index ? themeContext.colors.main : themeContext.colors.bg1,
        color: highlightedIndex === index ? themeContext.colors.bg : themeContext.colors.text
      }
    })
  }, /* @__PURE__ */ React.createElement(ResourceLine, {
    subject: item
  })))) : null)));
}
const DropDownStyled = styled.div`
  position: relative;
`;
const DropDownWrapperWrapper = styled.ul`
  margin-bottom: 0;
`;
const DropDownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.bg1};
  border: solid 1px ${(props) => props.theme.colors.bg2};
  border-radius: ${(props) => props.theme.radius};
  position: absolute;
  z-index: 1000;
  max-height: 30rem;
  overflow-y: auto;
  left: 0;
  right: 0;
`;
const DropDownItem = styled.li`
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.colors.bg1};
  border: solid 1px ${(props) => props.theme.colors.bg2};
  cursor: pointer;
  margin: 0;
  padding: 0.3rem;

  &:hover,
  &:active,
  &:focus {
    background-color: ${(props) => props.theme.colors.main};
    color: ${(props) => props.theme.colors.bg};
  }
`;
export const DropDownMini = styled.li`
  display: inline-flex;
`;
