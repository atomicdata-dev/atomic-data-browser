import styled from 'styled-components';

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: var(--table-template-columns);
  height: var(--table-row-height);

  & > div {
    border-bottom: 1px solid ${p => p.theme.colors.bg2};
    border-right: 1px solid ${p => p.theme.colors.bg2};

    &:last-child {
      border-right: none;
    }
  }
`;
