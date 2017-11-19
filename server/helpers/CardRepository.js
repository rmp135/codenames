import CardModel from '../models/Card'

export async function getCardByIDAndToken (id, token) {
  return await CardModel
  .query()
  .joinRelation('game')
  .first()
  .select()
  .where({ 'Card.ID': id, 'Game.JoinToken': token })
}

export async function updateCard (id, token, updateClause) {
  const card = await getCardByIDAndToken(id, token)
  if (card === null) throw new Error('Card not found.')
  await CardModel
  .query()
  .update(updateClause)
  .where({ ID: id })
  return card
}
