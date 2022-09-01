import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isValidURL } from '@tomic/lib';
import { useStore } from '@tomic/react';
import {
  editURL,
  dataURL,
  constructOpenURL,
  versionsURL,
  shareURL,
} from '../../helpers/navigation';
import { DropdownMenu, MenuItemMinimial } from '../Dropdown';
import toast from 'react-hot-toast';
import { paths } from '../../routes/paths';
import { shortcuts } from '../HotKeyWrapper';
import { DropdownTriggerRenderFunction } from '../Dropdown/DropdownTrigger';
import { buildDefaultTrigger } from '../Dropdown/DefaultTrigger';
import {
  FaClock,
  FaEdit,
  FaEllipsisV,
  FaRedo,
  FaShareSquare,
  FaTrash,
} from 'react-icons/fa';

export interface ResourceContextMenuProps {
  subject: string;
  // ID's of actions that are hidden
  hide?: string[];
  trigger?: DropdownTriggerRenderFunction;
  simple?: boolean;
}

/** Dropdown menu that opens a bunch of actions for some resource */
function ResourceContextMenu({
  subject,
  hide,
  trigger,
  simple,
}: ResourceContextMenuProps): JSX.Element {
  const store = useStore();
  const navigate = useNavigate();
  const location = useLocation();
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
        navigate('/');
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  const items: MenuItemMinimial[] = [
    ...(simple
      ? []
      : [
          {
            disabled: location.pathname.startsWith(paths.show),
            id: 'view',
            label: 'normal view',
            helper: 'Open the regular, default View.',
            onClick: () => navigate(constructOpenURL(subject)),
          },
          {
            disabled: location.pathname.startsWith(paths.data),
            id: 'data',
            label: 'data view',
            helper: 'View the resource and its properties in the Data View.',
            shortcut: shortcuts.data,
            onClick: () => navigate(dataURL(subject)),
          },
          {
            id: 'refresh',
            icon: <FaRedo />,
            label: 'refresh',
            helper:
              'Fetch the resouce again from the server, possibly see new changes.',
            onClick: () => store.fetchResource(subject),
          },
        ]),
    {
      // disabled: !canWrite || location.pathname.startsWith(paths.edit),
      id: 'edit',
      label: 'edit',
      helper: 'Open the edit form.',
      icon: <FaEdit />,
      shortcut: simple ? '' : shortcuts.edit,
      onClick: () => navigate(editURL(subject)),
    },
    {
      // disabled: !canWrite || history.location.pathname.startsWith(paths.edit),
      id: 'share',
      label: 'share',
      icon: <FaShareSquare />,
      helper: 'Open the share menu',
      onClick: () => navigate(shareURL(subject)),
    },
    {
      // disabled: !canWrite,
      id: 'delete',
      icon: <FaTrash />,
      label: 'delete',
      helper:
        'Fetch the resouce again from the server, possibly see new changes.',
      onClick: handleDestroy,
    },
    {
      id: 'versions',
      icon: <FaClock />,
      label: 'versions',
      helper: 'Show the versions of this resource',
      onClick: () => navigate(versionsURL(subject, store.getServerUrl())),
    },
  ];

  const filteredItems = hide
    ? items.filter(item => !hide.includes(item.id))
    : items;

  const triggerComp = trigger ?? buildDefaultTrigger(<FaEllipsisV />);

  return <DropdownMenu items={filteredItems} trigger={triggerComp} />;
}

export default ResourceContextMenu;
