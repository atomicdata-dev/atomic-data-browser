import { Property, useResource, useTitle } from '@tomic/react';
import React from 'react';
import { FaAtom } from 'react-icons/fa';
import styled from 'styled-components';
import { dataTypeIconMap } from './dataTypeMaps';

export interface TableHeadingProps {
  column: Property;
}

export function TableHeading({ column }: TableHeadingProps): JSX.Element {
  const Icon = dataTypeIconMap.get(column.datatype!) ?? FaAtom;
  const propResource = useResource(column.subject);
  const [title] = useTitle(propResource);

  return (
    <Wrapper>
      <Icon />
      {title || column.shortname}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${p => p.theme.colors.textLight};
  }
`;
