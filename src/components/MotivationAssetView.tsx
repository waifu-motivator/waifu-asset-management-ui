import React, {FC, useMemo} from 'react';
import {Chip, InputLabel, Paper, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";
import ReactAudioPlayer from "react-audio-player";
import {MotivationAsset} from "../reducers/MotivationAssetReducer";
import {useFormik} from "formik";
import {WaifuAssetCategory} from "../reducers/VisualAssetReducer";
import {useSelector} from "react-redux";
import {values as getValues} from 'lodash';
import {selectCharacterSourceState} from "../reducers";

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
  motivationAsset?: MotivationAsset;
  isEdit?: boolean
}

const MotivationAssetView: FC<Props> = ({
                                          motivationAsset, isEdit
                                        }) => {
  const classes = useStyles();
  const {
    handleChange,
    values
  } = useFormik({
    initialValues: {
      objectKey: motivationAsset?.visuals?.path,
      imageAlt: motivationAsset?.visuals?.imageAlt,
      categories: motivationAsset?.visuals?.categories,
      characterIds: motivationAsset?.visuals?.characterIds,
    },
    enableReinitialize: true,
    onSubmit: values => {
      console.tron("this", values);
    }
  });

  const {waifu} = useSelector(selectCharacterSourceState)

  const listOfWaifu = useMemo(() => getValues(waifu).map(bestGirl => ({
    title: bestGirl.name,
    value: bestGirl.id,
  })), []);

  return !motivationAsset ? (<span>Not-Found</span>) : (
    <div style={{display: 'flex'}}>
      <div style={{display: 'flex', margin: '0 auto', flexDirection: 'row', flexWrap: 'wrap', width: '100%'}}>
        <div className={classes.waifuContainer}>
          <Paper className={classes.paper}>
            <img src={motivationAsset.imageHref} alt={motivationAsset.visuals.imageAlt}/>
          </Paper>
          <Typography variant={"subtitle1"} style={{marginTop: '1rem'}}>Image Dimensions: </Typography>
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
                         placeholder={'visuals/best_girl.gif'}
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
                    defaultValue={(values.characterIds || []).map(cat => waifuAssetCategories.find(
                      waifuCat => waifuCat.value === cat
                    ) || waifuAssetCategories[0])}
                    style={{marginTop: '1rem'}}
                    filterSelectedOptions
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
            <div>
              <TextField name='objectKey'
                         label="Notification Title"
                         placeholder={'You\'re the best!'}
                         variant={"outlined"}
                         style={{width: '100%'}}
              />
            </div>
            <div style={{marginTop: '1rem'}}>
              <InputLabel style={{marginBottom: '0.5rem'}}>Audio</InputLabel>
              <ReactAudioPlayer
                src={"https://waifu-motivation-assets-nonprod.s3.amazonaws.com/audible/celebration/waoow.mp3"}
                controls/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationAssetView;
