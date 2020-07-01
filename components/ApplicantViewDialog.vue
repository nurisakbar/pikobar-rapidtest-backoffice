<template>
  <div>
    <v-dialog :value="open" persistent max-width="800">
      <v-card>
        <v-card-title>
          <span class="headline">Lihat Peserta</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="registrationCode"
                  label="Nomor Pendaftaran"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="name"
                  label="Nama Peserta"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <h4>Riwayat Undangan / Hasil Tes</h4>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Event</th>
                        <th class="text-left">Tanggal Event</th>
                        <th class="text-left">Jenis Tes</th>
                        <th class="text-left">Tanggal Hasil Tes</th>
                        <th class="text-left">Hasil Tes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="invitation in invitations"
                        :key="invitation.id"
                      >
                        <td>
                          {{
                            invitation.event
                              ? invitation.event.event_name
                              : 'N/A'
                          }}
                        </td>
                        <td>
                          {{
                            invitation.event
                              ? $dateFns.format(
                                  new Date(invitation.event.start_at),
                                  'dd MMMM yyyy'
                                )
                              : 'N/A'
                          }}
                        </td>
                        <td>
                          {{
                            invitation.test_type ? invitation.test_type : 'N/A'
                          }}
                        </td>
                        <td>
                          {{
                            invitation.result_at
                              ? $dateFns.format(
                                  new Date(invitation.result_at),
                                  'dd MMMM yyyy'
                                )
                              : 'N/A'
                          }}
                        </td>
                        <td>{{ invitation.lab_result_type }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="close">
            Keluar
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
      name: null,
      invitations: []
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
      this.invitations = data.invitations
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
