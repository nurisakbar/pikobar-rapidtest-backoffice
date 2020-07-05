export default ({ store }, inject) => {
  inject('toast', {
    show({ message, type }) {
      store.commit('toast/show', { message, type })
    }
  })
}
