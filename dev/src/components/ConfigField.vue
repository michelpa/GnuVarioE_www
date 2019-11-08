<template>
  <b-form-group
    label-cols-sm="6"
    label-cols-lg="6"
    :label="label"
    :label-for="guid"
    :description="help"
  >
    <b-form-checkbox
      v-if="kind == 'checkbox'"
      :id="guid"
      v-model="isChecked"
      value="1"
      unchecked-value="0"
      ref="monchamp"
      @input="updateValue()"
    ></b-form-checkbox>
    <b-form-select
      v-else-if="kind == 'select'"
      :id="guid"
      v-model="selected"
      :options="options"
      ref="monchamp"
      @input="updateValue()"
    ></b-form-select>
    <b-form-input
      v-else
      :id="guid"
      v-model="lemodel"
      ref="monchamp"
      @input="updateValue()"
      @change="updateValue()"
      :type="inputType"
      :min="min"
      :max="max"
      :step="step"
    ></b-form-input>
    <div v-if="step" class="mt-2 text-muted small">valeur: {{lemodel}}</div>
  </b-form-group>
</template>

<script>
export default {
  name: "ConfigField",
  props: {
    // configField: String,
    value: String,
    label: String,
    kind: String,
    inputType: { type: String, default: "text" },
    help: { type: String, default: "" },
    options: Array,
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    step: { type: Number, default: null }
  },
  data: function() {
    return {
      lemodel: this.value,
      guid: "a" + Math.round(new Date().getTime())
    };
  },
  watch: {
    value: function(newVal, oldVal) {
      console.log('watch')
      // watch it
      if (newVal != oldVal) {
        this.lemodel = this.value;
      }
    }
  },
  methods: {
    updateValue: function() {
      // console.log(this.valeur)
      if (this.kind == "checkbox") {
        this.$emit(
          "input",
          parseInt(this.$refs.monchamp.localChecked).toString()
        );
      } else if (this.kind == "select") {
        this.$emit("input", this.$refs.monchamp.localValue);
      } else {
        // this.$emit("input", this.$refs.monchamp.localValue);
        // this.currentval = this.$refs.monchamp.localValue;
        this.$emit("input", this.lemodel);
      }
    }
  },
  computed: {
    // currentval: {
    //   set: function() {
    //     return;
    //   },
    //   get: function() {
    //     return this.localValue;
    //   }
    // },
    isChecked: {
      set: function() {
        return;
      },
      get: function() {
        return this.value == "1" ? "1" : "0";
      }
    },
    selected: {
      set: function() {
        return;
      },
      get: function() {
        return this.value;
      }
    }
  },
  beforeMount: function() {
    // this.guid = ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c =>
    //   (
    //     c ^
    //     (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    //   ).toString(16)
    // );
  }
};
</script>

