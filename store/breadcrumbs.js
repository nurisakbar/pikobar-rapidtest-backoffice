/* eslint-disable camelcase */

export const state = () => ({
  items: [
    {
      disabled: true,
      text: 'Home',
      to: '/'
    }
  ]
})

export const mutations = {
  SET_ITEMS(state, payload) {
    const s = state
    s.items = payload
  }
}

export const getters = {
  getItems(state) {
    const s = state
    return s.items
  }
}

export const actions = {
  setItems({ commit }, payload) {
    commit('SET_ITEMS', payload)
  }
}
