import React, {FC} from 'react';
import {Paper, Typography} from "@material-ui/core";

const Todo: FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: "flex"
    }}>
      <div style={{margin: '2rem auto 0 auto', textAlign: 'center'}}>
        <Typography variant={'h2'} paragraph>
          A Work in Progress
        </Typography>
        <Paper style={{padding: '1rem'}}>
          <img
            style={{borderRadius: '1rem'}}
            src={"https://media1.tenor.com/images/0dae54a91ebefe6dcd0dd2250ffb4aa7/tenor.gif?itemid=16026778"}
            alt={"Working Waifu"}/>
        </Paper>
      </div>
    </div>
  );
};

export default Todo;
