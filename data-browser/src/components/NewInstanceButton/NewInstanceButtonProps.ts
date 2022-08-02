import React from 'react';

interface Props {
  klass: string;
  subtle?: boolean;
  icon?: boolean;
  /** ID of the parent Resource, which will be passed to the form */
  parent?: string;
}

export type NewInstanceButtonProps = React.PropsWithChildren<Props>;
