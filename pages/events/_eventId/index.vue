<template>
  <v-flex>
    <EventView :data="getCurrent" />
    <ApplicantDatatable v-if="getCurrent" :id-event="getCurrent.id" />
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'
// import { pickBy, identity, isEqual } from 'lodash'
import EventView from '@/components/EventView'
import ApplicantDatatable from '@/components/EventsApplicantsClient'

export default {
  middleware: 'auth',

  components: {
    EventView,
    ApplicantDatatable
  },
  computed: {
    ...mapGetters('events', ['getCurrent', 'getLoading']),
    options: {
      set(value) {
        this.$store.commit('eventParticipants/SET_TABLE_OPTIONS', value)
      },
      get() {
        return this.$store.getters['eventParticipants/getTableOption']
      }
    }
  },

  created() {
    this.$store.dispatch('breadcrumbs/setItems', [
      {
        disabled: false,
        text: 'Kegiatan',
        to: '/events'
      },
      {
        disabled: true,
        text: 'Detail Kegiatan'
      }
    ])
  },

  mounted() {
    if (this.$route.params.eventId) {
      this.$store.dispatch('events/resetOptions')
      this.$store.dispatch('events/getCurrent', this.$route.params.eventId)
      const opt = { ...this.options }
      opt.itemsPerPage = 5000
      this.options = opt
      this.$store.dispatch(
        'eventParticipants/getList',
        this.$route.params.eventId
      )
    } else {
      this.$router.replace('events')
    }
  },

  methods: {
    // onOptionChange(value) {
    //   let query = { ...this.$route.query }
    //   if (value.page) query.page = value.page
    //   query.perPage = value.itemsPerPage || null
    //   query.sortBy = value.sortBy.length > 0 ? value.sortBy[0] : null
    //   query.sortOrder = value.sortDesc && value.sortDesc[0] ? 'desc' : 'asc'
    //   query = pickBy(query, identity)
    //   if (!isEqual(query, this.$route.query)) {
    //     this.$router
    //       .replace({
    //         name: this.$router.name,
    //         query
    //       })
    //       .catch(() => {})
    //   }
    // }
  }
}
</script>
