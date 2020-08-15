import Cookies from 'js-cookie'

// state
export const state = () => ({
  user: null,
  token: null,
  role: null,
  permissions: []
})

// getters
export const getters = {
  user: (state) => state.user,
  token: (state) => state.token,
  role: (state) => state.role,
  permissions: (state) => state.permissions,
  check: (state) => state.user !== null
}

// mutations
export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },

  UPDATE_USER(state, { profile, role, permissions }) {
    state.user = profile
    state.role = role
    state.permissions = permissions
  },

  LOGOUT(state) {
    state.user = null
    state.token = null
    state.role = null
    state.permissions = []
  }
}

// actions
export const actions = {
  updateUser({ commit }, payload) {
    commit('UPDATE_USER', payload)
  },

  updateUserSSO({ commit }, { profile, role, permissions }) {
    commit('UPDATE_USER', { profile, role, permissions })
  },

  saveToken({ commit, dispatch }, { token }) {
    commit('SET_TOKEN', token)

    Cookies.set('token', token)
  },

  clearToken({ commit }) {
    Cookies.remove('token')
  },

  async logout({ commit }) {
    await this.$keycloak.logout()

    Cookies.remove('token')

    commit('LOGOUT')
  }
}
