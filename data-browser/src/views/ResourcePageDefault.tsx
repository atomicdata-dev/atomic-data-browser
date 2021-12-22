import React from 'react';
import { properties } from '@tomic/lib';
import { useTitle } from '@tomic/react';
import AllProps from '../components/AllProps';
import ClassDetail from '../components/ClassDetail';
import { ContainerNarrow } from '../components/Containers';
import { ValueForm } from '../components/forms/ValueForm';
import Parent from '../components/Parent';
import { ResourcePageProps } from './ResourcePage';

/**
 * The properties that are shown in an alternative, custom way in default views.
 * If you use this, make sure you check the list every once in a while to make
 * sure you're not missing something important.
 */
export const defaulHiddenProps = [
  // Shown as title
  properties.name,
  properties.shortname,
  properties.file.filename,
  // Shown seperately
  properties.description,
  // Content should indicate Class in custom views (e.g. document looks like a document)
  properties.isA,
  // Shown in navigation
  properties.parent,
  // Shown in rights / share menu
  properties.write,
  properties.read,
];

/**
 * The Resource view that is used when no specific one fits better. It lists all
 * properties.
 */
export function ResourcePageDefault({
  resource,
}: ResourcePageProps): JSX.Element {
  const title = useTitle(resource);

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <Parent resource={resource} />
      <h1>{title}</h1>
      <ClassDetail resource={resource} />
      <ValueForm resource={resource} propertyURL={properties.description} />
      <AllProps
        resource={resource}
        except={defaulHiddenProps}
        editable
        columns
      />
    </ContainerNarrow>
  );
}
