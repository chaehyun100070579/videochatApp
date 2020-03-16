import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

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
            <h4>you both like {interestString} </h4>
            <div className="container">
                <input 
                    value={message} 
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={event => event.key ==='Enter' ? sendMessage(event) : null} 
                 />
            </div>
        </div>
    );
}

export default TextChatRoom;