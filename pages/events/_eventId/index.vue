<template>
  <EventView :data="getCurrent" />
</template>

<script>
import { mapGetters } from 'vuex'
import EventView from '@/components/EventView'

export default {
  middleware: 'auth',
  components: {
    EventView
  },
  computed: {
    ...mapGetters('events', ['getCurrent'])
  },
  mounted() {
    if (this.$route.params.eventId) {
      this.$store.dispatch('events/getCurrent', this.$route.params.eventId)
    } else {
      this.$router.replace('/events')
    }
  }
}
</script>
