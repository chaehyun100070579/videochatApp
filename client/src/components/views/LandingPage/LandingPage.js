import React, { useEffect } from 'react';
// import axios from 'axios';
import io from 'socket.io-client'

function LandingPage(props) {
    const localVideoref = React.createRef();
    const remoteVideoref = React.createRef();
    // const pc_config = null;

    const pc_config = {
        'iceServer':[
            {
                urls : 'stun:stun.l.google.com:19302'
            }
        ]
    };

    var pc = new RTCPeerConnection(pc_config);
    var textref;
    const socket = io.connect('http://localhost:5000');
    // var candidates = [];

    const sendToPeer = (messageType, payload) => {
        socket.emit(messageType, {
            socketID: socket.id,
            payload
        })
    }

    const createOffer = () => {
        console.log('Offer');
        pc.createOffer({offerToReceiveVideo: 1})
            .then(sdp => {
                // console.log(JSON.stringify(sdp));
                pc.setLocalDescription(sdp);
                sendToPeer('offerOrAnswer', sdp)
            }, e => {});
    }

    const createAnswer = () => {
        console.log('Answer');
        pc.createAnswer({offerToReceiveVideo:1})
            .then(sdp => {
                // console.log(JSON.stringify(sdp));
                pc.setLocalDescription(sdp);
                sendToPeer('offerOrAnswer', sdp)
            }, e => {});
    }
   
    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => { 
        console.log('render finsehd')
        socket.on('connection-success', success => {
            console.log(success)
        })

        socket.on('offerOrAnswer', (sdp) => {
            textref.value = JSON.stringify(sdp)
            pc.setRemoteDescription(new RTCSessionDescription(sdp))
        })

        socket.on('candidate', (candidate) => {
            // candidates =  [...candidates , candidate]
            pc.addIceCandidate(new RTCIceCandidate(candidate))
        })
        
        pc.onicecandidate = (e) => {
            if(e.candidate){ 
                sendToPeer('candidate', e.candidate)
            }
        }
        pc.oniceconnectionstatechange = (e) => {
            console.log(e);
        }
    
        pc.onaddstream = (e) => {
            remoteVideoref.current.srcObject = e.stream;
        }

        const constraints = {video: true};
        const success = (stream) => {
            window.localStream = stream;
            localVideoref.current.srcObject = stream;
            pc.addStream(stream);
        }
        const failure = (e) => {
            console.log('getUserMedia Errror: ', e);
        }

        navigator.mediaDevices.getUserMedia(constraints)
        .then( success )
        .catch( failure );
    }); 



    // const setRemoteDescription = () => {
    //     const desc = JSON.parse(textref.value);
    //     pc.setRemoteDescription(new RTCSessionDescription(desc));
    // }



    // const addCandidate = () => {
    //     candidates.forEach(candidate => {
    //         console.log(JSON.stringify(candidate))
    //         pc.addIceCandidate(new RTCIceCandidate(candidate))
    //     })
    // }

    return (
        <div>
            <video
                style={{
                    width:240, height:240,
                    margin: 5, backgroundColor: 'black'
                }} 
                ref={localVideoref} 
                autoPlay>
            </video>
            <video
                style={{
                    width:240, height:240,
                    margin: 5, backgroundColor: 'black'
                }} 
                ref={remoteVideoref} 
                autoPlay>
            </video>

            <br />
            <button onClick={createOffer}>Offer</button>
            <button onClick={createAnswer}>Answer</button>
            <br />
            <textarea ref={ref => {textref = ref}} />
            {/* <br />
            <button onClick={setRemoteDescription}>Set Remote Desc</button>
            <button onClick={addCandidate}>Add Candidate</button> */}
        </div>
    );
}

export default LandingPage;