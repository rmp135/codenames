import CardModel from '../models/Card'

export async function GetCardByIDAndToken (id, token) {
  return await CardModel
  .query()
  .joinRelation('game')
  .first()
  .select()
  .where({ 'Card.ID': id, 'Game.JoinToken': token })
}

export async function UpdateCard (id, token, updateClause) {
  const card = await GetCardByIDAndToken(id, token)
  if (card === null) throw new Error('Card not found.')
  await CardModel
  .query()
  .update(updateClause)
  .where({ ID: id })
  return card
}
