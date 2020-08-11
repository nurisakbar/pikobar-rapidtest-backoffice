<template>
  <div>
    <v-dialog :value="open" persistent max-width="400">
      <v-card>
        <v-card-title>
          <span class="headline">Set Kode Sampel Lab</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="lab_code_sample"
                  label="Kode Sampel Lab"
                  outlined
                />
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

    eventId: {
      type: Number,
      default: null
    },

    recordId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      lab_code_sample: null
    }
  },

  methods: {
    async save() {
      const eventId = this.eventId

      try {
        await this.$axios.$put(
          `/rdt/events/${eventId}/participants-set-labcode`,
          {
            rdt_invitation_id: this.recordId,
            lab_code_sample: this.lab_code_sample
          }
        )

        this.lab_code_sample = null

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
