const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
const port = 8081

require('./routes')(app)

app.get('/', (_req, res) => {
    res.send("Cryptocalc Backend Service")
});

app.listen(port, () => {
    console.log(`Cryptocalc backend listening on port ${port}`)
});