<template>
  <v-layout>
    <v-data-table
      :headers="headers"
      :items="records"
      :server-items-length="totalItems"
      :loading="$fetchState.pending"
      class="elevation-1"
      style="width: 100%"
      :options.sync="options"
    />
  </v-layout>
</template>

<script>
const headers = [
  { text: 'Nomor Pendaftaran', value: 'registration_code' },
  { text: 'Nama Peserta', value: 'name' },
  { text: 'Status', value: 'status' }
]

export default {
  middleware: 'auth',

  async fetch () {
    const query = {
      per_page: this.options.itemsPerPage,
      page: this.options.page
    }

    const { data, meta } = await this.$axios.$get('/rdt/applicants', { params: query })

    this.records = data
    this.totalItems = meta.total
  },

  data () {
    return {
      headers,
      records: [],
      options: {},
      totalItems: 0
    }
  },

  watch: {
    options: {
      handler () {
        this.$fetch()
      },
      deep: true
    }
  },

  head () {
    return {
      title: 'Kelola Peserta'
    }
  }
}
</script>
