<template>
  <v-menu
    ref="clockPicker"
    v-model="showClock"
    :close-on-content-click="false"
    :return-value.sync="tempValue"
    transition="scale-transition"
    offset-y
    min-width="520px"
    allow-overflow
    absolute
  >
    <template v-slot:activator="{ on, attrs }">
      <validation-provider v-slot="{ errors }" :name="name" :rules="rules">
        <v-text-field
          v-model.lazy="tempValue"
          :placeholder="placeholder"
          :error-messages="errors"
          persistent-hint
          clearable
          outlined
          dense
          v-bind="attrs"
          v-on="on"
        >
          <template v-slot:label>
            {{ label }}
            <span v-if="isRequired" class="red--text">*</span>
          </template>
          <template v-slot:append-outer>
            <slot name="append-outer" />
          </template>
        </v-text-field>
      </validation-provider>
    </template>
    <v-row no-gutters class="white pkbr-timepicker">
      <v-col cols="6">
        <h3 class="pl-2">Mulai:</h3>
        <v-time-picker
          v-model="tempValueMin"
          format="24hr"
          :max="tempValueMax"
          full-width
          @click:minute="close"
        />
      </v-col>
      <v-col cols="6">
        <h3 class="pl-2">Selesai:</h3>
        <v-time-picker
          v-model="tempValueMax"
          format="24hr"
          :min="tempValueMin"
          full-width
          @click:minute="close"
        />
      </v-col>
    </v-row>
  </v-menu>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    },
    rules: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showClock: false,
      tempValueMin: this.value ? this.value.split('-')[0] : '',
      tempValueMax: this.value ? this.value.split('-')[1] : ''
    }
  },
  computed: {
    isRequired() {
      return !!this.label && this.rules.split('|').includes('required')
    },
    tempValue: {
      get() {
        return this.parseHour()
      },
      set(val) {
        if (val) {
          this.tempValueMin = val.split('-')[0]
          this.tempValueMax = val.split('-')[1]
        } else {
          this.tempValueMin = null
          this.tempValueMax = null
        }
      }
    }
  },
  watch: {
    value(val) {
      this.tempValueMin = val ? val.split('-')[0] : ''
      this.tempValueMax = val ? val.split('-')[1] : ''
    },
    tempValue(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  },
  methods: {
    parseHour() {
      let fix = ''
      if (this.tempValueMin && this.tempValueMax) {
        fix = `${this.tempValueMin}-${this.tempValueMax}`
      } else if (this.tempValueMin) {
        fix = `${this.tempValueMin}`
      }
      return fix
    },
    close() {
      if (this.tempValueMin && this.tempValueMax) {
        this.$refs.clockPicker.save(this.parseHour())
      }
    }
  }
}
</script>
