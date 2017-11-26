export const state = () => ({
  authtest: ''
})

export const mutations = {
  SET_AUTH (state, user) {
    state.authtest = user
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    // console.log('nuxtServerInit')
    // console.log(req.session)
    if (req.session) {
      commit('SET_AUTH', req.session.authUser)
    }
  }
}
