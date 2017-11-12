import { Model } from 'objection'
import CardModel from './Card'

export default class GameModel extends Model {
  static get tableName() {
    return 'Game'
  }
  static get idColumn() {
    return 'ID'
  }
  static get relationMappings() {
    return {
      cards: {
        relation: Model.HasManyRelation,
        modelClass: CardModel,
        join: {
          from: 'Game.ID',
          to: 'Card.GameID'
        }
      }
    }
  }
}