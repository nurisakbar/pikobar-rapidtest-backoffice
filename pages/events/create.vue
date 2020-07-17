<template>
  <EventForm @onStore="doStore" />
</template>

<script>
import EventForm from '@/components/EventForm'
import { EVENT_SUCCESS_CREATE } from '@/utilities/constant'

export default {
  middleware: 'auth',
  components: {
    EventForm
  },
  methods: {
    async doStore(payload) {
      try {
        const { data } = await this.$store.dispatch('events/create', payload)
        setTimeout(() => {
          this.$router.push(`/events/${data.id}`)
        })
        this.$toast.show({
          message: EVENT_SUCCESS_CREATE,
          type: 'success'
        })
      } catch (error) {
        this.$toast.show({ message: error, type: 'error' })
      }
    }
  }
}
</script>
