<template>
  <div style="width: 100%">
    <v-card>
      <v-card-title>
        {{ title }}
        <v-spacer />
        <v-text-field
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          @keyup.enter="doFilter"
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="records"
        :server-items-length="totalItems"
        :options.sync="options"
      >
        <template v-slot:item.age="{ item }">
          <v-layout justify-end>
            {{ item.age }}
          </v-layout>
        </template>
        <template v-slot:item.created_at="{ item }">
          <v-layout justify-end>
            {{ $dateFns.format(new Date(item.created_at), 'dd MMMM yyyy HH:mm') }}
          </v-layout>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
const headers = [
  { text: 'Nomor Pendaftaran', value: 'registration_code', sortable: false, width: 150 },
  { text: 'Nama Peserta', value: 'name' },
  { text: 'Jenis Kelamin', value: 'gender', width: 200 },
  { text: 'Usia (Thn)', value: 'age', width: 150 },
  { text: 'Kota/Kab', value: 'city.name', sortable: false, width: 200 },
  { text: 'Kecamatan', value: 'district.name', sortable: false, width: 200 },
  { text: 'Kelurahan', value: 'village.name', sortable: false, width: 250 },
  { text: 'Tanggal Terdaftar', value: 'created_at', width: 180 }
]

export default {
  props: {
    title: {
      type: String,
      default: 'Calon Peserta'
    },

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
      search: null,
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
    doFilter (e) {
      this.search = e.target.value
      this.getRecords()
    },

    async getRecords () {
      const query = {
        search: this.search,
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
