import Session from './models/Session'
import * as session from 'express-session'

export default class extends session.Store {
  constructor (knex) {
    super()
  }
  async all () {
    return Session
      .query()
  }
  async destroy (sid) {
    return Session
      .query()
      .where({ SessionID: sid })
      .delete()
  }
  get (sid, callback) {
    Session
    .query()
    .first()
    .where({ SessionID: sid })
    .then((foundSession) => {
      if (foundSession === undefined) {
        return callback()
      }
      let data = null
      try {
        data = JSON.parse(foundSession.SessionData)
      } catch (err) {
        return callback(err)
      }
      this.touch(sid, data, (err) => {
        callback(err, data)
      })
    })
    .catch((err) => {
      callback(err)
    })
  }
  async touch (sid, session, callback) {
    await Session
      .query()
      .update({ LastTouched: new Date() })
      .where({ SessionID: sid })
    callback()
  }
  async set (sid, sessionData, callback) {
    const existing = await Session
    .query()
    .first()
    .where({ SessionID: sid })
    if (existing === undefined) {
      await Session
      .query()
      .insert({ SessionID: sid, SessionData: JSON.stringify(sessionData) })
    } else {
      await Session
      .query()
      .update({ SessionData: JSON.stringify(sessionData) })
      .where({ ID: existing.ID })
    }
    callback()
  }
}
