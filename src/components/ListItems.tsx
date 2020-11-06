import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {CloudUpload, Gif, RecordVoiceOver, ShortText} from "@material-ui/icons";

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <CloudUpload />
      </ListItemIcon>
      <ListItemText primary="Upload" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Groups" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Asset Categories</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <Gif />
      </ListItemIcon>
      <ListItemText primary="Visual" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <RecordVoiceOver />
      </ListItemIcon>
      <ListItemText primary="Audio" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ShortText />
      </ListItemIcon>
      <ListItemText primary="Text" />
    </ListItem>
  </div>
);
