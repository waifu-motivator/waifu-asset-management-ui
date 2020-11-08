import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import {CloudUpload, Gif, RecordVoiceOver, ShortText} from "@material-ui/icons";
import {SvgIconTypeMap} from "@material-ui/core";
import {OverridableComponent} from "@material-ui/core/OverridableComponent";
import Dashboard from "./Dashboard";
import {Link} from 'react-router-dom';
import Upload from "./Upload";

interface RouteDefinition {
  route: string;
  name: string;
  icon: OverridableComponent<SvgIconTypeMap>;
  routeComponent: React.FunctionComponent;
  extraRouteProps: { [prop: string]: any }
}

export const MainLocations: RouteDefinition[] = [
  {name: 'Dashboard', icon: DashboardIcon, route: '/', routeComponent: Dashboard, extraRouteProps: {exact: true}},
  {name: 'Upload', icon: CloudUpload, route: '/asset/upload', routeComponent: Upload, extraRouteProps: {}},
  {name: 'Groups ', icon: PeopleIcon, route: '/asset/grouping', routeComponent: Dashboard, extraRouteProps: {}},
]

export const SecondaryLocations: RouteDefinition[] = [
  {name: 'Visual', icon: Gif, route: '/asset/type/visual', routeComponent: Dashboard, extraRouteProps: {}},
  {name: 'Audio', icon: RecordVoiceOver, route: '/asset/type/audio', routeComponent: Dashboard, extraRouteProps: {}},
  {name: 'Text ', icon: ShortText, route: '/asset/type/text', routeComponent: Dashboard, extraRouteProps: {}},
]

const buildListItems = (routeDefinitions: RouteDefinition[], currentRoute: string) =>
  (
    routeDefinitions.map(routeDef => (
      <Link key={routeDef.name} to={routeDef.route}>
        <ListItem button selected={currentRoute === routeDef.route}>
          <ListItemIcon>
            <routeDef.icon/>
          </ListItemIcon>
          <ListItemText primary={routeDef.name}/>
        </ListItem>
      </Link>
    ))
  );

export const mainListItems = (currentRoute: string): JSX.Element => (
  <div>
    {
      buildListItems(MainLocations, currentRoute)
    }
  </div>
);

export const secondaryListItems = (currentRoute: string): JSX.Element => (
  <div>
    <ListSubheader inset>Asset Categories</ListSubheader>
    {
      buildListItems(SecondaryLocations, currentRoute)
    }
  </div>
);
