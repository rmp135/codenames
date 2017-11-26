import { Model } from 'objection'

export default class GameModel extends Model {
  static get tableName () {
    return 'Session'
  }
  static get idColumn () {
    return 'ID'
  }
}
