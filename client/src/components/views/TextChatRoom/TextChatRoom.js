import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './TextChatRoom.css';

let socket;

function TextChatRoom({location}) {
    const [interestString, setInteretString] = useState('');
    const ENDPOINT = 'localhost:5000';

    useEffect(() =>{
        const {topic} = queryString.parse(location.search);
        const interests  = topic.split(',');
        setInteretString(topic)

        socket = io(ENDPOINT);
        socket.emit('join', {interests}, () =>{
           
        });

        return () => {
            socket.emit('disconnect')
            socket.off();
        }
    },[ENDPOINT, location.search])

    return (
        <div>
            <h4>you both like {interestString} </h4>
        </div>
    );
}

export default TextChatRoom;