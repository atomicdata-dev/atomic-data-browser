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
import { SettingsBaseURL } from './SettingsBaseURL';
import { paths } from './paths';

/** Handles the browser URL navigation paths */
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
      <Route path={paths.baseURLSettings}>
        <SettingsBaseURL />
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
      <Route exact path='/'>
        <Redirect to={paths.about} />
      </Route>
    </Switch>
  );
}
