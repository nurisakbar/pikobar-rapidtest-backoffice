/* eslint-disable camelcase */

import { mapKeys, camelCase, snakeCase } from 'lodash'
import { DEFAULT_FILTER, DEFAULT_PAGINATION } from '@/utilities/constant'

export const state = () => ({
  loading: false,
  loadingImport: false,
  data: [],
  dataParticipants: [],
  current: null,
  pagination: { ...DEFAULT_PAGINATION },
  filter: { ...DEFAULT_FILTER }
})

export const mutations = {
  SET_LOADING(state, payload) {
    const s = state
    s.loading = payload
  },
  SET_DATA(state, payload) {
    const s = state
    s.data = payload
  },
  SET_CURRENT(state, payload) {
    const s = state
    s.current = payload
  },
  SET_PAGINATION(state, payload) {
    const s = state
    s.pagination = payload
  },
  RESET_PAGINATION(state) {
    const s = state
    s.pagination = DEFAULT_PAGINATION
  },
  SET_FILTER(state, payload) {
    const s = state
    s.filter = payload
  },
  RESET_FILTER(state) {
    const s = state
    s.filter = DEFAULT_FILTER
  },
  SET_TABLE_OPTIONS(state, payload) {
    const s = state
    s.filter = {
      groupBy: payload.groupBy,
      groupDesc: payload.groupDesc,
      multiSort: payload.multiSort,
      mustSort: payload.mustSort,
      sortBy: payload.sortBy,
      sortDesc: payload.sortDesc,
      sortOrder: payload.sortOrder,
      status: payload.status
    }
    s.pagination = {
      itemsPerPage: payload.itemsPerPage - 0,
      page: payload.page,
      perPage: payload.perPage,
      total: payload.total
    }
  },
  SET_LOADING_IMPORT(state, payload) {
    const s = state
    s.loadingImport = payload
  }
}

export const getters = {
  getLoading(state) {
    const s = state
    return s.loading
  },
  getList(state) {
    const s = state
    return s.data
  },
  getCurrent(state) {
    const s = state
    return s.current
  },
  getPagination(state) {
    const s = state
    return s.pagination
  },
  getFilter(state) {
    const s = state
    return s.filter
  },
  getTableOption(state) {
    const s = state
    return { ...s.filter, ...s.pagination }
  },
  getTotalData(state) {
    const s = state
    return s.pagination.total
  },
  getLoadingImport() {
    const s = state
    return s.loadingImport
  }
}

export const actions = {
  async getListParticipants({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const { pagination, filter } = state
      const { page, itemsPerPage } = pagination
      const { search, sortBy, sortOrder, status } = filter
      const query = mapKeys(
        {
          page,
          perPage: itemsPerPage,
          search,
          sortBy: sortBy[0] || null,
          sortOrder: sortOrder[0] ? 'desc' : 'asc',
          status
        },
        (value, key) => snakeCase(key)
      )
      const { data, meta } = await this.$axios.$get(
        `/rdt/events/${id}/participants`,
        {
          query,
          progress: false
        }
      )
      commit('SET_DATA_PARTICIPANTS', data)
      const tablePagination = mapKeys(
        {
          itemsPerPage: parseInt(meta.per_page),
          ...meta
        },
        (value, key) => camelCase(key)
      )
      commit('SET_PAGINATION', {
        page: tablePagination.currentPage,
        ...tablePagination
      })
    } catch (e) {
      //
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async getList({ commit, state }, eventId) {
    commit('SET_LOADING', true)

    try {
      const { pagination, filter } = state
      const { page, itemsPerPage } = pagination
      const { search, sortBy, sortOrder, status } = filter
      console.log(itemsPerPage)
      const query = mapKeys(
        {
          page,
          perPage: itemsPerPage,
          search,
          sortBy: sortBy[0] || null,
          sortOrder: sortOrder[0] ? 'desc' : 'asc',
          status
        },
        (value, key) => snakeCase(key)
      )
      const { data, meta } = await this.$axios.$get(
        `/rdt/events/${eventId}/participants`,
        {
          params: query,
          progress: false
        }
      )
      const tablePagination = mapKeys(
        {
          itemsPerPage: parseInt(meta.per_page),
          ...meta
        },
        (value, key) => camelCase(key)
      )
      commit('SET_DATA', data)
      commit('SET_PAGINATION', {
        page: tablePagination.currentPage,
        ...tablePagination
      })
    } catch (e) {
      //
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async getCurrent({ commit, state }, idEvent) {
    commit('SET_LOADING', true)

    try {
      const { data } = await this.$axios.$get(`/rdt/events/${idEvent}`)
      commit('SET_CURRENT', data)
    } catch (e) {
      //
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async importPeserta({ commit }, { idEvent, formData }) {
    commit('SET_LOADING_IMPORT', true)

    try {
      await this.$axios.$post(
        `/rdt/events/${idEvent}/participants-import`,
        formData
      )
    } catch (e) {
      throw new Error(e.response.data.errors.file[0])
    } finally {
      commit('SET_LOADING_IMPORT', false)
    }
  }
  // async edit({ commit, state }, payload) {
  //   commit('SET_LOADING', true)
  //   try {
  //     await this.$axios.$put(`/rdt/events/${state.current.id}`, payload)
  //   } catch (error) {
  //     throw new Error(error)
  //   } finally {
  //     commit('SET_LOADING', false)
  //   }
  // }
}
