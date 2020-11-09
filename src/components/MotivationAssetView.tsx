import React, {FC} from 'react';
import {Chip, InputLabel, Paper, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";
import ReactAudioPlayer from "react-audio-player";
import {LocalMotivationAsset} from "../reducers/MotivationAssetReducer";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  waifuContainer: {
    padding: theme.spacing(4),
  },
  waifuAssetDetails: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const top100Films = [
  {title: 'The Shawshank Redemption', year: 1994},
  {title: 'The Godfather', year: 1972},
  {title: 'The Godfather: Part II', year: 1974},
  {title: 'The Dark Knight', year: 2008},
  {title: '12 Angry Men', year: 1957},
  {title: "Schindler's List", year: 1993},
  {title: 'Pulp Fiction', year: 1994},
]

interface Props {
  motivationAsset?: LocalMotivationAsset;
  assetHref?: string
}

const MotivationAssetView: FC<Props> = ({assetHref}) => {
  const classes = useStyles();
  return !assetHref ? (<span>Not-Found</span>) : (
    <div style={{display: 'flex'}}>
      <div className={classes.waifuContainer}>
        <Paper className={classes.paper}>
          <img src={assetHref} alt={assetHref}/>
        </Paper>
        <Typography variant={"subtitle1"} style={{marginTop: '1rem'}}>Image Dimensions: </Typography>
      </div>
      <div className={classes.waifuAssetDetails}>
        <Typography variant={'h5'} paragraph>
          Asset Details
        </Typography>
        <form>
          <TextField name='objectKey'
                     label="Object Key"
                     placeholder={'visuals/best_girl.gif'}
                     variant={"outlined"}
                     inputProps={{readOnly: true}}
          />
          <TextField name='objectKey'
                     placeholder={"Best Girl"}
                     label="Image Alt"
                     variant={"outlined"}

          />
          <Autocomplete
            multiple
            id="tags-outlined"
            options={top100Films}
            getOptionLabel={(option) => option.title}
            defaultValue={[]}
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
          <Autocomplete
            multiple
            id="tags-outlined"
            options={top100Films}
            getOptionLabel={(option) => option.title}
            defaultValue={[]}
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
        </form>
        <Typography variant={'h5'} paragraph style={{marginTop: '2rem'}}>
          Related Assets
        </Typography>
        <div>
          <InputLabel style={{marginBottom: '0.5rem'}}>Audio</InputLabel>
          <ReactAudioPlayer
            src={"https://waifu-motivation-assets-nonprod.s3.amazonaws.com/audible/celebration/waoow.mp3"} controls/>
        </div>
        <div>
          <TextField name='objectKey'
                     label="Notification Title"
                     placeholder={'You\'re the best!'}
                     variant={"outlined"}
                     inputProps={{readOnly: true}}
          />
        </div>
      </div>
    </div>
  );
};

export default MotivationAssetView;
