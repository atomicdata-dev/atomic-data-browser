import React from 'react';
import styled, { css } from 'styled-components';
import {
  useResource,
  useString,
  useTitle,
  properties,
  Resource,
  useCanWrite,
} from '@tomic/react';
import { useNavigate } from 'react-router';
import { constructOpenURL } from '../helpers/navigation';
import { FaEdit } from 'react-icons/fa';

type ParentProps = {
  resource: Resource;
};

/** Breadcrumb list. Recursively renders parents. */
function Parent({ resource }: ParentProps): JSX.Element {
  const [parent] = useString(resource, properties.parent);
  const [title, setTitle] = useTitle(resource);
  const [canEdit] = useCanWrite(resource);

  return (
    <ParentWrapper>
      <List>
        {parent && <NestedParent subject={parent} depth={0} />}
        {canEdit ? (
          <BreadCrumbInputWrapper>
            <BreadCrumbInput
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <FaEdit />
          </BreadCrumbInputWrapper>
        ) : (
          <BreadCrumbCurrent>{title}</BreadCrumbCurrent>
        )}
      </List>
    </ParentWrapper>
  );
}

const ParentWrapper = styled.div`
  padding: 0.2rem;
  padding-left: 0.5rem;
  color: ${props => props.theme.colors.textLight2};
  border-bottom: 1px solid ${props => props.theme.colors.bg2};
  background-color: ${props => props.theme.colors.bg};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

type NestedParentProps = {
  subject: string;
  depth: number;
};

/** The actually recursive part */
function NestedParent({ subject, depth }: NestedParentProps): JSX.Element {
  const resource = useResource(subject, { allowIncomplete: true });
  const [parent] = useString(resource, properties.parent);
  const navigate = useNavigate();
  const [title] = useTitle(resource);
  depth = depth + 1;

  // Prevent infinite recursion, set a limit to parent breadcrumbs
  if (depth > 5) {
    return <Breadcrumb>...</Breadcrumb>;
  }

  function handleClick(e) {
    e.preventDefault();
    navigate(constructOpenURL(subject));
  }

  return (
    <>
      {parent && <NestedParent subject={parent} depth={depth} />}
      <Breadcrumb href={subject} onClick={handleClick}>
        {title}
      </Breadcrumb>
      <Divider>{'/'}</Divider>
    </>
  );
}

const Divider = styled.div`
  padding: 0.1rem 0.2rem;
`;

interface BreadCrumbProps {
  isCurrent?: boolean;
}

const BreadCrumbBase = css`
  padding: 0.1rem 0.5rem;
  color: ${p => p.theme.colors.textLight};
`;

const BreadCrumbCurrent = styled.div`
  ${BreadCrumbBase}
`;

const BreadCrumbInput = styled.input`
  ${BreadCrumbBase}
  background: none;
  outline: none;
  border: none;
`;

const BreadCrumbInputWrapper = styled.div`
  display: flex;

  &:hover svg {
    display: flex;
  }

  svg {
    display: none;
  }
`;

const Breadcrumb = styled.a<BreadCrumbProps>`
  ${BreadCrumbBase}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: center;
  cursor: ${p => (p.isCurrent ? 'initial' : 'pointer')};
  text-decoration: none;
  border-radius: ${p => p.theme.radius};

  &:hover {
    background: ${p => (p.isCurrent ? 'auto' : p.theme.colors.bg1)};
    color: ${p => p.theme.colors.text};
  }

  &:active {
    background: ${p => (p.isCurrent ? 'auto' : p.theme.colors.bg2)};
  }
`;

const List = styled.div`
  display: flex;
  direction: row;
`;

export default Parent;
