import 'dotenv/config'

const express = require('express')
const app = express()
const port = 3000


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
