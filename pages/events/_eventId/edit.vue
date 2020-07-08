<template>
  <EventForm :form-data="getCurrent" type="edit" @onStore="doStore" />
</template>

<script>
import { mapGetters } from 'vuex'
import { EVENT_SUCCESS_UPDATE } from '@/utilities/constant'
import EventForm from '@/components/EventForm'

export default {
  middleware: 'auth',
  components: {
    EventForm
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
  },
  methods: {
    async doStore(payload) {
      try {
        await this.$store.dispatch('events/edit', payload)
        this.$toast.show({
          message: EVENT_SUCCESS_UPDATE,
          type: 'success'
        })
        setTimeout(() => {
          this.$router.push('/events')
        }, 2000)
      } catch (error) {
        this.$toast.show({ message: error.message, type: 'error' })
      }
    }
  }
}
</script>
