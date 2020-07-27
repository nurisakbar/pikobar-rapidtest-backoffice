<template>
  <div style="width: 100%;">
    <v-row>
      <v-col cols="12" class="d-flex align-center pb-0">
        <h3>Daftar Peserta</h3>
        <v-spacer></v-spacer>
        <v-btn color="primary" :to="`/events/${$route.params.eventId}/add`">
          <v-icon class="mr-1">mdi-plus-circle</v-icon>
          Tambah Peserta
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" to="/events/create">
          <v-icon class="mr-1">mdi-email-send</v-icon>
          Kirim Undangan
        </v-btn>
        <v-btn color="success" to="/events/create">
          <v-icon class="mr-1">mdi-email-send</v-icon>
          Kirim Hasil Test
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn outlined color="primary">
          CSV
        </v-btn>
        <v-btn outlined color="primary">
          PDF
        </v-btn>
        <v-btn color="success" to="/events/create">
          <v-icon class="mr-1">mdi-printer</v-icon>
          Print
        </v-btn>
      </v-col>
    </v-row>
    <v-card>
      <v-data-table
        v-model="pesertaSelected"
        :headers="headers"
        :items.sync="records"
        :loading="loading"
        show-select
        item-key="rdt_applicant_id"
      >
        <template v-slot:item.applicant.status="{ value }">
          <v-chip small class="ma-2" :color="value | getChipColor">
            {{ value }}
          </v-chip>
        </template>
        <template v-slot:item.applicant.gender="{ item }">
          <v-layout justify-start>
            <template v-if="item.applicant.gender === '1'">
              Laki-Laki
            </template>
            <template v-if="item.applicant.gender === '0'">
              Perempuan
            </template>
          </v-layout>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="$router.push(`events/${item.id}/edit`)">
            mdi-card-search
          </v-icon>
          <v-icon class="mr-2">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { getChipColor } from '@/utilities/formater'
const headers = [
  {
    text: 'Kode',
    value: 'applicant.registration_code',
    sortable: false,
    width: 150
  },
  { text: 'Nama Lengkap', value: 'applicant.name', width: 180 },
  { text: 'Kloter', value: 'rdt_event_schedule_id', width: 100 },
  { text: 'Jenis Kelamin', value: 'applicant.gender', width: 200 },
  { text: 'Usia', value: 'applicant.age', width: 100 },
  { text: 'Status', value: 'applicant.status', sortable: false, width: 150 },
  { text: 'Actions', value: 'actions', sortable: false, width: 100 }
]

export default {
  filters: {
    getChipColor
  },

  data() {
    return {
      headers,
      pesertaSelected: []
    }
  },

  computed: {
    records() {
      return this.$store.getters['eventParticipants/getList']
    },
    loading() {
      return this.$store.getters['eventParticipants/getLoading']
    },
    options: {
      set(value) {
        this.$store.commit('eventParticipants/SET_TABLE_OPTIONS', value)
      },
      get() {
        return this.$store.getters['eventParticipants/getTableOption']
      }
    },
    totalItems() {
      return this.$store.getters['eventParticipants/getTotalData']
    }
  },

  watch: {
    options(value) {
      this.$emit('optionChanged', value)
    }
  },

  mounted() {
    const options = { ...this.options }
    if (this.$route.query.page) {
      options.page = parseInt(this.$route.query.page)
    }
    if (this.$route.query.perPage) {
      options.itemsPerPage = parseInt(this.$route.query.perPage)
    }
    if (this.$route.query.sortBy) {
      options.sortBy = [this.$route.query.sortBy]
    }
    if (this.$route.query.sortOrder) {
      options.sortOrder = [this.$route.query.sortOrder]
    }
    this.options = options
  }
}
</script>
