import React from 'react';
import styled from 'styled-components';
import { urls } from '../helpers/urls';
import { useResource } from '../atomic-react/hooks';
import { Resource } from '../atomic-lib/resource';
import ResourceInline from './ResourceInline';
import { useSubjectParam } from '../helpers/useCurrentSubject';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Button } from './Button';
import { ValueForm } from './forms/ValueForm';

type TableProps = {
  /** A Collection Resource with a filter-value set */
  resource: Resource;
  members: string[];
  /** Array of property URLs to be shown in columns */
  columns: string[];
};

/** A table view for Collections. Header shows properties of the first class of the collection */
function Table({ resource, members, columns }: TableProps): JSX.Element {
  // Don't show the shortname, it's already shown in the first row.
  const propsArray = columns.filter(item => item !== urls.properties.shortname);

  if (resource == null) {
    return null;
  }

  return (
    <TableStyled>
      <Header columns={propsArray} />
      {members.length > 0 ? (
        <tbody>
          {members.map(member => {
            return <Row propsArray={propsArray} key={member} subject={member} />;
          })}
        </tbody>
      ) : (
        <p>This collection is empty</p>
      )}
    </TableStyled>
  );
}

const TableStyled = styled.table`
  display: block;
  overflow-y: auto;
  border-collapse: collapse;
`;

type HeaderProps = {
  columns: string[];
};

function Header({ columns }: HeaderProps): JSX.Element {
  return (
    <thead>
      <tr>
        <CellStyled header>subject</CellStyled>
        {columns.map(prop => {
          return <HeaderItem key={prop} subject={prop} />;
        })}
      </tr>
    </thead>
  );
}

type HeaderItemProps = {
  subject: string;
};

function HeaderItem({ subject }: HeaderItemProps) {
  const [sortBy, setSortBy] = useSubjectParam('sort_by');
  const [sortDesc, setSortDesc] = useSubjectParam('sort_desc');

  function handleToggleSort() {
    if (sortBy == subject) {
      if (sortDesc == 'true') {
        setSortDesc(null);
      } else {
        setSortDesc('true');
      }
    } else {
      setSortBy(subject);
    }
  }

  return (
    <CellStyled header>
      <ResourceInline subject={subject} />{' '}
      <Button onClick={handleToggleSort} subtle icon>
        {sortBy == subject ? sortDesc == 'true' ? <FaSortDown /> : <FaSortUp /> : <FaSort />}
      </Button>
    </CellStyled>
  );
}

type RowProps = {
  subject: string;
  propsArray: string[];
};

function Row({ subject, propsArray }: RowProps): JSX.Element {
  const [resource] = useResource(subject);
  if (resource == null) {
    return null;
  }
  return (
    <RowStyled about={subject}>
      <CellStyled>
        <ResourceInline subject={subject} />
      </CellStyled>
      {propsArray.map(prop => {
        return <Cell key={prop} resource={resource} prop={prop} />;
      })}
    </RowStyled>
  );
}

const RowStyled = styled.tr`
  border-top: solid 1px ${props => props.theme.colors.bg2};
`;

const CellContainer = styled.div`
  overflow: auto;
  /* Not a pretty solution, but it's better than having really large cells. */
  height: 5rem;
`;

type CellProps = {
  prop: string;
  resource: Resource;
};

function Cell({ resource, prop: propUrl }: CellProps): JSX.Element {
  return (
    <CellStyled>
      <CellContainer>
        <ValueForm key={propUrl} resource={resource} propertyURL={propUrl} />
      </CellContainer>
    </CellStyled>
  );
}

type CellStyledProps = {
  header?: boolean;
};

const CellStyled = styled.td<CellStyledProps>`
  padding: 0.3rem;
  font-weight: ${props => (props.header ? 'bold' : ``)};
  /* word-break: keep-all; */
  white-space: ${props => (props.header ? 'nowrap' : ``)};
`;

export default Table;
