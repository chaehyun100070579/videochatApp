import React, { useState } from 'react';

import './LandingPage.css'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    chatOptionBox: {
      '& > *': {
        width: 400,
        margin: 10
      },
    },
    ChatRoomButton: {
        width: 70,
        padding: '14.5px',
    },
  }));

function LandingPage(props) {
    const classes = useStyles();
    const [interestsArr, setInterestsArr] = useState([]);

    return (
        <div>
            <h1 className='LandingPageTitle'>Live Chat</h1>
            <div className={classes.chatOptionBox} noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Add your Interests (optional)" variant="outlined" />
                <Button className={classes.ChatRoomButton} variant="contained" color="primary" href="TextChatRoom">
                    Text
                </Button>
                <span style={{margin: '0'}}>or</span>
                <Button className={classes.ChatRoomButton} variant="contained" color="primary" href="VideoChatRoom">
                    Video
                </Button>
            </div>
        </div>
    );
}

export default LandingPage;