import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

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

/**
 * Handles the browser URL navigation paths. Some rules:
 *
 * - Resource defined by this app should start with `/app`
 * - The home page should show the atomic data resource of the same URL
 */
export function Routes(): JSX.Element {
  return (
    <Switch>
      <Route path={paths.new}>
        <New />
      </Route>
      <Route path={paths.themeSettings}>
        <SettingsTheme />
      </Route>
      <Route path={paths.agentSettings}>
        <SettingsAgent />
      </Route>
      <Route path={paths.serverSettings}>
        <SettingsServer />
      </Route>
      <Route path={paths.shortcuts}>
        <Shortcuts />
      </Route>
      <Route path={paths.data}>
        <Data />
      </Route>
      <Route path={paths.edit}>
        <Edit />
      </Route>
      <Route path={paths.show}>
        <Show />
      </Route>
      <Route path={paths.about}>
        <About />
      </Route>
      <Route path={paths.search} component={Search} />
      <Route path='/:path' component={Local} />
      <Route exact path=''>
        <ResourcePage subject={window.location.origin} />
      </Route>
    </Switch>
  );
}
