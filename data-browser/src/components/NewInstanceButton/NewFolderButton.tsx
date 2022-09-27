import { classes, properties, useResource, useTitle } from '@tomic/react';
import React, { FormEvent, useCallback, useState } from 'react';
import { Button } from '../Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useDialog,
} from '../Dialog';
import Field from '../forms/Field';
import { InputStyled, InputWrapper } from '../forms/InputStyles';
import { Base } from './Base';
import { useCreateAndNavigate } from './useCreateAndNavigate';
import { NewInstanceButtonProps } from './NewInstanceButtonProps';

export function NewFolderButton({
  klass,
  subtle,
  icon,
  parent,
  children,
  label,
}: NewInstanceButtonProps): JSX.Element {
  const resource = useResource(klass);
  const [title] = useTitle(resource);
  const [name, setName] = useState('');

  const [dialogProps, show, hide] = useDialog();

  const createResourceAndNavigate = useCreateAndNavigate(klass, parent);

  const onDone = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      createResourceAndNavigate('Folder', {
        [properties.name]: name,
        [properties.displayStyle]: 'list',
        [properties.isA]: [classes.folder],
      });
    },
    [name],
  );

  return (
    <>
      <Base
        onClick={show}
        title={title}
        icon={icon}
        subtle={subtle}
        label={label}
      >
        {children}
      </Base>
      <Dialog {...dialogProps}>
        <DialogTitle>
          <h1>New Folder</h1>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={onDone}>
            <Field required label='url'>
              <InputWrapper>
                <InputStyled
                  placeholder='New Folder'
                  value={name}
                  autoFocus={true}
                  onChange={e => setName(e.target.value)}
                />
              </InputWrapper>
            </Field>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={hide} subtle>
            Cancel
          </Button>
          <Button onClick={onDone} disabled={name.trim() === ''}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
