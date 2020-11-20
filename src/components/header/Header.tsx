import React, {FC, MouseEventHandler, useState} from 'react';
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import {makeStyles} from "@material-ui/core/styles";
import {Avatar, InputBase} from "@material-ui/core";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useDispatch, useSelector} from "react-redux";
import {selectUserState} from "../../reducers";
import {requestLogoff} from "../../events/SecurityEvents";
import {Search} from '@material-ui/icons';
import {invokeOnEnter} from "../util/Tools";
import {searchForItem} from "../../events/MotivationAssetEvents";

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
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'var(--secondary-color)',
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


const Header: FC<Props> = ({
                             onOpen,
                             open,
                           }) => {
  const {profile} = useSelector(selectUserState);
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<EventTarget & Element | null>(null);

  const handleClick: MouseEventHandler = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const logout = () => {
    handleClose();
    dispatch(requestLogoff())
  }

  const [searchItem, setSearchItem] = useState('');

  const search = () => {
    dispatch(searchForItem(searchItem));
  };

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
        <div className={classes.search} onKeyUp={invokeOnEnter(search)}>
          <div className={classes.searchIcon}>
            <Search/>
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{'aria-label': 'search'}}
            onChange={e => setSearchItem(e.target.value)}
          />
        </div>
        {
          profile && (
            <>
              <IconButton color="inherit" onClick={handleClick} style={{marginLeft: '1rem'}}>
                <Avatar src={profile.attributes.picture}/>
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          )
        }
      </Toolbar>
    </AppBar>
  );
};

export default Header;
