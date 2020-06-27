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
                <v-text-field label="Nama" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="close">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="save">
            Save
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
    }
  },

  methods: {
    save () {
      this.$emit('save')
    },

    close () {
      this.$emit('close')
    }
  }
}
</script>
