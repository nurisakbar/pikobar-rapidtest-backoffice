<template>
  <EventForm @onStore="doStore" />
</template>

<script>
import EventForm from '@/components/EventForm'

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
          message: 'Kegiatan berhasil di daftarkan',
          type: 'success'
        })
      } catch (error) {
        this.$toast.show({ message: error, type: 'error' })
      }
    }
  }
}
</script>
