<template>
  <validation-provider v-slot="{ errors }" :name="name" :rules="rules">
    <v-text-field
      v-model="tempValue"
      :error-messages="errors"
      :placeholder="placeholder"
      :type="type"
      clearable
      outlined
      dense
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
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    rules: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    rows: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      tempValue: this.value
    }
  },
  computed: {
    isRequired() {
      return !!this.label && this.rules.split('|').includes('required')
    }
  },
  watch: {
    value(val) {
      this.tempValue = val
    },
    tempValue(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    isNumber(e) {
      if (this.type === 'number') {
        const charCode = e.which ? e.which : e.keyCode
        if (
          charCode > 31 &&
          (charCode < 48 || charCode > 57) &&
          charCode !== 46
        ) {
          e.preventDefault()
        }
      }
      return true
    }
  }
}
</script>
