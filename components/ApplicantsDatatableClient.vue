<template>
  <div style="width: 100%;">
    <v-card>
      <v-card-title v-if="!noHead">
        <v-row>
          <v-col cols="12" class="pt-0">
            {{ title }}
          </v-col>
          <v-col cols="5" class="py-0">
            <v-text-field
              v-model="filterSearch"
              label="Nama Peserta / Nomor Pendaftaran"
              clearable
              outlined
              dense
              hide-details
              @keyup.enter="doFilter"
            />
          </v-col>
          <v-col cols="3" class="py-0">
            <pkbr-select
              v-model="filterCity"
              :items="getKabkot"
              label="Kab./Kota"
              name="Kab./Kota"
              placeholder="Semua Kab./Kota"
              item-text="name"
              item-value="code"
              hide-details
              allow-null
            />
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        v-model="tempValue"
        :headers="headers"
        :items="records"
        :loading="loading"
        :show-select="showSelect"
        :custom-filter="doFilter"
        :search="filterData"
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
        <template v-slot:item.person_status="{ item }">
          <v-layout justify-start>
            {{ getPersonStatusText(item.person_status) }}
          </v-layout>
        </template>
        <template v-slot:item.age="{ item }">
          <v-layout justify-end>
            {{ item.age }}
          </v-layout>
        </template>
        <template v-slot:item.created_at="{ item }">
          <v-layout>
            {{
              $dateFns.format(new Date(item.created_at), 'dd MMMM yyyy HH:mm')
            }}
          </v-layout>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon v-if="allowView" class="mr-2" @click="viewItem(item)">
            mdi-card-search
          </v-icon>
          <v-icon v-if="allowEdit" class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon v-if="allowDelete" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <applicant-view-dialog
      v-if="allowView"
      :open="viewDialog"
      :record-id="viewRecordId"
      @close="viewClose"
    />
    <applicant-edit-dialog
      v-if="allowEdit"
      :open="editDialog"
      :record-id="editRecordId"
      @close="editClose"
      @save="editSave"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApplicantEditDialog from '@/components/ApplicantEditDialog'
import ApplicantViewDialog from '@/components/ApplicantViewDialog'

const headers = [
  {
    text: 'Nomor Pendaftaran',
    value: 'registration_code',
    sortable: false,
    width: 150
  },
  { text: 'Nama Peserta', value: 'name', width: 250 },
  { text: 'Status Kesehatan', value: 'person_status', width: 150 },
  { text: 'Jenis Kelamin', value: 'gender', width: 150 },
  { text: 'Usia (Thn)', value: 'age', width: 120, align: 'end' },
  { text: 'Kota/Kab', value: 'city.name', sortable: false, width: 200 },
  { text: 'Kecamatan', value: 'district.name', sortable: false, width: 200 },
  { text: 'Kelurahan', value: 'village.name', sortable: false, width: 200 },
  {
    text: 'Riwayat Kontak',
    value: 'symptoms_interaction',
    width: 150,
    align: 'center'
  },
  { text: 'Gejala', value: 'symptoms_notes', sortable: false, width: 300 },
  {
    text: 'Riwayat Undangan',
    value: 'invitations',
    sortable: false,
    width: 200
  },
  { text: 'Tanggal Terdaftar', value: 'created_at', width: 180 },
  { text: 'Actions', value: 'actions', sortable: false, width: 150 }
]
export default {
  components: {
    ApplicantViewDialog,
    ApplicantEditDialog
  },

  props: {
    value: {
      type: Array,
      default: () => []
    },

    title: {
      type: String,
      default: 'Calon Peserta'
    },

    allowView: {
      type: Boolean,
      default: false
    },

    allowCreate: {
      type: Boolean,
      default: false
    },

    allowEdit: {
      type: Boolean,
      default: false
    },

    allowDelete: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      default: 'new'
    },

    noHead: {
      type: Boolean,
      default: false
    },

    noActions: {
      type: Boolean,
      default: false
    },

    showSelect: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tempValue: this.value,
      editDialog: false,
      editRecordId: null,
      viewDialog: false,
      viewRecordId: null,
      headers: !this.noActions
        ? headers.filter((head) => head.value !== 'actions')
        : headers,
      records: [],
      loading: true,
      filterSearch: null,
      filterCity: null
    }
  },

  computed: {
    ...mapGetters('area', ['getKabkot']),
    filterData() {
      return `${this.filterSearch || ''}-${this.filterCity || ''}`
    }
  },

  watch: {
    value(value) {
      this.tempValue = value
    },
    tempValue(value) {
      this.$emit('input', value)
    }
  },

  mounted() {
    this.getRecords()
  },

  methods: {
    doFilterReset() {
      this.filterSearch = null
    },

    doFilter(value, search, item) {
      return (
        !!value &&
        !!search &&
        (this.filterCity ? this.filterCity === item.city.code : true) &&
        (this.filterSearch
          ? value.toString().includes(this.filterSearch)
          : true)
      )
    },

    async getRecords() {
      this.loading = true
      const query = {
        per_page: 5000,
        status: this.status
      }
      try {
        const { data, meta } = await this.$axios.$get('/rdt/applicants', {
          params: query,
          progress: false
        })
        this.records = data
        this.totalItems = meta.total
      } catch (e) {
        //
      } finally {
        this.loading = false
      }
    },

    viewItem(item) {
      this.viewRecordId = item.id
      this.viewDialog = true
    },

    viewClose() {
      this.viewDialog = false
      this.viewRecordId = null
    },

    editItem(item) {
      this.editRecordId = item.id
      this.editDialog = true
    },

    deleteItem(item) {
      //
    },

    editClose() {
      this.editDialog = false
      this.editRecordId = null
    },

    editSave() {
      this.editClose()
      this.getRecords()
    },

    getLatestInvitation(invitations) {
      if (invitations.length > 0) {
        const [latestInvitation] = invitations.slice(-1)

        if (latestInvitation.event) {
          return latestInvitation.event.event_name
        }

        return 'Pernah'
      }

      return 'Belum Pernah'
    },

    getPersonStatusText(value) {
      if (value === 'ODP') {
        return 'ODP'
      }

      if (value === 'PDP') {
        return 'PDP'
      }

      if (value === 'OTG') {
        return 'OTG'
      }

      if (value === 'NOT_ALL') {
        return 'Bukan Ketiganya'
      }

      if (value === 'UNKNOWN') {
        return 'Tidak Tahu'
      }
    }
  }
}
</script>
