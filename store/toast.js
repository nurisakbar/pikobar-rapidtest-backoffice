export const state = () => ({
  show: false,
  message: '',
  type: ''
})

export const mutations = {
  show(state, payload) {
    const s = state
    s.type = payload.type
    s.message = payload.message
    s.show = true
  }
}
