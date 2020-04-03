const express = require('express')
const app = express()
const port = 5000;
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');


app.use(express.static(__dirname + '../client/build'))
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '../client/build/index.html')
})

app.io = require('socket.io')();
app.io.attach(server);

let connectedPeers = new Map()

app.io.on('connection', function(socket) {

    socket.emit('connection-success', {success: socket.id});
    connectedPeers.set(socket.id, socket);

    socket.on('offerOrAnswer', (data) =>{
        for(const [socketID, socket] of connectedPeers.entries()){
            if(socketID !== data.socketID){
                console.log(socketID, data.payload.type)
                socket.emit('offerOrAnswer', data.payload)
            }

        }
    });

    socket.on('candidate', (data) =>{
        for(const [socketID, socket] of connectedPeers.entries()){
            if(socketID !== data.socketID){
                console.log(socketID, data.payload.type)
                socket.emit('candidate', data.payload)
            }
        }
    });

    socket.on('join', ({interests}, callback)=>{
        const { error, user } = addUser({id:socket.id, interests});

        if(error) return callback(error);

        socket.emit('message', {user: 'admin', text:`${user.id}, welcome to the room ${user.interests}`});
        socket.broadcast.to(user.interests).emit('message', {user:'admin', text:`${user.id}, has joined`});

        socket.join(user.interests);

        app.io.to(user.interests).emit('roomData', {interests: user.interests, users: getUsersInRoom(user.interests)})

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        console.log('socket.id', socket.id)
        const user = getUser(socket.id);
        console.log('userrrrrrrrrrr',user)
        app.io.to(user.interests).emit('message', { user: user.id, text: message});
        app.io.to(user.interests).emit('roomData', { user: user.id, text: message});
     
        callback();
    });

    socket.on('disconnect', () =>{
        // connectedPeers.delete(socket.id)
        const user = removeUser(socket.id);
        if(user) {
            app.io.to(user.interests).emit('message', { user: 'Admin', text: `stranger has left.` });
            app.io.to(user.interests).emit('roomData', { room: user.interests, users: getUsersInRoom(user.interests)});
        }
    });

    // socket.on('disconnect', () => {
       
    // });




})

// var io = require('socket.io')
// (
//     {
//         path: '/webrtc'
//     }
// )
// io.listen(server)
// const peers = io.of('/webrtcPeer')

//keep a reference of all socket connections


// peers.on('connection', socket => {
//     console.log(socket)
//     socket.emit('connection-success', {success: socket.id})

//     connectedPeers.set(socket.id, socket)

//     socket.on('disconnect', () =>{
//         console.log('dced')
//         connectedPeers.delete(socket.id)
//     })

// })

