<template>
  <v-card>
    <v-card-title>
      <p class="text-h6 text--primary">
        Tambah Kegiatan
      </p>
    </v-card-title>
    <v-divider></v-divider>
    <validation-observer
      v-slot="{ valid, handleSubmit }"
      tag="div"
      class="v-card__text"
    >
      <form class="row justify-end" @submit.prevent="handleSubmit(doStore)">
        <v-col v-if="type === 'edit'" cols="12" class="text-right">
          Status:
          <v-btn-toggle v-model="status" mandatory color="primary" class="pl-2">
            <v-btn small value="DRAFT">
              DRAFT
            </v-btn>
            <v-btn small value="PUBLISHED">
              PUBLISHED
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="6">
          <pkbr-input
            v-model="event_name"
            name="Nama Kegiatan"
            label="Nama Kegiatan"
            placeholder="Masukan Nama Kegiatan"
            rules="required"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-input
            v-model="host_name"
            name="Penyelenggara"
            label="Penyelenggara"
            placeholder="Masukan Instansi Penyelenggara"
            rules="required"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-input
            v-model="event_location"
            name="Lokasi"
            label="Lokasi"
            placeholder="Masukan Alamat Lokasi"
            rules="required"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-select
            v-model="city"
            :items="getKabkot"
            label="Kab./Kota"
            name="Kab./Kota"
            placeholder="Pilih Kab./Kota"
            rules="required"
            item-text="name"
            item-value="code"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-input-date
            v-model="tanggal"
            label="Tanggal"
            name="Tanggal"
            placeholder="Masukan Tanggal Kegiatan"
            rules="required"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-input-time
            v-for="(waktu, i) in kloter"
            :key="i"
            v-model="kloter[i]"
            :label="`Kloter ${i + 1}`"
            :name="`Kloter ${i + 1}`"
            placeholder="Masukan Jam Kloter"
            rules="required|time_range"
          >
            <template v-slot:append-outer>
              <v-btn small icon color="success" @click="addKloter">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn
                :disabled="i < 1"
                small
                icon
                color="error"
                @click="removeKloter(i)"
              >
                <v-icon v-if="i > 0">mdi-minus</v-icon>
              </v-btn>
            </template>
          </pkbr-input-time>
        </v-col>
        <v-col cols="auto">
          <v-btn color="success" :disabled="!valid" type="submit">
            Simpan
          </v-btn>
        </v-col>
      </form>
    </validation-observer>
  </v-card>
</template>

<script>
/* eslint-disable camelcase */
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  props: {
    formData: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: 'create'
    }
  },

  data() {
    return {
      event_name: null,
      host_name: null,
      event_location: null,
      city: null,
      status: 'DRAFT',
      tanggal: null,
      kloter: [null]
    }
  },

  computed: {
    ...mapGetters('area', ['getKabkot'])
  },

  watch: {
    formData(val) {
      let kloter = [null]
      if (val) {
        kloter = val.schedules.map((sch) => {
          const [startH, startM] = sch.start_at.split('T')[1].split(':')
          const [endH, endM] = sch.end_at.split('T')[1].split(':')
          return `${startH}:${startM}-${endH}:${endM}`
        })
      }
      this.event_name = val ? val.event_name : null
      this.status = val ? val.status : null
      this.host_name = val ? val.host_name : null
      this.event_location = val ? val.event_location : null
      this.city = val ? val.city : null
      this.tanggal = val ? moment(val.start_at).format() : null
      this.kloter = kloter
    }
  },

  methods: {
    addKloter() {
      this.kloter.push(null)
    },

    removeKloter(index) {
      this.kloter.splice(index, 1)
    },

    doStore() {
      const schedules = this.kloter.map((waktu, i) => {
        let [start_atSch, end_atSch] = waktu.split('-')
        start_atSch = moment(this.tanggal)
          .hours(start_atSch.split(':')[0])
          .minutes(start_atSch.split(':')[1])
          .format()
        end_atSch = moment(this.tanggal)
          .hours(end_atSch.split(':')[0])
          .minutes(end_atSch.split(':')[1])
          .format()
        return {
          start_at: start_atSch,
          end_at: end_atSch
        }
      })
      const start_at = schedules[0].start_at
      const end_at = schedules[schedules.length - 1].end_at
      const data = {
        event_name: this.event_name,
        host_name: this.host_name,
        event_location: this.event_location,
        city: this.city,
        status: this.status,
        start_at,
        end_at,
        schedules
      }
      this.$emit('onStore', data)
    }
  }
}
</script>
