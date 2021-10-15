import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useString, useResource, useTitle } from '@tomic/react';
import { Resource, ResourceStatus, properties, urls } from '@tomic/lib';
import AllProps from '../components/AllProps';
import AtomicLink from '../components/Link';
import { Card } from '../components/Card';
import CollectionCard from '../views/CollectionCard';
import { ErrorLook } from './ResourceInline';
import { ValueForm } from '../components/forms/ValueForm';
import { defaulHiddenProps } from './ResourcePage';

interface Props extends CardPropsBase {
  /** The subject URL - the identifier of the resource. */
  subject: string;
}

interface CardPropsBase {
  /** If true, only some basic details are shown */
  small?: boolean;
  /** Show a highlight border */
  highlight?: boolean;
  /** An HTML reference */
  ref?: React.RefObject<HTMLElement>;
  /**
   * If you expect to render this card in the initial view (e.g. it's in the top
   * of some list)
   */
  initialInView?: boolean;
}

/** The properties passed to every CardView */
export interface CardViewProps extends CardPropsBase {
  /** The full Resource to be displayed */
  resource: Resource;
}

/**
 * Renders a Resource and all its Properties in a random order. Title
 * (shortname) is rendered prominently at the top.
 */
function ResourceCard(props: Props): JSX.Element {
  const { subject, initialInView } = props;
  const [isShown, setIsShown] = useState(false);
  // The (more expensive) ResourceCardInner is only rendered when the component has been in View
  const { ref, inView } = useInView({
    threshold: 0,
    initialInView,
  });
  if (inView && !isShown) {
    setIsShown(true);
  }
  return (
    // eslint-disable-next-line
    <Card ref={ref} {...props} about={subject}>
      {isShown ? (
        <ResourceCardInner {...props} />
      ) : (
        <>
          <h2>
            <AtomicLink subject={subject}>{subject}</AtomicLink>
          </h2>
          <p>Resource is loading...</p>
        </>
      )}
    </Card>
  );
}

function ResourceCardInner(props: Props): JSX.Element {
  const { small, subject } = props;
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const [klass] = useString(resource, properties.isA);

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return <p>Loading...</p>;
  }
  if (status == ResourceStatus.error) {
    return (
      <ErrorLook>
        <AtomicLink subject={subject}>
          <h2>{title}</h2>
        </AtomicLink>
        {resource.getError().message}
      </ErrorLook>
    );
  }

  /** Check if there exists a View for this Class. These should be registered in `../views` */
  switch (klass) {
    case urls.classes.collection:
      return <CollectionCard resource={resource} {...props} />;
  }

  return (
    <React.Fragment>
      <AtomicLink subject={subject}>
        <h2>{title}</h2>
      </AtomicLink>
      <ValueForm
        resource={resource}
        propertyURL={urls.properties.description}
      />
      {!small && (
        <AllProps resource={resource} except={defaulHiddenProps} editable />
      )}
    </React.Fragment>
  );
}

export default ResourceCard;
