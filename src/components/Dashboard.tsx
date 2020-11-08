import React, {FC, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Container, Grid, Link as MUILink, Paper, Typography} from "@material-ui/core";
import {useSelector} from "react-redux";
import {selectVisualAssetState} from "../reducers";
import InfiniteScroll from "./util/InfiniteScroll";
import {Link} from 'react-router-dom';
import {buildS3ObjectLink} from "../util/AWSTools";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    "&:hover":{
      backgroundColor: `var(--code-block-color)`,
    },
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <MUILink color="inherit" href="https://material-ui.com/">
        Your Website
      </MUILink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const waifuPerPage = 10;

const Dashboard: FC = () => {
  const classes = useStyles();

  const {s3List} = useSelector(selectVisualAssetState);
  const [assetIndex, setAssetIndex] = useState(waifuPerPage);

  const viewedS3Items = s3List.slice(0, assetIndex)
  const hasMore = s3List.length > viewedS3Items.length;
  const fetchData = () => {
    if(hasMore){
      setAssetIndex(prevState => {
        const nextIndex = prevState + waifuPerPage;
        return nextIndex > s3List.length ? s3List.length : nextIndex;
      })
    }

  };

  return !s3List.length ? (<></>) : (
    <Container className={classes.container}>
      <InfiniteScroll
                      loadMore={fetchData}
                      hasMore={hasMore}
                      loadMoreDisplay={<h3>Hang tight Senpai...</h3>}
      >
        <Grid container spacing={3}>

          {
            viewedS3Items.map(s3Item => (
              <Grid item key={s3Item.key}>
                <Link style={{textDecoration: 'none', color: 'inherit'}} to={`/assets/view/${s3Item.eTag}`}>
                  <Paper className={classes.paper}>
                    <img src={buildS3ObjectLink(s3Item)}
                         style={{
                           borderRadius: '0.5rem'
                         }}
                         alt={s3Item.key}/>
                  </Paper>
                </Link>
              </Grid>
            ))
          }
        </Grid>
      </InfiniteScroll>
      <Box pt={4}>
        <Copyright/>
      </Box>
    </Container>
  );
};

export default Dashboard;
