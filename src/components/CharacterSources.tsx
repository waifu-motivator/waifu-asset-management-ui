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
import {createdAnime, createdWaifu, updatedWaifu} from "../events/CharacterSourceEvents";
import {v4 as uuid} from 'uuid';
import {Anime, Waifu} from "../reducers/VisualAssetReducer";

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


const WaifuSubmission: FC<{ onSubmission: (newBestGirl: string) => void }> = ({
                                                                                onSubmission,
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

  return <form onSubmit={handleSubmit}>
    <TextField label={'Add Waifu'}
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

const WaifuCharacterSource: FC<{
  waifu: Waifu,
  onUpdate: (updatedWaifu: Waifu) => void
}> = ({
        waifu, onUpdate
      }) => {
  const [isUpdate, setIsUpdate] = useState(false);

  const {
    handleSubmit,
    values: formValues,
    handleChange,
  } = useFormik({
    initialValues: {
      name: waifu.name
    },
    onSubmit: ({name}, {resetForm}) => {
      onUpdate({
        ...waifu,
        name
      });
      resetForm();
      setIsUpdate(false);
    }
  });

  const discardChanges = () => {
    setIsUpdate(false);
  }

  return !isUpdate ?
      <TreeItem nodeId={waifu.id} label={
        <Tooltip title={'Click to edit'} placement={'top-start'}><span>{waifu.name}</span></Tooltip>
      } title={'Click to edit'} onClick={()=>setIsUpdate(prevState => !prevState)}/>
    :
    <form onSubmit={handleSubmit}>
      <TextField label={'Name'}
                 name={'name'}
                 variant={'outlined'}
                 placeholder={'Add a new best girl'}
                 value={formValues.name}
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

  const updateWaifu = (waifuUpdate: Waifu) => {
    dispatch(updatedWaifu(waifuUpdate));
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
              <TreeItem key={dasAnime.id}
                        nodeId={dasAnime.id}
                        label={dasAnime.name}>
                {
                  waifuByAnime[dasAnime.id]?.map(bestGirl => (
                    <WaifuCharacterSource key={bestGirl.id}
                                          waifu={bestGirl}
                                          onUpdate={updateWaifu}/>
                  ))
                }
                <WaifuSubmission onSubmission={createWaifu(dasAnime)}/>
              </TreeItem>
            ))
        }
      </TreeView>
      <div>
        <form onSubmit={handleSubmit}>
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
