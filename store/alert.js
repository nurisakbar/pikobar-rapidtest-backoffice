export const state = () => ({
  show: false,
  title: '',
  message: '',
  ok: () => {}
})

export const mutations = {
  show(state, payload) {
    const s = state
    s.title = payload.title
    s.message = payload.message
    s.ok = payload.ok
    s.show = true
  }
}
