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
    <b-form-invalid-feedback :state="isLenghtOK">30 caractères maximum</b-form-invalid-feedback>
    <div v-if="step" class="mt-2 text-muted small">{{ $t( "params.vario.VALUE" ) }}: {{lemodel}}</div>
  </b-form-group>
</template>

<script>
export default {
  name: "ConfigField",
  props: {
    // configField: String,
    value: [String, Number],
    label: String,
    kind: String,
    inputType: { type: String, default: "text" },
    help: { type: String, default: "" },
    options: Array,
    maxLength: Number,
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    step: { type: Number, default: null }
  },
  data: function() {
    return {
      lemodel: this.value,
      guid: "a" + Math.round(new Date().getTime()),
      isLenghtOK: true
    };
  },
  watch: {
    value: function(newVal, oldVal) {
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
        var lml = 30;
        if (this.maxLength) {
          lml = this.maxLength;
        }
        if (this.inputType != "number" && this.lemodel.length > lml) {
          this.isLenghtOK = false;
        } else {
          this.isLenghtOK = true;
        }
        if (this.inputType == "number") {
          this.$emit("input", parseFloat(this.lemodel));
        } else {
          this.$emit("input", this.lemodel);
        }
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
  }
};
</script>

