import CardModel from '../models/Card'

export async function getCardByID (id) {
  return CardModel
    .query()
    .first()
    .select()
    .where({ ID: id })
}

export async function updateCard (id, updateClause) {
  const card = await getCardByID(id)
  if (card === null) throw new Error('Card not found.')
  await CardModel
    .query()
    .update(updateClause)
    .where({ ID: id })
  return card
}
