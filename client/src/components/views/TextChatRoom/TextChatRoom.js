import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar';

import './TextChatRoom.css';

let socket;

function TextChatRoom({location}) {
    const [interestString, setInteretString] = useState('');
    const ENDPOINT = 'localhost:5000';
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() =>{
        const {interests} = queryString.parse(location.search);
        setInteretString(interests)

        socket = io(ENDPOINT);
      
        socket.emit('join', {interests}, () =>{
           
        });

        return () => {
            socket.emit('disconnect')
            socket.off();
        }
    },[ENDPOINT, location.search]);

    useEffect(() =>{
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })

    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        console.log(event)
        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    } 
    console.log(message, messages);

    return (
        <div className="outerContainer">
            <div className="container">
                <div className ="logWrapper">
                    <InfoBar/>
                    <span>You're now chatting with a random stranger</span> 
                    <span className="interestTitle">you both like {interestString} </span>
                </div>
                
                <div className="messageWrapper">
                    <textarea 
                        className="messageTextArea"
                        value={message} 
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyPress={event => event.key ==='Enter' ? sendMessage(event) : null} 
                    />
                </div>
            </div>
        </div>
    );
}

export default TextChatRoom;