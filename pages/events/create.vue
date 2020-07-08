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
        await this.$store.dispatch('events/create', payload)
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
