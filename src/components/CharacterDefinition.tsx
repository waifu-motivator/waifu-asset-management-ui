import React, {FC} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {IconButton, Typography} from "@material-ui/core";
import {Add} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  sourceTree: {
    flexGrow: 1,
    maxWidth: 400,
  },
}));

const CharacterDefinition: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant={'h5'} paragraph>
        Character Sources
      </Typography>
      <TreeView
        className={classes.sourceTree}
        defaultCollapseIcon={<ExpandMoreIcon/>}
        defaultExpandIcon={<ChevronRightIcon/>}
      >
        <TreeItem nodeId="1" label="Applications">
          <TreeItem nodeId="2" label="Calendar"/>
          <TreeItem nodeId="3" label="Chrome"/>
          <TreeItem nodeId="4" label="Webstorm"/>
        </TreeItem>
        <TreeItem nodeId="5" label="Documents">
          <TreeItem nodeId="10" label="OSS"/>
          <TreeItem nodeId="6" label="Material-UI">
            <TreeItem nodeId="7" label="src">
              <TreeItem nodeId="8" label="index.js"/>
              <TreeItem nodeId="9" label="tree-view.js"/>
            </TreeItem>
          </TreeItem>
        </TreeItem>
      </TreeView>
      <IconButton component={'span'}>
        <Add/>
      </IconButton>
    </div>
  );
};
export default CharacterDefinition
