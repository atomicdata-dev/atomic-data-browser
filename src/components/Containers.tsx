import styled from 'styled-components';

/** Centered column */
export const Container = styled.div`
  max-width: 40rem;
  margin: auto;
  padding: ${props => props.theme.margin}rem;
  // Extra space for the navbar below
  padding-bottom: 10rem;
`;

/** Full-page wrapper */
export const Wrapper = styled.div`
  padding: ${props => props.theme.margin}rem;
  padding-bottom: 10rem;
`;
