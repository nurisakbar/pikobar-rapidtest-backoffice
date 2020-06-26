<template>
  <v-layout>
    <v-data-table
      :headers="headers"
      :items="records"
      :server-items-length="totalItems"
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
  { text: 'Tanggal Terdaftar', value: 'created_at' },
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
        itemsPerPage: 15,
        sortBy: ['name'],
        sortDesc: [false]
      },
      totalItems: 0
    }
  },

  watch: {
    options: {
      handler () {
        this.getRecords()
      },
      deep: true
    }
  },

  mounted () {
    if (this.$route.query.page) {
      this.options.page = parseInt(this.$route.query.page)
    }

    if (this.$route.query.per_page) {
      this.options.itemsPerPage = parseInt(this.$route.query.per_page)
    }

    if (this.$route.query.sort_by) {
      this.options.sortBy[0] = this.$route.query.sort_by
    }

    if (this.$route.query.sort_order) {
      this.options.sortDesc[0] = this.$route.query.sort_order === 'desc'
    }
  },

  methods: {
    async getRecords () {
      const query = {
        sort_by: this.options.sortBy[0],
        sort_order: this.options.sortDesc[0] === true ? 'desc' : 'asc',
        per_page: this.options.itemsPerPage,
        page: this.options.page
      }

      await this.$router.push({
        name: 'applicants-approved',
        query
      })

      const { data, meta } = await this.$axios.$get('/rdt/applicants/approved', { params: query })

      this.records = data
      this.totalItems = meta.total
    }
  },

  head () {
    return {
      title: 'Daftar Peserta'
    }
  }
}
</script>
