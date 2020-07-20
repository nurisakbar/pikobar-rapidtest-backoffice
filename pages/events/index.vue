<template>
  <v-layout>
    <events-datatable
      title="Kegiatan"
      router-name="events"
      :allow="permissions"
      @optionChanged="onOptionChange"
    />
  </v-layout>
</template>

<script>
import { pickBy, identity, isEqual } from 'lodash'
import { mapGetters } from 'vuex'
import EventsDatatable from '@/components/EventsDatatable'

export default {
  middleware: 'auth',
  components: {
    EventsDatatable
  },

  computed: {
    ...mapGetters('auth', ['permissions'])
  },

  watch: {
    '$route.query': {
      handler(value) {
        this.$store.dispatch('events/getList')
      },
      deep: true
    }
  },

  methods: {
    onOptionChange(value) {
      let query = { ...this.$route.query }
      if (value.page) query.page = value.page
      query.perPage = value.itemsPerPage || null
      query.sortBy = value.sortBy.length > 0 ? value.sortBy[0] : null
      query.sortOrder = value.sortDesc[0] ? 'desc' : 'asc'
      query = pickBy(query, identity)
      if (!isEqual(query, this.$route.query)) {
        this.$router
          .replace({
            name: this.$router.name,
            query
          })
          .catch(() => {})
      }
    }
  },

  head() {
    return {
      title: 'Kegiatan'
    }
  }
}
</script>
