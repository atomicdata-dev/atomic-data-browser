import { Resource, Store, urls, useStore } from '@tomic/react';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../../components/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useDialog,
} from '../../../components/Dialog';
import { randomString } from '../../../helpers/randomString';
import { PropertyForm } from './PropertyForm';

interface NewPropertyDialogProps {
  showDialog: boolean;
  tableClassResource: Resource;
  bindShow: React.Dispatch<boolean>;
  selectedCategory?: string;
}

const createSubjectWithBase = (base: string) => {
  const sepperator = base.endsWith('/') ? '' : '/';

  return `${base}${sepperator}property-${randomString(8)}`;
};

const populatePropertyWithDefaults = async (
  property: Resource,
  tableClass: Resource,
  store: Store,
) => {
  await property.set(urls.properties.isA, [urls.classes.property], store);
  await property.set(urls.properties.parent, tableClass.getSubject(), store);
  await property.set(urls.properties.shortname, 'new-column', store);
  await property.set(urls.properties.name, 'New Column', store);
  await property.set(urls.properties.description, 'A column in a table', store);
  await property.set(urls.properties.datatype, urls.datatypes.string, store);
};

export function NewPropertyDialog({
  showDialog,
  selectedCategory,
  tableClassResource,
  bindShow,
}: NewPropertyDialogProps): JSX.Element {
  const store = useStore();
  const [resource, setResource] = useState<Resource | null>(null);

  const handleUserCancelAction = useCallback(async () => {
    try {
      await resource?.destroy(store);
    } finally {
      // Server does not have this resource yet so it will nag at us. We set the state to null anyway.
      setResource(null);
    }
  }, [resource, store]);

  const handleUserSuccessAction = useCallback(async () => {
    if (!resource) {
      return;
    }

    await resource.save(store);
    await store.notifyResourceManuallyCreated(resource);

    tableClassResource.pushPropVal(
      urls.properties.recommends,
      resource.getSubject(),
    );

    await tableClassResource.save(store);
    setResource(null);
  }, [resource, store, tableClassResource]);

  const [dialogProps, show, hide] = useDialog(
    bindShow,
    handleUserCancelAction,
    handleUserSuccessAction,
  );

  const createProperty = async () => {
    const subject = createSubjectWithBase(tableClassResource.getSubject());
    const propertyResource = store.getResourceLoading(subject, {
      newResource: true,
    });

    await populatePropertyWithDefaults(
      propertyResource,
      tableClassResource,
      store,
    );

    setResource(propertyResource);
  };

  const handleCancelClick = useCallback(() => {
    hide();
  }, [hide]);

  const handleCreateClick = useCallback(() => {
    hide(true);
  }, [hide]);

  useEffect(() => {
    if (showDialog) {
      createProperty().then(() => {
        show();
      });
    }
  }, [showDialog]);

  if (!resource) {
    return <></>;
  }

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>
        <h1>
          New <Capitalize>{selectedCategory}</Capitalize> Column
        </h1>
      </DialogTitle>
      <DialogContent>
        <PropertyForm resource={resource} category={selectedCategory} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick} subtle>
          Cancel
        </Button>
        <Button onClick={handleCreateClick}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

const Capitalize = styled('span')`
  text-transform: capitalize;
`;
