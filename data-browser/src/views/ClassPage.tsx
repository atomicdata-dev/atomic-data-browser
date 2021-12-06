import { classToTypescriptDefinition, properties, Resource } from '@tomic/lib';
import { useStore, useTitle } from '@tomic/react';
import React, { useState } from 'react';
import AllProps from '../components/AllProps';
import { Button } from '../components/Button';
import ClassDetail from '../components/ClassDetail';
import { CodeBlock } from '../components/CodeBlock';
import { ContainerNarrow } from '../components/Containers';
import { ValueForm } from '../components/forms/ValueForm';
import NewInstanceButton from '../components/NewInstanceButton';
import Parent from '../components/Parent';
import { defaulHiddenProps } from './ResourcePage';

interface ClassPageProps {
  resource: Resource;
}

/**
 * Full page Class resoure that features a New instance button, and a Typescript
 * definition export.
 */
export function ClassPage({ resource }: ClassPageProps) {
  const title = useTitle(resource);
  const [tsDef, setTSdef] = useState<string | null>(null);
  const store = useStore();

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
      <NewInstanceButton klass={resource.getSubject()} />
      <Button
        subtle
        onClick={async () =>
          setTSdef(await classToTypescriptDefinition(resource, store))
        }
      >
        typescript interface
      </Button>
      {tsDef && <CodeBlock content={tsDef} />}
    </ContainerNarrow>
  );
}
