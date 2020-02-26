const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!~~ '))
app.get('/api/hello', (req, res) => res.send('Hello World!~~'))

const port = 5000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))