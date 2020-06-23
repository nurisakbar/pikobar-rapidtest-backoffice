import Cookies from 'js-cookie'

// state
export const state = () => ({
  user: null,
  token: null,
  roles: [],
  permissions: []
})

// getters
export const getters = {
  user: state => state.user,
  token: state => state.token,
  check: state => state.user !== null
}

// mutations
export const mutations = {
  SET_TOKEN (state, token) {
    state.token = token
  },

  UPDATE_USER (state, { profile, roles, permissions }) {
    state.user = profile
    state.roles = roles
    state.permissions = permissions
  },

  LOGOUT (state) {
    state.user = null
    state.token = null
    state.roles = []
    state.permissions = []
  }
}

// actions
export const actions = {
  updateUser ({ commit }, payload) {
    commit('UPDATE_USER', payload)
  },

  updateUserSSO ({ commit }, { profile, roles, permissions }) {
    commit('UPDATE_USER', { profile, roles, permissions })
  },

  saveToken ({ commit, dispatch }, { token }) {
    commit('SET_TOKEN', token)

    Cookies.set('token', token)
  },

  clearToken ({ commit }) {
    Cookies.remove('token')
  },

  async logout ({ commit }) {
    await this.$keycloak.logout()

    Cookies.remove('token')

    commit('LOGOUT')
  }
}
