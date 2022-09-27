import { Resource } from '@tomic/react';

export enum FolderDisplayStyle {
  List = 'list',
  Grid = 'grid',
}

export interface ViewProps {
  subResources: Map<string, Resource>;
  onNewClick: () => void;
}
