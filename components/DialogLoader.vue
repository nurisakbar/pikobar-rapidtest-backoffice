<template>
  <v-dialog v-model="open" hide-overlay persistent width="300">
    <v-card color="primary" dark class="pa-4">
      <v-card-text>
        Data sedang diproses...
        <v-progress-linear
          indeterminate
          color="white"
          class="my-4 mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  }
}
</script>
