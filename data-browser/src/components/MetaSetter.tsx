import { properties } from '@tomic/lib';
import { useResource, useString, useTitle } from '@tomic/react';
import React from 'react';
import Helmet from 'react-helmet';
import { useSettings } from '../helpers/AppSettings';
import { useCurrentSubject } from '../helpers/useCurrentSubject';

/** Sets various HTML meta tags, depending on the currently opened resource */
export function MetaSetter() {
  const { mainColor, darkMode } = useSettings();
  const [subject] = useCurrentSubject();
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);

  return (
    <Helmet>
      <title>{title ? title : 'Atomic Data'}</title>
      <meta name='theme-color' content={darkMode ? 'black' : 'white'} />
      <meta name='msapplication-TileColor' content={mainColor} />
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={subject} />
    </Helmet>
  );
}
