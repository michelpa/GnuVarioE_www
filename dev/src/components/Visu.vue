
<template>
  <div>
    <b-modal
      id="modal-visu"
      ok-only
      @ok="doCancel"
      @hidden="doHidden"
      ref="modal"
      title="Visu"
      size="full"
    >
      <visu-data :igc="igc" :flight="flight"></visu-data>
      <div class="row">
        <div class="col-md-4">
          <table class="table table-sm">
            <tbody>
              <tr>
                <td>Site</td>
                <th>{{ flight.site_lib }}</th>
              </tr>
              <tr>
                <td>Pilote</td>
                <th>{{ flight.pilot }}</th>
              </tr>
              <tr>
                <td>Voile</td>
                <th>{{ flight.wing }}</th>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-md-4">
          <table class="table table-sm">
            <tbody>
              <tr>
                <td>Heure de début</td>
                <th>{{ flight.start_flight_time }}</th>
              </tr>
              <tr>
                <td>Heure de fin</td>
                <th>{{ flight.end_flight_time }}</th>
              </tr>
              <tr>
                <td>Durée</td>
                <th>{{ flight.duration }}</th>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-md-4">
          <table class="table table-sm">
            <tbody>
              <tr>
                <td>Alt. départ / Alt. fin</td>
                <th>{{ flight.start_height }}m / {{ flight.end_height }}m</th>
              </tr>
              <tr>
                <td>Altitude mini</td>
                <th>{{ flight.min_height }}m</th>
              </tr>
              <tr>
                <td>Altitude maxi</td>
                <th>{{ flight.max_height }}m</th>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-md-12">
          <div class="comments">
            <pre>{{ flight.comment }}</pre>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapGetters } from "vuex";
import VisuData from "./VisuData";

export default {
  /* eslint-disable no-unused-vars */
  name: "Visu",
  components: { VisuData },
  props: {
    show: { type: Boolean, default: false },
    igc: { type: Object, default: null },
    flight: { type: Object, default: null }
  },
  data: function() {
    return {};
  },
  methods: {
    showModal: function() {
      this.$bvModal.show("modal-visu");
    },
    doCancel: function() {
      //   store.dispatch("loadConfigWeb");
    },
    doHidden: function() {
      this.$emit("visuClosed");
    }
  },
  computed: {
    ...mapGetters(["configWeb"])
  },
  watch: {
    show: function(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.showModal();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.comments {
  border: 1px solid #ccc;
  padding: 5px;
  text-align: center;
}
.form-row {
  color: #212529;
}
</style>

<style >
.current-color {
  border: 1px solid #ccc;
}

.modal-full {
  max-width: 100% !important;
}
</style>