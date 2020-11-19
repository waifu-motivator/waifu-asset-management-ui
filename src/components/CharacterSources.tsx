import React, {FC, useMemo, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {IconButton, TextField, Tooltip, Typography} from "@material-ui/core";
import {Add, Cancel} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {selectCharacterSourceState} from "../reducers";
import {groupBy, values} from 'lodash';
import {useFormik} from "formik";
import {createdAnime, createdWaifu, updatedAnime, updatedWaifu} from "../events/CharacterSourceEvents";
import {v4 as uuid} from 'uuid';
import {Anime, Waifu} from "../reducers/VisualAssetReducer";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  sourceTree: {
    flexGrow: 1,
    maxWidth: 400,
  },
}));


const WaifuSubmission: FC<{ onSubmission: (newBestGirl: string) => void, anime: string }> = ({
                                                                                               onSubmission,
                                                                                               anime,
                                                                                             }) => {
  const {
    handleSubmit,
    values: formValues,
    handleChange
  } = useFormik({
    initialValues: {
      bestGirl: ''
    },
    onSubmit: ({bestGirl}, {resetForm}) => {
      onSubmission(bestGirl);
      resetForm()
    }
  })

  return <form onSubmit={handleSubmit} style={{margin: '1rem 0'}}>
    <TextField label={`Add ${anime} Waifu`}
               name={'bestGirl'}
               variant={'outlined'}
               placeholder={'Add a new best girl'}
               value={formValues.bestGirl}
               onChange={handleChange}
    />
    <IconButton component={'button'} type={'submit'}>
      <Add/>
    </IconButton>
  </form>
}

const EditableTreeItem: FC<{
  value: string;
  id: string;
  onUpdate: (updatedWaifu: string) => void
}> = ({
        value, onUpdate, id, children
      }) => {
  const [isUpdate, setIsUpdate] = useState(false);

  const {
    handleSubmit,
    values: formValues,
    handleChange,
  } = useFormik({
    initialValues: {
      value: value
    },
    enableReinitialize: true,
    onSubmit: ({value: newValue}, {resetForm}) => {
      onUpdate(newValue);
      resetForm();
      setIsUpdate(false);
    }
  });

  const discardChanges = () => {
    setIsUpdate(false);
  }

  return !isUpdate ?
    <TreeItem nodeId={id} label={
      <Tooltip title={'Click to edit'} placement={'top-start'}><span onClick={e => {
        setIsUpdate(prevState => !prevState);
        e.stopPropagation();
      }}>{value}</span></Tooltip>
    }>
      {children}
    </TreeItem>
    :
    <form onSubmit={handleSubmit} style={{margin: '1rem 0'}}>
      <TextField label={'Name'}
                 name={'value'}
                 variant={'outlined'}
                 placeholder={'Add a new best girl'}
                 value={formValues.value}
                 onChange={handleChange}
      />
      <IconButton component={'button'} type={'submit'}>
        <Add/>
      </IconButton>
      <IconButton component={'span'} onClick={discardChanges}>
        <Cancel/>
      </IconButton>
    </form>
}

const CharacterSources: FC = () => {
  const classes = useStyles();
  const {anime, waifu} = useSelector(selectCharacterSourceState);
  const waifuByAnime = useMemo(() =>
      groupBy(values(waifu), bestGirl => bestGirl.animeId),
    [waifu]);

  const dispatch = useDispatch();
  const createWaifu = (anime: Anime) => (newBestGirl: string) => {
    dispatch(createdWaifu({
      id: uuid(),
      name: newBestGirl,
      animeId: anime.id,
    }));
  };

  const updateWaifu = (waifuToUpdate: Waifu) => (newWaifuName: string) => {
    dispatch(updatedWaifu({
      ...waifuToUpdate,
      name: newWaifuName,
    }));
  };

  const updateAnime = (animeToUpdate: Anime) => (newAnimeName: string) => {
    dispatch(updatedAnime({
      ...animeToUpdate,
      name: newAnimeName,
    }));
  };

  const {
    handleSubmit,
    values: formValues,
    handleChange
  } = useFormik({
    initialValues: {
      anime: ''
    },
    onSubmit: (newAnime, {resetForm}) => {
      dispatch(createdAnime({
        name: newAnime.anime,
        id: uuid(),
      }));
      resetForm();
    }
  });

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
        {
          values(anime).map(dasAnime =>
            (
              <EditableTreeItem
                key={dasAnime.id}
                id={dasAnime.id}
                value={dasAnime.name}
                onUpdate={updateAnime(dasAnime)}
              >
                {
                  waifuByAnime[dasAnime.id]?.map(bestGirl => (
                    <EditableTreeItem key={bestGirl.id}
                                      value={bestGirl.name}
                                      id={bestGirl.id}
                                      onUpdate={updateWaifu(bestGirl)}/>
                  ))
                }
                <WaifuSubmission onSubmission={createWaifu(dasAnime)} anime={dasAnime.name}/>
              </EditableTreeItem>
            ))
        }
      </TreeView>
      <div>
        <form onSubmit={handleSubmit} style={{margin: '1rem 0'}}>
          <TextField label={'Anime'}
                     name={'anime'}
                     variant={'outlined'}
                     placeholder={'Add an Anime'}
                     value={formValues.anime}
                     onChange={handleChange}
          />
          <IconButton component={'button'} type={'submit'}>
            <Add/>
          </IconButton>
        </form>
      </div>
    </div>
  );
};
export default CharacterSources
