<template>
  <div style="width: 100%;">
    <v-data-table
      class="v-card v-sheet pkbr-table"
      :headers="headers"
      :items="records"
      :server-items-length="totalItems"
      :options.sync="options"
      :loading="loading"
      fixed-header
      :header-props="{
        class: 'blue-grey lighten-3'
      }"
    >
      <template slot="top">
        <div class="d-flex">
          <v-col cols="12">
            Status:
            <v-btn-toggle v-model="stat" color="primary" class="pl-2">
              <v-btn small value="draft">
                DRAFT
              </v-btn>
              <v-btn small value="published">
                PUBLISHED
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </div>
        <div class="d-flex">
          <v-col cols="auto">
            <v-text-field
              v-model="searchKey"
              label="Nama Kegiatan"
              clearable
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn color="primary" to="/events/create">
              <v-icon class="mr-1">
                mdi-plus-circle
              </v-icon>
              Tambah Kegiatan
            </v-btn>
          </v-col>
        </div>
      </template>
      <template v-slot:item.start_at="{ value }">
        {{ $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') }}
      </template>
      <template v-slot:item.end_at="{ value }">
        {{ $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') }}
      </template>
      <template v-slot:item.status="{ value }">
        <v-chip small class="ma-2" :color="value | getChipColor">
          {{ value }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          v-if="allow.includes('view-events')"
          class="mr-2"
          @click="$router.push(`events/${item.id}`)"
        >
          mdi-card-search
        </v-icon>
        <v-icon
          v-if="allow.includes('manage-events')"
          class="mr-2"
          @click="$router.push(`events/${item.id}/edit`)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="allow.includes('manage-events')"
          @click="selectToRemove({ id: item.id, name: item.event_name })"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteModal" max-width="528">
      <v-card class="text-center">
        <v-card-title>
          <span class="col pl-10">Hapus Kegiatan</span>
        </v-card-title>
        <v-card-text>
          <div>
            {{ confirmDeleteMsg }}
          </div>
          <strong> {{ selectedEvent.name }} </strong>.
        </v-card-text>
        <v-card-actions class="pb-6 justify-center">
          <v-btn
            color="grey darken-1"
            outlined
            class="mr-2 px-2"
            @click="deleteModal = false"
          >
            Tidak
          </v-btn>
          <v-btn
            color="error"
            class="ml-2 px-2"
            @click="remove(selectedEvent.id)"
          >
            Ya
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import {
  SUCCESS_DELETE,
  FAILED_DELETE,
  CONFIRM_DELETE
} from '@/utilities/constant'
import { getChipColor } from '@/utilities/formater'

const headers = [
  { text: 'Nama Kegiatan', value: 'event_name', sortable: false, width: 150 },
  { text: 'Tanggal Mulai', value: 'start_at', width: 180 },
  { text: 'Tanggal Selesai', value: 'end_at', width: 180 },
  { text: 'Lokasi', value: 'event_location', width: 200 },
  { text: 'Kota/Kab', value: 'city.name', width: 200 },
  { text: 'Peserta', value: 'invitations_count', width: 100 },
  { text: 'Kloter', value: 'schedules_count', width: 100 },
  { text: 'Status', value: 'status', width: 200 },
  { text: 'Actions', value: 'actions', sortable: false, width: 150 }
]

export default {
  filters: {
    getChipColor
  },

  props: {
    title: {
      type: String,
      default: 'Kegiatan'
    },

    allow: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      headers,
      selectedEvent: {
        id: null,
        name: null
      },
      deleteModal: false
    }
  },

  computed: {
    confirmDeleteMsg() {
      return CONFIRM_DELETE + this.selectedEvent.id
    },
    records() {
      return this.$store.getters['events/getList']
    },
    loading() {
      return this.$store.getters['events/getLoading']
    },
    options: {
      set(value) {
        this.$store.commit('events/SET_TABLE_OPTIONS', value)
      },
      get() {
        return this.$store.getters['events/getTableOption']
      }
    },
    totalItems() {
      return this.$store.getters['events/getTotalData']
    },
    stat: {
      async set(value) {
        await this.$store.dispatch('events/resetOptions')
        this.options = {
          ...this.options,
          status: typeof value === 'object' ? value[0] : value
        }
      },
      get() {
        return this.$route.query.status
      }
    },
    searchKey: {
      async set(value) {
        await this.$store.dispatch('events/resetOptions')
        this.options = {
          ...this.options,
          keyWords: value
        }
      },
      get() {
        return this.$route.query.keyWords
      }
    }
  },

  watch: {
    async options(value, oldValue) {
      if (!isEqual(oldValue, value)) {
        await this.$emit('optionChanged', value)
      }
    }
  },

  mounted() {
    const options = { ...this.options }
    if (this.$route.query.page) {
      options.page = parseInt(this.$route.query.page)
    }
    if (this.$route.query.perPage) {
      options.perPage = parseInt(this.$route.query.perPage)
    }
    if (this.$route.query.sortBy) {
      options.sortBy = [this.$route.query.sortBy]
    }
    if (this.$route.query.sortOrder) {
      options.sortOrder = [this.$route.query.sortOrder]
    }
    if (this.$route.query.keyWords) {
      options.keyWords = this.$route.query.keyWords
    }
    options.status = this.$route.query.status || 'published'
    this.options = options
    this.$emit('optionChanged', options)
  },

  methods: {
    selectToRemove(payload) {
      this.selectedEvent = payload
      this.deleteModal = true
    },
    async remove(id) {
      try {
        await this.$store.dispatch('events/delete', id)
        this.$toast.show({
          message: SUCCESS_DELETE,
          type: 'success'
        })
        await this.$store.dispatch('events/getList')
        this.deleteModal = false
      } catch (error) {
        this.$toast.show({
          message: error.message || FAILED_DELETE,
          type: 'error'
        })
      }
    }
  }
}
</script>
