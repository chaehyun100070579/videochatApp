const express = require('express')
const app = express()

// app.get('/', (req, res) => res.send('Hello World!~~ '))
// app.get('/api/hello', (req, res) => res.send('Hello World!~~'))


app.use(express.static(__dirname + '/build'))
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/build/index.html')
})

var io = require('socket.io')
(
    {
        path: '/webrtc'
    }
)

const port = 5000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))