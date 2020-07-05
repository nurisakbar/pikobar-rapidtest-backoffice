export default ({ store }, inject) => {
  inject('alert', {
    show({ title, message, ok }) {
      store.commit('alert/show', { title, message, ok })
    }
  })
}
