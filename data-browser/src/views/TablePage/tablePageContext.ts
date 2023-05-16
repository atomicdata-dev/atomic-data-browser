import { Resource, unknownSubject } from '@tomic/react';
import { createContext } from 'react';
import { TableSorting } from './tableSorting';

export interface TablePageContextType {
  tableClassResource: Resource;
  sorting: TableSorting;
  setSortBy: React.Dispatch<string>;
}

export const TablePageContext = createContext<TablePageContextType>({
  tableClassResource: new Resource(unknownSubject),
  sorting: {
    prop: '',
    sortDesc: true,
  },
  setSortBy: () => undefined,
});
