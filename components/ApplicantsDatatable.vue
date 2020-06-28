<template>
  <div style="width: 100%">
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-title>
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="filterSearch"
              label="Nama Peserta / Nomor Pendaftaran"
              clearable
              outlined
              @keyup.enter="doFilter"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field label="Kota/Kabupaten" outlined />
          </v-col>
          <v-col cols="3">
            <v-btn large color="primary" @click="doFilter">
              Search
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="records"
        :server-items-length="totalItems"
        :options.sync="options"
        :loading="loading"
      >
        <template v-slot:item.invitations="{ item }">
          <v-layout justify-start>
            {{ getLatestInvitation(item.invitations) }}
          </v-layout>
        </template>
        <template v-slot:item.gender="{ item }">
          <v-layout justify-start>
            <template v-if="item.gender === 'F'">
              Perempuan
            </template>
            <template v-if="item.gender === 'M'">
              Laki-Laki
            </template>
          </v-layout>
        </template>
        <template v-slot:item.symptoms_interaction="{ item }">
          <v-layout justify-center>
            <template v-if="item.symptoms_interaction === 0">
              Ya
            </template>
            <template v-if="item.symptoms_interaction === 1">
              Ya
            </template>
            <template v-if="item.symptoms_interaction === 2">
              Tidak Tahu
            </template>
          </v-layout>
        </template>
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
        <template v-slot:item.actions="{ item }">
          <v-icon
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <applicant-edit-dialog :open="dialog" :record-id="editRecordId" @close="close" @save="save" />
  </div>
</template>

<script>
import ApplicantEditDialog from '@/components/ApplicantEditDialog'

const headers = [
  { text: 'Nomor Pendaftaran', value: 'registration_code', sortable: false, width: 150 },
  { text: 'Nama Peserta', value: 'name', width: 250 },
  { text: 'Jenis Kelamin', value: 'gender', width: 150 },
  { text: 'Usia (Thn)', value: 'age', width: 120 },
  { text: 'Kota/Kab', value: 'city.name', sortable: false, width: 200 },
  { text: 'Kecamatan', value: 'district.name', sortable: false, width: 200 },
  { text: 'Kelurahan', value: 'village.name', sortable: false, width: 200 },
  { text: 'Riwayat Kontak', value: 'symptoms_interaction', width: 150 },
  { text: 'Gejala', value: 'symptoms_notes', sortable: false, width: 300 },
  { text: 'Riwayat Undangan', value: 'invitations', sortable: false, width: 300 },
  { text: 'Tanggal Terdaftar', value: 'created_at', width: 180 },
  { text: 'Actions', value: 'actions', sortable: false, width: 100 }
]

export default {
  components: {
    ApplicantEditDialog
  },

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
      dialog: false,
      headers,
      records: [],
      options: {
        page: this.page,
        itemsPerPage: this.perPage,
        sortBy: [this.sortBy],
        sortDesc: [this.sortOrder === 'desc'],
        status: this.status
      },
      loading: true,
      filterSearch: null,
      totalItems: 0,
      editRecordId: null
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
    doFilterReset () {
      this.filterSearch = null
      this.doFilter()
    },

    doFilter () {
      this.getRecords()
    },

    async getRecords () {
      this.loading = true

      const query = {
        search: this.filterSearch,
        sort_by: this.options.sortBy[0],
        sort_order: this.options.sortDesc[0] === true ? 'desc' : 'asc',
        per_page: this.options.itemsPerPage,
        page: this.options.page,
        status: this.status
      }

      try {
        const { data, meta } = await this.$axios.$get('/rdt/applicants', { params: query, progress: false })

        this.records = data
        this.totalItems = meta.total

        await this.$router.push({
          name: this.routerName,
          query
        })
      } catch (e) {
        //
      } finally {
        this.loading = false
      }
    },

    editItem (item) {
      this.editRecordId = item.id
      this.dialog = true
    },

    deleteItem (item) {
      //
    },

    close () {
      this.dialog = false
      this.editRecordId = null
    },

    save () {
      this.close()
      this.getRecords()
    },

    getLatestInvitation (invitations) {
      if (invitations.length > 0) {
        const [latestInvitation] = invitations.slice(-1)

        if (latestInvitation.event) {
          return latestInvitation.event.event_name
        }

        return 'Pernah'
      }

      return 'Belum Pernah'
    }
  }
}
</script>
