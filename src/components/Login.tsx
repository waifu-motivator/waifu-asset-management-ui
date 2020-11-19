import React, {FC} from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import GoogleButton from "react-google-button";
import LoadingIndicator from './LoadingIndicator';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://raw.githubusercontent.com/waifu-motivator/waifu-motivator-plugin/master/images/wmp_logo.png)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  onLogin: () => void;
  loading: boolean;
}

const Login: FC<Props> = ({onLogin, loading}) => {
  const classes = useStyles();
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline/>
      <Grid item xs={false} sm={4} md={7} className={classes.image}/>
      {
        loading ?
          <div style={{
            margin: 'auto'
          }}>
            <LoadingIndicator/>
          </div>
          :
          (<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{
            display: "flex"
          }}>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon/>
              </Avatar>
              <Typography component="h1" variant="h5" paragraph>
                Waifu Asset Management
              </Typography>
              <form className={classes.form} noValidate>
                <GoogleButton onClick={onLogin} style={{
                  margin: '2rem auto 0 auto'
                }}/>
              </form>
            </div>
          </Grid>)
      }
    </Grid>
  );
};
export default Login
