import React, { useState } from 'react';

import './LandingPage.css'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles(theme => ({
    chatOptionBox: {
      '& > *': {
        width: 400,
        margin: 10,
      },
    },
    ChatRoomButton: {
        width: 70,
        padding: '14.5px',
    },
    chip: {
        margin: theme.spacing(0.5),
    },
  }));

function LandingPage(props) {
    const classes = useStyles();
    const [interestsArr, setInterestsArr] = useState([]);
    const [keyCount, setKeyCount] = useState(0);

    const addInterests = (event) => {
        console.log(event.target.value)
        let value = event.target.value;
        if (!value) return;
        // let tag = value.trim().toLowerCase();
        // let tag = value;

        for(var i=0; interestsArr.length > i; i++){
            if(interestsArr[i].label === value ){
                return
            }
        }

        setKeyCount(keyCount + 1);
        interestsArr.push({key:keyCount, label:value})
        
        event.target.value = '';
    }

    const handleDelete = chipToDelete => () => {
        setInterestsArr(chips => chips.filter(chip => chip.key !== chipToDelete.key));
        setKeyCount(keyCount - 1);
    };

    let textInput = React.createRef();
    const handleClickAway = () => {
        console.log('textInput',textInput)
    };
  
    return (
        <div>
            <h1 className='LandingPageTitle'>Live Chat</h1>
            <div id='chatboxTag'>
                {interestsArr.map(data => {
                        return (
                        <Chip
                            key={data.key}
                            label={data.label}
                            onDelete={handleDelete(data)}
                            className={classes.chip}
                        />
                        );
                })}
            </div>
            <div id='chatOptionBox' className={classes.chatOptionBox} noValidate autoComplete="off">
                <ClickAwayListener onClickAway={handleClickAway}>
                <TextField 
                    
                    id="outlined-basic" 
                    label="Add your Interests (optional)" 
                    variant="outlined" 
                    onKeyPress={ event => event.key === 'Enter' ? addInterests(event) : null}
                />
                </ClickAwayListener>

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