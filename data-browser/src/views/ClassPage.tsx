import { classToTypescriptDefinition, properties } from '@tomic/lib';
import { useStore } from '@tomic/react';
import React, { useState } from 'react';
import AllProps from '../components/AllProps';
import { Button } from '../components/Button';
import { ClassDetail } from '../components/ClassDetail';
import { CodeBlock } from '../components/CodeBlock';
import { ContainerNarrow } from '../components/Containers';
import { ValueForm } from '../components/forms/ValueForm';
import NewInstanceButton from '../components/NewInstanceButton';
import { Title } from '../components/Title';
import Parent from '../components/Parent';
import { Row } from '../components/Row';
import { ResourcePageProps } from './ResourcePage';
import { defaultHiddenProps } from './ResourcePageDefault';

/**
 * Full page Class resoure that features a New instance button, and a Typescript
 * definition export.
 */
export function ClassPage({ resource }: ResourcePageProps) {
  const [tsDef, setTSdef] = useState<string | null>(null);
  const store = useStore();

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <Parent resource={resource} />
      <Title resource={resource} />
      <ClassDetail resource={resource} />
      <ValueForm resource={resource} propertyURL={properties.description} />
      <AllProps
        resource={resource}
        except={defaultHiddenProps}
        editable
        columns
      />
      <Row>
        <NewInstanceButton icon={true} klass={resource.getSubject()} />
        <Button
          subtle
          onClick={async () =>
            setTSdef(await classToTypescriptDefinition(resource, store))
          }
        >
          typescript interface
        </Button>
      </Row>
      {tsDef && <CodeBlock content={tsDef} />}
    </ContainerNarrow>
  );
}
