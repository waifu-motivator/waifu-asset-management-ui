import React, {FC, useMemo} from 'react';
import {Button, Chip, InputLabel, Paper, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";
import ReactAudioPlayer from "react-audio-player";
import {MotivationAsset} from "../reducers/MotivationAssetReducer";
import {useFormik} from "formik";
import {WaifuAssetCategory} from "../reducers/VisualAssetReducer";
import {useDispatch, useSelector} from "react-redux";
import {isEmpty, values as getValues} from 'lodash';
import {useHistory} from 'react-router-dom';
import {selectCharacterSourceState} from "../reducers";
import {getFileType, readFile} from "./Upload";
import {AssetGroupKeys} from "../types/AssetTypes";
import {updatedMotivationAsset} from "../events/MotivationAssetEvents";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  waifuContainer: {
    padding: theme.spacing(4),
  },
  waifuAssetDetails: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(15),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const waifuAssetCategories = [
  {title: 'Acknowledgement', value: WaifuAssetCategory.ACKNOWLEDGEMENT},
  {title: 'Frustration', value: WaifuAssetCategory.FRUSTRATION},
  {title: 'Enraged', value: WaifuAssetCategory.ENRAGED},
  {title: 'Celebration', value: WaifuAssetCategory.CELEBRATION},
  {title: 'Happy', value: WaifuAssetCategory.HAPPY},
  {title: 'Smug', value: WaifuAssetCategory.SMUG},
  {title: 'Waiting', value: WaifuAssetCategory.WAITING},
  {title: 'Motivation', value: WaifuAssetCategory.MOTIVATION},
  {title: 'Welcoming', value: WaifuAssetCategory.WELCOMING},
  {title: 'Departure', value: WaifuAssetCategory.DEPARTURE},
  {title: 'Encouragement', value: WaifuAssetCategory.ENCOURAGEMENT},
  {title: 'Tsundere', value: WaifuAssetCategory.TSUNDERE},
  {title: 'Mocking', value: WaifuAssetCategory.MOCKING},
  {title: 'Shocked', value: WaifuAssetCategory.SHOCKED},
  {title: 'Disappointment', value: WaifuAssetCategory.DISAPPOINTMENT},
]

interface Props {
  motivationAsset: MotivationAsset;
  isEdit?: boolean
}

const MotivationAssetView: FC<Props> = ({
                                          motivationAsset, isEdit
                                        }) => {
  const classes = useStyles();

  const history = useHistory();
  const goBack = () => {
    history.push(isEdit ? "/" : "/asset/upload")
  }
  const dispatch = useDispatch();

  const {
    handleChange,
    values,
    setFieldValue,
    submitForm,
    isSubmitting,
    dirty,
    errors
  } = useFormik({
    initialValues: {
      objectKey: motivationAsset?.visuals?.path,
      imageAlt: motivationAsset?.visuals?.imageAlt,
      categories: motivationAsset?.visuals?.categories,
      characterIds: motivationAsset?.visuals?.characterIds,
      sound: motivationAsset?.audioHref,
      soundFile: undefined as File | undefined,
      title: motivationAsset?.title,
    },
    enableReinitialize: true,
    onSubmit: (values, {setSubmitting}) => {
      dispatch(updatedMotivationAsset({
        ...motivationAsset,
        audioFile: values.soundFile,
        imageHref: motivationAsset.imageHref,
        visuals: {
          ...motivationAsset.visuals,
          path: values.objectKey,
          imageAlt: values.imageAlt || '',
          categories: values.categories,
          characterIds: values.characterIds
        }
      }))
      setSubmitting(false);
      goBack();
    }
  });

  const {waifu} = useSelector(selectCharacterSourceState)

  const listOfWaifu = useMemo(() => getValues(waifu).map(bestGirl => ({
    title: bestGirl.name,
    value: bestGirl.id,
  })), [waifu]);

  const imageDimensions = motivationAsset.visuals?.imageDimensions;
  return <div style={{display: 'flex', flexDirection: "column", flexGrow: 1}}>
    <div style={{display: 'flex', margin: '0 auto', flexDirection: 'row', flexWrap: 'wrap', width: '100%'}}>
      <div className={classes.waifuContainer}>
        <Paper className={classes.paper}>
          <img src={motivationAsset.imageHref} alt={motivationAsset.visuals.imageAlt}/>
        </Paper>
        <Typography variant={"subtitle1"} style={{marginTop: '1rem'}}>Image Dimensions:{' '}
          {imageDimensions?.width}x{imageDimensions?.height}</Typography>
      </div>
      <div className={classes.waifuAssetDetails}>
        <div style={{maxWidth: 500, marginRight: '2rem', minWidth: 300}}>
          <Typography variant={'h5'} paragraph>
            Asset Details
          </Typography>
          <form style={{display: 'flex', flexDirection: 'column'}}>
            <TextField name='objectKey'
                       label="Image Path"
                       value={values.objectKey}
                       onChange={handleChange}
                       placeholder={`${AssetGroupKeys.VISUAL}/best_girl.gif`}
                       variant={"outlined"}
                       inputProps={{readOnly: isEdit}}
            />
            <TextField name='imageAlt'
                       placeholder={"Best Girl"}
                       label="Image Alt"
                       value={values.imageAlt}
                       onChange={handleChange}
                       variant={"outlined"}
                       style={{marginTop: '1rem'}}

            />
            {
              values.categories && (
                <Autocomplete
                  multiple
                  id="categories"
                  options={waifuAssetCategories}
                  getOptionLabel={(option) => option.title}
                  defaultValue={(values.categories || []).map(cat => waifuAssetCategories.find(
                    waifuCat => waifuCat.value === cat
                  ) || waifuAssetCategories[0])}
                  style={{marginTop: '1rem'}}
                  filterSelectedOptions
                  onChange={(event, newValue) => {
                    setFieldValue("categories", newValue.map(option => option.value))
                  }}
                  getOptionSelected={(option => !!values.categories?.find(cat => cat === option.value))}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option.title}
                        label={option.title}
                        color={'secondary'}
                        {...getTagProps({index})}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Categories"
                      placeholder="Category"
                    />
                  )}
                />
              )
            }
            {
              motivationAsset?.visuals && (
                <Autocomplete
                  multiple
                  id="characterIds"
                  options={listOfWaifu}
                  getOptionLabel={(option) => option.title}
                  defaultValue={(values.characterIds || []).map(cat => listOfWaifu.find(
                    waifuCat => waifuCat.value === cat
                  ) || listOfWaifu[0])}
                  style={{marginTop: '1rem'}}
                  filterSelectedOptions
                  onChange={(event, newValue) => {
                    setFieldValue("characterIds", newValue.map(option => option.value))
                  }}
                  getOptionSelected={(option => !!values.characterIds?.find(cat => cat === option.value))}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option.title}
                        label={option.title}
                        color={'secondary'}
                        {...getTagProps({index})}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Character(s)"
                      placeholder="Waifu"
                    />
                  )}
                />
              )
            }
          </form>
        </div>
        <div style={{maxWidth: 500}}>
          <Typography variant={'h5'} paragraph>
            Related Assets
          </Typography>
          {/*<div>*/}
          {/*  <TextField name='title'*/}
          {/*             label="Notification Title"*/}
          {/*             placeholder={'You\'re the best!'}*/}
          {/*             variant={"outlined"}*/}
          {/*             value={values.title}*/}
          {/*             onChange={handleChange}*/}
          {/*             style={{width: '100%'}}*/}
          {/*  />*/}
          {/*</div>*/}
          <div style={{marginTop: '1rem'}}>
            <InputLabel style={{marginBottom: '0.5rem'}}>Audio</InputLabel>
            {
              values.sound && (
                <ReactAudioPlayer
                  src={values.sound}
                  controls/>
              )
            }

            <input type={"file"}
                   onChange={e => {
                     const soundFile = (e?.target?.files || [])[0];
                     readFile(soundFile)
                       .then(({
                                binaryStr
                              }) => {
                         setFieldValue('soundFile', soundFile);
                         setFieldValue('sound', `data:audio/${getFileType(soundFile)};base64,${binaryStr}`)
                       })
                   }}
                   accept={"audio/*"}/>
          </div>
        </div>
      </div>
    </div>
    <Paper style={{
      bottom: 0,
      padding: '1.25rem 1rem',
      width: "100%",
      position: "fixed",
      display: "flex",
      flexDirection: 'row',
      zIndex: 9001,
      boxShadow: '0px -2px 4px -1px rgba(0,0,0,0.2), 0px -4px 5px 0px rgba(0,0,0,0.14), 0px -1px 10px 0px rgba(0,0,0,0.12'
    }}>
      <Button variant={"contained"}
              color={"secondary"}
              disabled={
                !(dirty && isEmpty(errors)) ||
                isSubmitting
              }
              onClick={submitForm}
              style={{width: 150, marginRight: '2rem'}}>SAVE</Button>
      <Button variant={"outlined"}
              onClick={goBack}
              style={{width: 150, marginRight: '2rem'}}>
        CANCEL
      </Button>
    </Paper>
  </div>
};


export default MotivationAssetView;
