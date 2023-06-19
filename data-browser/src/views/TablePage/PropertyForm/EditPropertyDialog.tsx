import { Resource, properties, useString } from '@tomic/react';
import React, { useEffect, useState } from 'react';
import { PropertyForm, getCategoryFromDatatype } from './PropertyForm';
import { FormValidationContextProvider } from '../../../components/forms/formValidation/FormValidationContextProvider';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useDialog,
} from '../../../components/Dialog';
import { Button } from '../../../components/Button';

interface EditPropertyDialogProps {
  resource: Resource;
  showDialog: boolean;
  bindShow: React.Dispatch<boolean>;
}

export function EditPropertyDialog({
  resource,
  showDialog,
  bindShow,
}: EditPropertyDialogProps): JSX.Element {
  const [valid, setValid] = useState(true);

  const [datatype] = useString(resource, properties.datatype);

  const category = getCategoryFromDatatype(datatype);
  const [dialogProps, show, hide] = useDialog({ bindShow });

  useEffect(() => {
    if (showDialog) {
      show();
    } else {
      hide();
    }
  }, [showDialog]);

  return (
    <FormValidationContextProvider onValidationChange={setValid}>
      <Dialog {...dialogProps}>
        <DialogTitle>
          <h1>Edit Column</h1>
        </DialogTitle>
        <DialogContent>
          <PropertyForm resource={resource} category={category} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => hide()} disabled={!valid}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </FormValidationContextProvider>
  );
}
