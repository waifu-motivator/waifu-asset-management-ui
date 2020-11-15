import React, {FC} from 'react';
import {Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

interface Props {
  href: string
}

const useStyles = makeStyles(theme => ({
  paper: {
    "&:hover": {
      backgroundColor: `var(--code-block-color)`,
    },
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  }
}))

const WaifuDisplay: FC<Props> = ({
                                   href
                                 }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <img src={href}
           style={{
             borderRadius: '0.5rem',
             objectFit: 'contain'
           }}
           alt={href}/>
    </Paper>
  );
};

export default WaifuDisplay;
