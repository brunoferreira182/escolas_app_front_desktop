<template>
  <q-input
    outlined
    bottom-slots
    v-model="value"
    type="text"
    :hint="fieldHint"
    :label="label"
    @keyup="onChange"
    :rules="[val => this.validated || 'Email inválido']"
    ref="value"
    @input="val => { value = val.toLowerCase() }"
    @keyup.enter="onEnter"
  >
  </q-input>
</template>

<script>
export default {
  name: 'MedInputEmail',
  data () {
    return {
      value: '',
      id: '',
      validated: true,
      reg: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    }
  },
  props: ['valueField', 'label', 'fieldHint', 'idField', 'loaded'],
  methods: {
    onChange () {
      if (this.isEmailValid(this.value)) {
        this.validated = true
        this.$refs.value.resetValidation()
      } else this.validated = false
      this.$emit('onChange', { value: this.value, id: this.id, validated: this.validated })
    },
    isEmailValid: function () {
      return (this.value === '') ? '' : this.reg.test(this.value)
    },
    onEnter () {
      this.$emit('onEnter')
    }
  },
  mounted () {
    this.onChange()
    this.value = this.valueField
    this.id = this.idField
  },
  watch: {
    loaded: function () {
      this.onChange()
    }
  }
}
</script>
