import styled from 'styled-components';
import { transitionName } from '../helpers/transitionName';

type CardProps = {
  /** Adds a colorful border */
  highlight?: boolean;
  /** Sets a maximum height */
  small?: boolean;
};

/** A Card with a border. */
export const Card = styled.div<CardProps>`
  background-color: ${props => props.theme.colors.bg};
  /** Don't put side margins in this component - use a wrapping component */
  border: solid 1px ${props => props.theme.colors.bg2};
  box-shadow: ${props => props.theme.boxShadow};
  padding: ${props => props.theme.margin}rem;
  /* margin-bottom: ${props => props.theme.margin}rem; */
  padding-bottom: 0;
  border-radius: ${props => props.theme.radius};
  max-height: ${props => (props.small ? '10rem' : 'none')};
  overflow: ${props => (props.small ? 'hidden' : 'auto')};
  border-color: ${props =>
    props.highlight ? props.theme.colors.main : props.theme.colors.bg2};

  ${p => transitionName('resource-page', p.about)};
`;

export interface CardRowProps {
  noBorder?: boolean;
}

/** A Row in a Card. Should probably be used inside a CardInsideFull */
export const CardRow = styled.div<CardRowProps>`
  --border: solid 1px ${props => props.theme.colors.bg2};
  display: block;
  border-top: ${props => (props.noBorder ? 'none' : 'var(--border)')};
  padding: ${props => props.theme.margin / 3}rem
    ${props => props.theme.margin}rem;
`;

/** A block inside a Card which has full width */
export const CardInsideFull = styled.div`
  margin-left: -${props => props.theme.margin}rem;
  margin-right: -${props => props.theme.margin}rem;
`;

export const Margin = styled.div`
  display: block;
  height: ${props => props.theme.margin}rem;
`;
