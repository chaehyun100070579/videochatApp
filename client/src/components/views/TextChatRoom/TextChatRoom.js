import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar';
import Messages from '../Messages/Messages';
import ScrollToBottom from 'react-scroll-to-bottom';

import './TextChatRoom.css';

let socket;

function TextChatRoom({location}) {
    const [interestString, setInteretString] = useState('');
    const ENDPOINT = 'localhost:5000';
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    var [stopButtonText, setStopButtonText] = useState('Stop');

    useEffect(() =>{
        const {interests} = queryString.parse(location.search);
        setInteretString(interests)

        socket = io(ENDPOINT);

        socket.emit('join', {interests}, () =>{
        });
        
        socket.on('message', message => {
            setMessages(messages => [ ...messages, message ]);
        });

        return () => {
            socket.emit('disconnect')
            socket.off();
        }
    },[ENDPOINT, location.search]);

    // useEffect(() => {
    //     socket.on('message', message => {
    //       setMessages(messages => [ ...messages, message ]);
    //     });
    // }, []);
    
    const sendMessage = (event) => {
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    } 

    useEffect(() => {
        document.addEventListener("keydown", backToHome, false);

        return () => {
            document.removeEventListener("keydown", backToHome, false);
        };
    });
    
    const backToHome = (event) => {
        if(stopButtonText === 'Really'){
            setStopButtonText(stopButtonText='New')
            return;
        }
        if(event.keyCode === 27) {
            console.log(event.keyCode);
            setStopButtonText(stopButtonText='Really')
        }
    } 

    console.log(message, messages);

    return (
        <div className="outerContainer" >
            <div className="container">
                <div className ="logWrapper">
                    <InfoBar/>
                    <span>You're now chatting with a random stranger</span> 
                    {interestString && <span className="interestTitle">you both like {interestString} </span>}
                    <ScrollToBottom className="messageLog">
                            <Messages messages={messages} name='stranger' />
                    </ScrollToBottom>
                </div>
                <div className="messageWrapper">
                            <a href="/">
                                <button className="stopButton" id={stopButtonText}>
                                    {stopButtonText}
                                    <span className="btnshortcut">Esc</span>
                                </button>
                            </a>
                    <textarea 
                        className="messageTextArea"
                        placeholder="Type a message..."
                        value={message} 
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyPress={event => event.key ==='Enter' ? sendMessage(event) : null} 
                    />
                    <button className="sendButton" onClick={ (event) => sendMessage(event)}>
                        SEND
                        <span className="btnshortcut">Enter</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TextChatRoom;