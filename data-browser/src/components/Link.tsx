import React, { ReactNode } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { openURL } from '../helpers/navigation';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { ErrorLook } from '../views/ResourceInline';

type Props = {
  children?: ReactNode;
  /** An http URL to an Atomic Data resource, opened in this app and fetched as JSON-AD */
  subject?: string;
  /** An http URL to some (external) resource, opened in a new tab and fetched as HTML */
  href?: string;
  untabbable?: boolean;
};

/** Renders a link. Either a subject or a href is required */
function AtomicLink({
  children,
  subject,
  href,
  untabbable,
}: Props): JSX.Element {
  const [currentUrl] = useCurrentSubject();
  const history = useHistory();

  if (!subject && !href) {
    return <ErrorLook>No subject or href passed to this AtomicLink.</ErrorLook>;
  }

  const handleClick = e => {
    if (href) {
      // When there is a regular URL, let the browser handle it
      return;
    }
    e.preventDefault();
    if (currentUrl == subject) {
      return;
    }
    history.push(openURL(subject));
  };

  const isOnCurrentPage = subject && currentUrl == subject;

  return (
    <LinkView
      about={subject}
      onClick={handleClick}
      href={subject ? subject : href}
      disabled={isOnCurrentPage}
      tabIndex={isOnCurrentPage || untabbable ? -1 : 0}
    >
      {children}
      {href && <FaExternalLinkAlt />}
    </LinkView>
  );
}

type Proppies = {
  disabled?: boolean;
};

/** Look clickable, should be used for opening things only - not interactions. */
export const LinkView = styled.a<Proppies>`
  color: ${props =>
    props.disabled ? props.theme.colors.text : props.theme.colors.main};
  text-decoration: none;
  cursor: pointer;
  pointer-events: ${props => (props.disabled ? 'none' : 'inherit')};

  svg {
    margin-left: 0.3rem;
    font-size: 60%;
  }

  &:hover {
    color: ${props => props.theme.colors.mainLight};
    text-decoration: underline;
  }
  &:active {
    color: ${props => props.theme.colors.mainDark};
  }
`;

export default AtomicLink;
