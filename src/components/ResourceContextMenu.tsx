import React from 'react';
import { useHistory } from 'react-router-dom';
import { Resource } from '../atomic-lib/resource';
import { editURL, dataURL, openURL } from '../helpers/navigation';
import { DropdownMenu, MenuItemProps } from './DropdownMenu';

type Props = {
  resource: Resource;
  // ID's of actions that are hidden
  hide?: string[];
};

/** Dropdown menu that opens a bunch of actions for some resource */
function ResourceContextMenu({ resource, hide }: Props): JSX.Element {
  const history = useHistory();
  const subject = resource.getSubject();

  const items: MenuItemProps[] = [
    { id: 'view', label: 'normal view', helper: 'Open the regular, default View.', onClick: () => history.push(openURL(subject)) },
    { id: 'edit', label: 'edit', helper: 'Open the edit form. (e)', onClick: () => history.push(editURL(subject)) },
    {
      id: 'data',
      label: 'data view',
      helper: 'View the resource and its properties in the Data View. (d)',
      onClick: () => history.push(dataURL(subject)),
    },
  ];

  const filteredItems = hide ? items.filter(item => !hide.includes(item.id)) : items;

  return (
    <span style={{ float: 'right' }}>
      <DropdownMenu items={filteredItems} />
    </span>
  );
}

export default ResourceContextMenu;
