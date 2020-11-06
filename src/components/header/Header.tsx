import React, {FC, MouseEventHandler, useEffect, useState} from 'react';
import {UserProfile} from "../../types/User";
import Auth from "@aws-amplify/auth";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AppBar from "@material-ui/core/AppBar";
import {makeStyles} from "@material-ui/core/styles";
import {Avatar} from "@material-ui/core";

interface Props {
  onOpen: MouseEventHandler;
  open: boolean;
}

export const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
}));


const Header: FC<Props> = ({
                             onOpen,
                             open,
                           }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  useEffect(() => {
    Auth.currentUserInfo().then(userinfo => {
      setUserProfile(userinfo)
    });
  }, []);
  const classes = useStyles();

  return (
    <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <MenuIcon/>
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          Waifu Asset Management
        </Typography>
        {
          userProfile && (
            <IconButton color="inherit">
              <Avatar src={userProfile.attributes.picture} />
            </IconButton>
          )
        }
      </Toolbar>
    </AppBar>
  );
};

export default Header;
