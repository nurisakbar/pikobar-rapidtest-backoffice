<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="records"
      :server-items-length="totalItems"
      class="elevation-1"
      :options.sync="options"
    />
  </div>
</template>

<script>
const headers = [
  { text: 'Nomor Pendaftaran', value: 'registration_code' },
  { text: 'Nama Peserta', value: 'name' },
  { text: 'Tanggal Terdaftar', value: 'created_at' },
  { text: 'Status', value: 'status' }
]

export default {
  props: {
    routerName: {
      type: String,
      default: 'applicants'
    },

    status: {
      type: String,
      default: 'new'
    },

    page: {
      type: Number,
      default: 1
    },

    perPage: {
      type: Number,
      default: 15
    },

    sortBy: {
      type: String,
      default: 'name'
    },

    sortOrder: {
      type: String,
      default: 'asc'
    }
  },

  data () {
    return {
      headers,
      records: [],
      options: {
        page: this.page,
        itemsPerPage: this.perPage,
        sortBy: [this.sortBy],
        sortDesc: [this.sortOrder === 'desc'],
        status: this.status
      },
      totalItems: 0
    }
  },

  watch: {
    page (value) {
      this.options.page = value
    },
    perPage (value) {
      this.options.itemsPerPage = value
    },
    sortBy (value) {
      this.options.sortBy = [value]
    },
    sortOrder (value) {
      this.options.sortDesc = [value === 'desc']
    },
    options: {
      handler () {
        this.getRecords()
      },
      deep: true
    }
  },

  methods: {
    async getRecords () {
      const query = {
        sort_by: this.options.sortBy[0],
        sort_order: this.options.sortDesc[0] === true ? 'desc' : 'asc',
        per_page: this.options.itemsPerPage,
        page: this.options.page,
        status: this.status
      }

      await this.$router.push({
        name: this.routerName,
        query
      })

      const { data, meta } = await this.$axios.$get('/rdt/applicants', { params: query })

      this.records = data
      this.totalItems = meta.total
    }
  }
}
</script>
