import './App.css';
import React, {useEffect, useMemo} from 'react';
import Header, {drawerWidth} from "./header/Header";
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {mainListItems, MainLocations, secondaryListItems, SecondaryLocations} from './ListItems';
import {useDispatch, useSelector} from "react-redux";
import {createApplicationInitializedEvent} from "../events/ApplicationLifecycleEvents";
import {Route, Switch} from 'react-router-dom';
import {selectRouterState} from "../reducers";
import MotivationAssetEditView from "./MotivationAssetEditView";
import AssetUploadView from "./AssetUploadView";
import SyncChanges from './SyncChanges';
import {withAuthenticator} from "./SecurityComponents";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
}));

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createApplicationInitializedEvent());
  }, []);

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const {location: {pathname}} = useSelector(selectRouterState)

  const routes = useMemo(() =>
      [
        ...MainLocations,
        ...SecondaryLocations
      ].map(routeDef =>
        (<Route key={routeDef.route}
                path={routeDef.route}
                component={routeDef.routeComponent}
                {...routeDef.extraRouteProps} />)
      )
    , []);

  return (
    <div className={classes.root}>
      <CssBaseline/>
      <Header onOpen={handleDrawerOpen} open={open}/>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon/>
          </IconButton>
        </div>
        <Divider/>
        <List>{mainListItems(pathname)}</List>
        <Divider/>
        <List>{secondaryListItems(pathname)}</List>
      </Drawer>
      <SyncChanges/>

      <main className={classes.content}>
        <div className={classes.appBarSpacer}/>
        <Switch>
          <Route path={'/assets/view/upload/:checkSum'} component={AssetUploadView}/>
          <Route path={'/assets/view/:etag'} component={MotivationAssetEditView}/>
          {
            routes
          }
        </Switch>
      </main>
    </div>
  );
};

export default withAuthenticator(App);
