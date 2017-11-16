import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import * as socket from 'socket.io'
import * as http from 'http'
import * as bodyparser from 'body-parser'
import './helpers/DBHelper'

import api from './api'

const app = express()
const server = http.createServer(app)
const io = socket(server)
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

// app.set('port', port)

// Import API Routes
app.use(bodyparser.json())
app.use('/api', api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('disconnected')
  })
  console.log('connected')
})

// Listen the server
server.listen(port, host, () => {
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
})
