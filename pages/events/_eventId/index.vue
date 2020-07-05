<template>
  <EventView :data="getCurrent" @onEdit="doEdit" />
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
      this.$router.go(-1)
    }
  },
  methods: {
    async doEdit(payload) {
      try {
        await this.$store.dispatch('events/edit', payload)
        this.$toast.show({
          message: 'Kegiatan berhasil di perbaharui',
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
