import React from 'react';
import { useHistory } from 'react-router-dom';
import { isValidURL } from '@tomic/lib';
import { useCanWrite, useResource, useStore } from '@tomic/react';
import {
  editURL,
  dataURL,
  openURL,
  versionsURL,
  shareURL,
} from '../helpers/navigation';
import { DropdownMenu, MenuItemMinimial } from '../components/DropdownMenu';
import { useSettings } from '../helpers/AppSettings';
import toast from 'react-hot-toast';
import { paths } from '../routes/paths';

type Props = {
  subject: string;
  // ID's of actions that are hidden
  hide?: string[];
};

/** Dropdown menu that opens a bunch of actions for some resource */
function ResourceContextMenu({ subject, hide }: Props): JSX.Element {
  const store = useStore();
  const history = useHistory();
  const { agent } = useSettings();
  const resource = useResource(subject);
  const [canWrite] = useCanWrite(resource, agent?.subject);
  // Try to not have a useResource hook in here, as that will lead to many costly fetches when the user enters a new subject

  if (subject == undefined) {
    return null;
  }

  if (!isValidURL(subject)) {
    return null;
  }

  async function handleDestroy() {
    if (
      window.confirm(
        'Are you sure you want to permanently delete this resource?',
      )
    ) {
      const resource = store.getResourceLoading(subject);
      try {
        await resource.destroy(store);
        toast.success('Resource deleted!');
        history.push('/');
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  const items: MenuItemMinimial[] = [
    {
      disabled: history.location.pathname.startsWith(paths.show),
      id: 'view',
      label: 'normal view',
      helper: 'Open the regular, default View.',
      onClick: () => history.push(openURL(subject)),
    },
    {
      disabled: history.location.pathname.startsWith(paths.data),
      id: 'data',
      label: 'data view',
      helper: 'View the resource and its properties in the Data View. (d)',
      onClick: () => history.push(dataURL(subject)),
    },
    {
      id: 'refresh',
      label: 'refresh',
      helper:
        'Fetch the resouce again from the server, possibly see new changes.',
      onClick: () => store.fetchResource(subject),
    },
    {
      // disabled: !canWrite || history.location.pathname.startsWith(paths.edit),
      id: 'edit',
      label: 'edit',
      helper: 'Open the edit form. (e)',
      onClick: () => history.push(editURL(subject)),
    },
    {
      // disabled: !canWrite || history.location.pathname.startsWith(paths.edit),
      id: 'share',
      label: 'share',
      helper: 'Open the share menu',
      onClick: () => history.push(shareURL(subject)),
    },
    {
      // disabled: !canWrite,
      id: 'delete',
      label: 'delete',
      helper:
        'Fetch the resouce again from the server, possibly see new changes.',
      onClick: handleDestroy,
    },
    {
      id: 'versions',
      label: 'versions',
      helper: 'Show the versions of this resource',
      onClick: () => history.push(versionsURL(subject, store.getServerUrl())),
    },
  ];

  const filteredItems = hide
    ? items.filter(item => !hide.includes(item.id))
    : items;

  return <DropdownMenu items={filteredItems} />;
}

export default ResourceContextMenu;
