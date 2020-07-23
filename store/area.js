/* eslint-disable camelcase */

export const state = () => ({
  loading: false,
  kabkot: [],
  kecamatan: [],
  desa: []
})

export const mutations = {
  SET_LOADING(state, payload) {
    const s = state
    s.loading = payload
  },
  SET_KABKOT(state, payload) {
    const s = state
    s.kabkot = payload
  },
  SET_KECAMATAN(state, payload) {
    const s = state
    s.kecamatan = payload
  },
  SET_DESA(state, payload) {
    const s = state
    s.desa = payload
  }
}

export const getters = {
  getLoading(state) {
    const s = state
    return s.loading
  },
  getKabkot(state) {
    const s = state
    return s.kabkot
  },
  getKecamatan(state) {
    const s = state
    return s.kecamatan
  },
  getDesa(state) {
    const s = state
    return s.desa
  }
}

export const actions = {
  async getKabkot({ commit }) {
    commit('SET_LOADING', true)
    try {
      const { data } = await this.$axios.$get('master/areas', {
        headers: {
          Authorization: null
        }
      })
      commit('SET_KABKOT', data)
    } catch (e) {
      // console.log(e)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async getKecamatan({ commit }, idKabkot) {
    commit('SET_LOADING', true)
    try {
      const { data } = await this.$axios.get(
        `/master/areas?parent_code_kemendagri=${idKabkot}`,
        {
          headers: {
            Authorization: null
          }
        }
      )
      commit('SET_KECAMATAN', data)
    } catch (e) {
      // console.log(e)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async getDesa({ commit }, idKecamatan) {
    commit('SET_LOADING', true)
    try {
      const { data } = await this.$axios.get(
        `/master/areas?parent_code_kemendagri=${idKecamatan}`,
        {
          headers: {
            Authorization: null
          }
        }
      )
      commit('SET_DESA', data)
    } catch (e) {
      //
    } finally {
      commit('SET_LOADING', false)
    }
  }
}
