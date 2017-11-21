export function handle (io) {
  io.on('connection', socket => {
    socket.on('join', async msg => {
      socket.join(msg.token)
    })
  })
}
