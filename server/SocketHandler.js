import * as CardRepository from './helpers/CardRepository';
import * as GameRepository from './helpers/GameRepository';

export function handle (io) {
  io.on('connection', socket => {
    socket.on('select', async msg => {
      await CardRepository.UpdateCard(msg.id, msg.token, { Chosen: true })
      io.emit('select', msg)
    })
    socket.on('reveal', async msg => {
      if (!(await GameRepository.IsSpy(msg.token, msg.password))) return
      const card = await CardRepository.UpdateCard(msg.id, msg.token, { Revealed: true, Chosen: false })
      console.log(card)
      io.emit('reveal', { id: card.ID, team: card.Team, token: msg.token })
    })
    socket.on('disconnect', () => {
      console.log('disconnected')
    })
    console.log('connected')
  })
}
