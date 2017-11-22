import * as axios from 'axios'

let options = {}
// The server-side needs a full url to works
if (process.server) {
  console.log('server')
  options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`
}

if (process.client) {
  console.log('client')
  // debugger // eslint-disable-line
}

export default axios.create(options)
