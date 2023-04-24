import { Resource, urls, useCanWrite, useString } from '@tomic/react';
import React, { useContext, useMemo, useState } from 'react';
import { DropdownMenu, Item } from '../../components/Dropdown';
import { buildDefaultTrigger } from '../../components/Dropdown/DefaultTrigger';
import { FaEdit, FaEllipsisV, FaTrash } from 'react-icons/fa';
import styled from 'styled-components';
import { EditPropertyDialog } from './PropertyForm/EditPropertyDialog';
import { TablePageContext } from './tablePageContext';

interface TableHeadingMenuProps {
  resource: Resource;
}

const Trigger = buildDefaultTrigger(<FaEllipsisV />, 'Edit column');

const useIsExternalProperty = (property: Resource) => {
  const { tableClassResource } = useContext(TablePageContext);
  const [parent] = useString(property, urls.properties.parent);

  return parent !== tableClassResource.getSubject();
};

export function TableHeadingMenu({
  resource,
}: TableHeadingMenuProps): JSX.Element {
  const canWrite = useCanWrite(resource);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const isExternalProperty = useIsExternalProperty(resource);

  const items = useMemo(
    (): Item[] => [
      {
        id: 'edit',
        label: 'Edit',
        onClick: () => setShowEditDialog(true),
        icon: <FaEdit />,
        disabled: !canWrite || isExternalProperty,
      },
      {
        id: 'delete',
        label: 'Delete',
        onClick: () => alert('Not yet implemented!'),
        icon: <FaTrash />,
        disabled: !canWrite,
      },
    ],
    [],
  );

  return (
    <Wrapper>
      <DropdownMenu trigger={Trigger} items={items} />
      <EditPropertyDialog
        resource={resource}
        showDialog={showEditDialog}
        bindShow={setShowEditDialog}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-left: auto;

  & button {
    color: ${p => p.theme.colors.textLight};
  }
`;
