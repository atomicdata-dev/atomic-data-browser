import React from 'react';
import {
  Collection,
  Property,
  Resource,
  unknownSubject,
  urls,
  useMemberFromCollection,
  useResource,
  useStore,
} from '@tomic/react';
import { useEffect } from 'react';
import { TableCell } from './TableCell';
import { randomString } from '../../helpers/randomString';
import styled, { keyframes } from 'styled-components';

interface TableRowProps {
  collection: Collection;
  index: number;
  columns: Property[];
}

const TableCellMemo = React.memo(TableCell);

export function TableRow({
  collection,
  index,
  columns,
}: TableRowProps): JSX.Element {
  const resource = useMemberFromCollection(collection, index);

  if (resource.getSubject() === unknownSubject) {
    return (
      <>
        {columns.map((column, i) => (
          <Loader key={column.subject} delay={i * 100} />
        ))}
      </>
    );
  }

  return (
    <>
      {columns.map((column, cIndex) => (
        <TableCellMemo
          key={column.subject}
          rowIndex={index}
          columnIndex={cIndex + 1}
          resource={resource}
          property={column}
        />
      ))}
    </>
  );
}

type TableNewRowProps = Omit<TableRowProps, 'collection'> & {
  parent: Resource;
  invalidateTable: () => void;
};

const resourceOpts = {
  newResource: true,
};

const randomSubject = (parent: string) => {
  return `${parent}/row/${randomString(15)}`;
};

export function TableNewRow({
  index,
  columns,
  parent,
  invalidateTable,
}: TableNewRowProps): JSX.Element {
  const store = useStore();
  const [subject] = React.useState<string>(() =>
    randomSubject(parent.getSubject()),
  );

  const resource = useResource(subject, resourceOpts);

  useEffect(() => {
    if (resource.getSubject() === unknownSubject) {
      return;
    }

    resource.set(urls.properties.parent, parent.getSubject(), store);
    resource.set(
      urls.properties.isA,
      [parent.get(urls.properties.classType)],
      store,
    );
  }, [resource.getSubject()]);

  return (
    <>
      {columns.map((column, cIndex) => (
        <TableCellMemo
          key={column.subject}
          rowIndex={index}
          columnIndex={cIndex + 1}
          resource={resource}
          property={column}
          invalidateTable={invalidateTable}
        />
      ))}
    </>
  );
}

const pulse = keyframes`
  from {
    background-color: var(--from-color);
  }

  to {
    background-color: var(--to-color);
  }
`;

interface LoaderProps {
  delay: number;
}

const Loader = styled.div<LoaderProps>`
  width: 100%;
  --from-color: ${p => p.theme.colors.bg};
  --to-color: ${p => p.theme.colors.bg1};
  animation: 0.8s ${p => p.delay}ms ease-in-out infinite alternate ${pulse};
`;
