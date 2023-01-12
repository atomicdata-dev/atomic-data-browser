import { Resource, unknownSubject } from '@tomic/react';
import { createContext } from 'react';

export interface TablePageContextType {
  tableClassResource: Resource;
}

export const TablePageContext = createContext<TablePageContextType>({
  tableClassResource: new Resource(unknownSubject),
});
