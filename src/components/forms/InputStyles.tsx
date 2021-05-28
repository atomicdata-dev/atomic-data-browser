import styled, { css } from 'styled-components';

export const FieldStyled = styled.div`
  margin-bottom: ${props => props.theme.margin}rem;
`;

export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;
`;

export const LabelStyled = styled.label`
  font-weight: bold;
  display: block;
`;

export const LabelHelper = styled.label`
  font-size: 0.9em;
  display: block;
`;

/** A wrapper for inputs, for example when you want to add a button to some field */
export const InputWrapper = styled.div`
  display: flex;
  /* background-color: ${props => props.theme.colors.bg}; */
  border: solid 1px ${props => props.theme.colors.bg2};
  border-radius: ${props => props.theme.radius};
  overflow: hidden;
`;

const inputStyle = css`
  height: 2rem;
  flex: 1;
  color: ${props => props.theme.colors.text};
  font-size: 1em;
  padding: ${props => props.theme.margin / 2}rem;
  border: none;
  --webkit-appearance: none;
  display: block;
  background-color: ${props => props.theme.colors.bg};
  /* Invisible border, but useful because you need to set :focus styles with Input tags */
  border: solid 1px ${props => props.theme.colors.bg};
  /* border-radius: ${props => props.theme.radius}; */
  outline: none;
  box-sizing: border-box;
  /* If buttons are inside the input, the edges should be sharp */
  border-top-left-radius: ${props => props.theme.radius};
  border-bottom-left-radius: ${props => props.theme.radius};

  &:hover {
    border-color: ${props => props.theme.colors.main};
  }

  &:focus {
    border: solid 1px ${props => props.theme.colors.main};
    background-color: ${props => props.theme.colors.bg};
  }

  &:last-child {
    border-radius: ${props => props.theme.radius};
  }
`;

export const InputStyled = styled.input`
  ${inputStyle}
`;

export const TextAreaStyled = styled.textarea`
  ${inputStyle}
`;

export const ErrMessage = styled.div`
  font-size: 0.8em;
  line-height: 1rem;
  color: ${props => props.theme.colors.alert};
`;
