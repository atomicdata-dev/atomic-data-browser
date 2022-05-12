import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Show from './ShowRoute';
import { Search } from './SearchRoute';
import New from './NewRoute';
import { SettingsTheme } from './SettingsTheme';
import { Edit } from './EditRoute';
import Data from './DataRoute';
import { Shortcuts } from './ShortcutsRoute';
import { About as About } from './AboutRoute';
import Local from './LocalRoute';
import SettingsAgent from './SettingsAgent';
import { SettingsServer } from './SettingsServer';
import { paths } from './paths';
import ResourcePage from '../views/ResourcePage';
import { ShareRoute } from './ShareRoute';

/**
 * Handles the browser URL navigation paths. Some rules:
 *
 * - Resource defined by this app should start with `/app`
 * - The home page should show the atomic data resource of the same URL
 */
export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path={paths.new} element={<New />} />
      <Route path={paths.themeSettings} element={<SettingsTheme />} />
      <Route path={paths.agentSettings} element={<SettingsAgent />} />
      <Route path={paths.serverSettings} element={<SettingsServer />} />
      <Route path={paths.shortcuts} element={<Shortcuts />} />
      <Route path={paths.data} element={<Data />} />
      <Route path={paths.edit} element={<Edit />} />
      <Route path={paths.share} element={<ShareRoute />} />
      <Route path={paths.show} element={<Show />} />
      <Route path={paths.about} element={<About />} />
      <Route path={paths.search} element={<Search />} />
      <Route
        path='/'
        element={<ResourcePage subject={window.location.href} />}
      />
      <Route path='*' element={<Local />} />
    </Routes>
  );
}
