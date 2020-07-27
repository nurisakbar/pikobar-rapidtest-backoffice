<template>
  <div class="d-flex flex-column">
    <v-card>
      <v-card-text>
        <v-row v-if="getCurrent" no-gutters>
          <v-col cols="8" class="pr-4">
            <v-row>
              <v-col cols="auto" class="pt-0">
                <label class="text-subtitle-2 grey--text">Nama Kegiatan</label>
                <p class="font-weight-medium mt-2 mb-0">
                  {{ getCurrent.event_name }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">Tanggal Mulai</label>
                <p class="font-weight-medium mt-2 mb-0">
                  {{
                    $dateFns.format(
                      new Date(getCurrent.start_at.split('.')[0]),
                      'dd-MM-yyyy HH:mm'
                    )
                  }}
                </p>
              </v-col>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">
                  Tanggal Selesai
                </label>
                <p class="font-weight-medium mt-2 mb-0">
                  {{
                    $dateFns.format(
                      new Date(getCurrent.end_at.split('.')[0]),
                      'dd-MM-yyyy HH:mm'
                    )
                  }}
                </p>
              </v-col>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">Lokasi</label>
                <p class="font-weight-medium mt-2 mb-0">
                  {{ getCurrent.event_location }}
                </p>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
            <label class="text-subtitle-2 grey--text">Kloter</label>
            <ol class="mt-2 mb-0 pl-4">
              <li
                v-for="(sch, i) in getCurrent.schedules"
                :key="i"
                class="mb-1"
              >
                <strong>ID {{ sch.id }}</strong
                >:
                {{
                  $dateFns.format(new Date(sch.start_at.split('.')[0]), 'HH:mm')
                }}
                -
                {{
                  $dateFns.format(new Date(sch.end_at.split('.')[0]), 'HH:mm')
                }}
                WIB
              </li>
            </ol>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="openAddModal">
          <v-icon class="mr-1">mdi-plus-circle</v-icon>
          Tambahkan ke Peserta RDT
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openImportModal">
          <v-icon class="mr-1">mdi-file-excel</v-icon>
          Import
        </v-btn>
      </v-card-actions>
    </v-card>
    <applicants-datatable
      v-model="applicants"
      title="Daftar Calon Peserta RDT"
      class="mt-4"
      status="new"
      :page="page"
      :per-page="perPage"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      no-action
      show-select
    />
    <v-dialog v-model="importModal" max-width="528">
      <v-card>
        <validation-observer
          v-slot="{ valid, handleSubmit }"
          ref="observerImport"
          tag="div"
          class="v-card__text"
        >
          <form ref="importForm" @submit.prevent="handleSubmit(doImport)">
            <v-card-title class="subtitle-1">Import Peserta</v-card-title>
            <v-card-text>
              Untuk Import data peserta anda harus memakai format Excel (.xls).
              <pkbr-input
                v-model="importFile"
                label="Import Peserta"
                type="file"
                class="mt-4"
                name="file"
                rules="required"
              />
            </v-card-text>
            <v-card-actions class="pb-6 justify-center">
              <v-btn
                color="grey darken-1"
                outlined
                class="mr-2 px-2"
                @click="importModal = false"
              >
                Batal
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!valid"
                class="ml-2 px-2"
                type="submit"
              >
                Upload
              </v-btn>
            </v-card-actions>
          </form>
        </validation-observer>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addModal" max-width="528">
      <v-card>
        <v-card-title class="subtitle-1">Pilih Kloter Peserta</v-card-title>
        <validation-observer
          v-slot="{ valid, handleSubmit }"
          ref="observerKloter"
          tag="div"
          class="v-card__text"
        >
          <form @submit.prevent="handleSubmit(addApplicants)">
            Pilih satu kloter untuk menentukan jadwal peserta.
            <validation-provider
              v-slot="{ errors }"
              name="Kloter"
              rules="required"
            >
              <v-radio-group
                v-if="getCurrent"
                v-model="kloter"
                :error-messages="errors"
                column
              >
                <v-radio
                  v-for="(sch, i) in getCurrent.schedules"
                  :key="i"
                  :value="sch.id"
                  label="red"
                  color="primary"
                >
                  <template slot="label">
                    <strong class="mr-2">Kloter {{ i + 1 }}</strong>
                    ({{
                      $dateFns.format(
                        new Date(sch.start_at.split('.')[0]),
                        'HH:mm'
                      )
                    }}
                    -
                    {{
                      $dateFns.format(
                        new Date(sch.end_at.split('.')[0]),
                        'HH:mm'
                      )
                    }})
                  </template>
                </v-radio>
              </v-radio-group>
            </validation-provider>
            <v-card-actions class="pb-2 justify-center">
              <v-btn
                color="grey darken-1"
                outlined
                class="mr-2 px-2"
                @click="addModal = false"
              >
                Batal
              </v-btn>
              <v-btn
                :disabled="!valid"
                color="primary"
                class="ml-2 px-2"
                type="submit"
              >
                Tambah
              </v-btn>
            </v-card-actions>
          </form>
        </validation-observer>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  SUCCESS_IMPORT,
  FAILED_IMPORT,
  SUCCESS_ADD_PARTICIPANTS,
  FAILED_ADD_PARTICIPANTS,
  EVENT_BLAST_EMPTY
} from '@/utilities/constant'
import ApplicantsDatatable from '@/components/ApplicantsDatatableClient'

export default {
  middleware: 'auth',
  components: {
    ApplicantsDatatable
  },

  data() {
    return {
      page: 1,
      perPage: -1,
      sortBy: 'created_at',
      sortOrder: 'desc',
      addModal: false,
      importModal: false,
      importFile: null,
      kloter: null,
      applicants: []
    }
  },

  computed: {
    ...mapGetters('auth', ['permissions']),
    ...mapGetters('events', ['getCurrent'])
  },

  watch: {
    addModal(show) {
      if (!show) this.$refs.observerKloter.reset()
    },
    importModal(show) {
      if (!show) this.$refs.observerImport.reset()
    }
  },

  created() {
    this.$store.dispatch('breadcrumbs/setItems', [
      {
        disabled: false,
        text: 'Kegiatan',
        to: '/events'
      },
      {
        disabled: false,
        text: 'Detail Kegiatan',
        to: this.$route.path.split('/').slice(0, -1).join('/')
      },
      {
        disabled: true,
        text: 'Tambah Peserta'
      }
    ])
  },

  mounted() {
    if (this.$route.query.page) {
      this.page = parseInt(this.$route.query.page)
    }

    if (this.$route.query.per_page) {
      this.perPage = parseInt(this.$route.query.per_page)
    }

    if (this.$route.query.sort_by) {
      this.sortBy = this.$route.query.sort_by
    }

    if (this.$route.query.sort_order) {
      this.sortOrder = this.$route.query.sort_order
    }
    if (this.$route.params.eventId) {
      this.$store.dispatch('events/getCurrent', this.$route.params.eventId)
    } else {
      this.$router.replace('/events')
    }
  },

  methods: {
    async addApplicants() {
      try {
        if (this.applicants.length === 0) {
          throw new Error(EVENT_BLAST_EMPTY)
        }
        const applicants = this.applicants.map((applicant) => ({
          rdt_applicant_id: applicant.id,
          rdt_event_schedule_id: this.kloter
        }))
        await this.$store.dispatch('events/addAplicants', {
          idEvent: this.getCurrent.id,
          applicants
        })
        this.$toast.show({
          message: SUCCESS_ADD_PARTICIPANTS,
          type: 'success'
        })
        this.$router.push(this.$route.path.split('/').slice(0, -1).join('/'))
      } catch (error) {
        this.$toast.show({
          message: error.message || FAILED_ADD_PARTICIPANTS,
          type: 'error'
        })
      } finally {
        // this.addModal = false
        // this.kloter = null
        // this.$refs.observerKloter.reset()
      }
    },
    openAddModal() {
      this.kloter = null
      this.addModal = true
    },
    openImportModal() {
      this.importFile = null
      this.importModal = true
    },
    async doImport() {
      const formData = new FormData()
      formData.append('file', this.importFile)
      try {
        await this.$store.dispatch('eventParticipants/importPeserta', {
          idEvent: this.getCurrent.id,
          formData
        })
        this.$toast.show({
          message: SUCCESS_IMPORT,
          type: 'success'
        })
        this.$router.push(this.$route.path.split('/').slice(0, -1).join('/'))
      } catch (error) {
        this.$toast.show({
          message: error.message || FAILED_IMPORT,
          type: 'error'
        })
      } finally {
        // this.importModal = false
        // this.kloter = null
        // this.$refs.observerImport.reset()
      }
    }
  },

  head() {
    return {
      title: 'Tambah Peserta'
    }
  }
}
</script>
