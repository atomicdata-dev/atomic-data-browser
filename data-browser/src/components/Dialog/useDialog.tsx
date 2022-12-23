import React, { useCallback, useMemo, useState } from 'react';
import { InternalDialogProps } from './index';

export type UseDialogReturnType = [
  /** Props meant to pass to a {@link Dialog} component */
  dialogProps: InternalDialogProps,
  /** Function to show the dialog */
  show: () => void,
  /** Function to close the dialog */
  close: (success?: boolean) => void,
  /** Boolean indicating wether the dialog is currently open */
  isOpen: boolean,
];

/** Sets up state, and functions to use with a {@link Dialog} */
export const useDialog = (
  bindShow?: React.Dispatch<boolean>,
  onCancel?: () => void,
  onSuccess?: () => void,
): UseDialogReturnType => {
  const [showDialog, setShowDialog] = useState(false);
  const [visible, setVisible] = useState(false);
  const [wasSuccess, setWasSuccess] = useState(false);

  const show = useCallback(() => {
    setShowDialog(true);
    setVisible(true);
    bindShow?.(true);
  }, []);

  const close = useCallback((success = false) => {
    setWasSuccess(success);
    setShowDialog(false);
  }, []);

  const handleClosed = useCallback(() => {
    bindShow?.(false);
    setVisible(false);

    if (wasSuccess) {
      onSuccess?.();
    } else {
      onCancel?.();
    }

    setWasSuccess(false);
  }, [wasSuccess, onSuccess, onCancel]);

  /** Props that should be passed to a {@link Dialog} component. */
  const dialogProps = useMemo<InternalDialogProps>(
    () => ({
      show: showDialog,
      onClose: close,
      onClosed: handleClosed,
    }),
    [showDialog, close, handleClosed],
  );

  return [dialogProps, show, close, visible];
};
