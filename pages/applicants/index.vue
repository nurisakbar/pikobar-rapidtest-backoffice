<template>
  <v-layout>
    <v-data-table
      :headers="headers"
      :items="records"
      :server-items-length="totalItems"
      class="elevation-1"
      style="width: 100%"
      :options.sync="options"
      @pagination="getRecords"
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

  data () {
    return {
      headers,
      records: [],
      options: {
        page: 1,
        itemsPerPage: 15
      },
      totalItems: 0
    }
  },

  mounted () {
    if (this.$route.query.page) {
      this.options.page = parseInt(this.$route.query.page)
    }

    if (this.$route.query.per_page) {
      this.options.itemsPerPage = parseInt(this.$route.query.per_page)
    }

    this.getRecords()
  },

  methods: {
    async getRecords () {
      const query = {
        per_page: this.options.itemsPerPage,
        page: this.options.page
      }

      await this.$router.push({
        name: 'applicants',
        query
      })

      const { data, meta } = await this.$axios.$get('/rdt/applicants', { params: query })

      this.records = data
      this.totalItems = meta.total
    }
  },

  head () {
    return {
      title: 'Kelola Peserta'
    }
  }
}
</script>
