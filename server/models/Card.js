import { Model } from 'objection'
import GameModel from './Game'

export default class CardModel extends Model {
  static get tableName () {
    return 'Card'
  }
  static get idColumn () {
    return 'ID'
  }
  static get relationMappings () {
    return {
      game: {
        relation: Model.BelongsToOneRelation,
        modelClass: GameModel,
        join: {
          from: 'Card.GameID',
          to: 'Game.ID'
        }
      }
    }
  }
}