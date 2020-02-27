const express = require('express')
const app = express()
const port = 5000;
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use(express.static(__dirname + '../client/build'))
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '../client/build/index.html')
})

app.io = require('socket.io')();
app.io.attach(server);
let connectedPeers = new Map()

app.io.on('connection', function(socket) {
    console.log('a user connected');
    console.log(socket.id)
    socket.emit('connection-success', {success: socket.id})
    connectedPeers.set(socket.id, socket)
    
    socket.on('disconnect', () =>{
        console.log('dced')
        connectedPeers.delete(socket.id)
    })

    socket.on('offerOrAnswer', (data) =>{
        for(const [socketID, socket] of connectedPeers.entries()){
            if(socketID !== data.socketID){
                console.log(socketID, data.payload.type)
                socket.emit('offerOrAnswer', data.payload)
            }

        }
    })

    socket.on('candidate', (data) =>{
        for(const [socketID, socket] of connectedPeers.entries()){
            if(socketID !== data.socketID){
                console.log(socketID, data.payload.type)
                socket.emit('candidate', data.payload)
            }
        }
    })

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

