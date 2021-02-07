import React from 'react';
import styled from 'styled-components';
import { properties, urls } from '../helpers/urls';
import { useArray, useProperty, useString, useValue, useResource, useTitle } from '../lib/react';
import { Resource } from '../lib/resource';
import ResourceInline from './datatypes/ResourceInline';
import Markdown from './datatypes/Markdown';
import ValueComp from './ValueComp';

type TableProps = {
  resource: Resource;
};

/** A table view for Collections. Header shows properties of the first class of the collection */
function Table({ resource }: TableProps): JSX.Element {
  const title = useTitle(resource);
  const description = useString(resource, properties.description);
  const members = useArray(resource, properties.collection.members);
  const klass = useString(resource, properties.collection.value);
  // We kind of assume here that all Collections will be filtered by an `is-a` prop and `Class` value.
  // But we can also have a collection of thing that share the same creator.
  // If that happens, we need a different approach to rendering the Headers
  const classResource = useResource(klass);
  const requiredProps = useArray(classResource, urls.properties.requires);
  const recommendedProps = useArray(classResource, urls.properties.recommends);
  const propsArrayFull = requiredProps.concat(recommendedProps);
  // Don't show the shortname, it's already shown in the first row.
  const propsArray = propsArrayFull.filter(item => item !== urls.properties.shortname);

  if (resource == null) {
    return null;
  }

  return (
    <Wrapper>
      <h1>{title}</h1>
      {description && <Markdown text={description} />}
      <table>
        <Header klass={classResource} propsArray={propsArray} />
        <tbody>
          {members.map(member => {
            return <Row propsArray={propsArray} key={member} subject={member} />;
          })}
        </tbody>
      </table>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 1rem;
`;

type HeaderProps = {
  klass: Resource;
  propsArray: string[];
};

function Header({ klass, propsArray }: HeaderProps): JSX.Element {
  if (klass == null) {
    return null;
  }
  return (
    <thead>
      <tr>
        <CellStyled header>subject</CellStyled>
        {propsArray.map(prop => {
          return (
            <CellStyled header key={prop}>
              <ResourceInline url={prop} />
            </CellStyled>
          );
        })}
      </tr>
    </thead>
  );
}

type RowProps = {
  subject: string;
  propsArray: string[];
};

function Row({ subject, propsArray }: RowProps): JSX.Element {
  const resource = useResource(subject);
  if (resource == null) {
    return null;
  }
  return (
    <RowStyled>
      <CellStyled>
        <ResourceInline url={subject} />
      </CellStyled>
      {propsArray.map(prop => {
        return <Cell key={prop} resource={resource} prop={prop} />;
      })}
    </RowStyled>
  );
}

const RowStyled = styled.tr`
  border-top: solid 1px ${props => props.theme.colors.bg1};
`;

type CellProps = {
  prop: string;
  resource: Resource;
};

function Cell({ resource, prop: propUrl }: CellProps): JSX.Element {
  const value = useValue(resource, propUrl);
  const fullprop = useProperty(propUrl);
  if (value == null) {
    return null;
  }
  if (fullprop == null) {
    return null;
  }
  return (
    <CellStyled>
      <ValueComp key={propUrl} value={value} datatype={fullprop.datatype} />
    </CellStyled>
  );
}

type CellStyledProps = {
  header?: boolean;
};

const CellStyled = styled.td<CellStyledProps>`
  padding: 0.3rem;
  font-weight: ${props => (props.header ? 'bold' : ``)};
`;

export default Table;
