import {
  FaCog,
  FaExternalLinkAlt,
  FaInfo,
  FaKeyboard,
  FaPlus,
  FaUser,
} from 'react-icons/fa';
import React from 'react';
import { paths } from '../../routes/paths';
import { SideBarMenuItemProps } from './SideBarMenuItem';

export const aboutMenuItems: SideBarMenuItemProps[] = [
  {
    // icon: <FaGithub />,
    icon: <FaExternalLinkAlt />,
    label: 'github',
    helper: 'View the source code for this application',
    href: 'https://github.com/atomicdata-dev/atomic-data-browser',
  },
  {
    // icon: <FaDiscord />,
    icon: <FaExternalLinkAlt />,
    label: 'discord',
    helper: 'Chat with the Atomic Data community',
    href: 'https://discord.gg/a72Rv2P',
  },
  {
    // icon: <FaBook />,
    icon: <FaExternalLinkAlt />,
    label: 'docs',
    helper: 'View the Atomic Data documentation',
    href: 'https://docs.atomicdata.dev',
  },
];

export const appMenuItems: SideBarMenuItemProps[] = [
  {
    icon: <FaPlus />,
    label: 'new resource',
    helper: 'Create a new Resource, based on a Class (n)',
    path: paths.new,
  },
  {
    icon: <FaUser />,
    label: 'user settings',
    helper: 'See and edit the current Agent / User (u)',
    path: paths.agentSettings,
  },
  {
    icon: <FaCog />,
    label: 'theme settings',
    helper: 'Edit the theme, current Agent, and more. (t)',
    path: paths.themeSettings,
  },
  {
    icon: <FaKeyboard />,
    label: 'keyboard shortcuts',
    helper: 'View the keyboard shortcuts (?)',
    path: paths.shortcuts,
  },
  {
    icon: <FaInfo />,
    label: 'about',
    helper: 'Welcome page, tells about this app',
    path: paths.about,
  },
];
