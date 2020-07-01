<template>
  <div>
    <v-dialog :value="open" persistent max-width="800">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Peserta</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="registrationCode"
                  label="Nomor Pendaftaran"
                  outlined
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="name" label="Nama Peserta" outlined />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="close">
            Batal
          </v-btn>
          <v-btn color="blue darken-1" text @click="save">
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },

    recordId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      registrationCode: null,
      name: null
    }
  },

  watch: {
    recordId(value) {
      if (value) {
        this.fetchRecord()
      }
    }
  },

  methods: {
    async fetchRecord() {
      const id = this.recordId
      const { data } = await this.$axios.$get(`/rdt/applicants/${id}`)

      this.registrationCode = data.registration_code
      this.name = data.name
    },

    async save() {
      const id = this.recordId

      try {
        await this.$axios.$put(`/rdt/applicants/${id}`, {
          name: this.name
        })

        this.$emit('save')
      } catch (e) {
        //
      }
    },

    close() {
      this.$emit('close')
    }
  }
}
</script>
