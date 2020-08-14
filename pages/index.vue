<template>
  <v-flex>
    <v-card>
      <v-card-title>
        Selamat Datang di Dashboard Pendaftaran Tes Masif PIKOBAR
      </v-card-title>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  middleware: 'auth',

  components: {
    //
  },

  created() {
    this.$store.dispatch('breadcrumbs/setItems', [])
  },

  head() {
    return {
      title: 'Welcome'
    }
  }
}
</script>
