import Session from './models/Session'

export default class {
  constructor (knex) {
    console.log(this)
  }
  async all () {
    return Session
      .query()
  }
  async destroy (sid) {
    return Session
      .query()
      .where({ ID: sid })
      .delete()
  }
  async get (sid) {
    return Session
      .query()
      .findById(sid)
  }
  async set (sid, session) {
    return Session
      .query()
      .update({ Session: session })
      .where({ ID: sid })
  }
}
