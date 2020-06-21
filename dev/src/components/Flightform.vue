<template>
  <div>
    <b-modal
      id="modal-flight"
      @cancel="doCancel"
      @ok="doSave"
      @hidden="doHidden"
      ref="modal"
      title="Vol"
    >
      <div>
        <div class="row" v-if="flight.filename && flight.filename != ''">
          <div class="col-md-12">
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td>Pilote</td>
                  <th>{{ flight.pilot }}</th>
                  <td>Voile</td>
                  <th>{{ flight.wing }}</th>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-6">
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
          <div class="col-md-6">
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td>Alt. départ / Alt. fin</td>
                  <th>{{ flight.start_height }} / {{ flight.end_height }}</th>
                </tr>
                <tr>
                  <td>Altitude mini</td>
                  <th>{{ flight.min_height }}</th>
                </tr>
                <tr>
                  <td>Altitude maxi</td>
                  <th>{{ flight.max_height }}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <b-card>
          <b-form @submit.prevent>
            <div v-if="!(flight.filename)">
              <b-row class="my-1">
                <b-col sm="3">
                  <label>Date du vol</label>
                </b-col>
                <b-col sm="9">
                  <b-form-input v-model="flight.flight_date" placeholder="Date du vol" type="date"></b-form-input>
                </b-col>
              </b-row>

              <b-row class="my-1">
                <b-col sm="3">
                  <label>Pilote</label>
                </b-col>
                <b-col sm="9">
                  <b-form-input v-model="flight.pilot" placeholder="Nom du pilote"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="3">
                  <label>Aile</label>
                </b-col>
                <b-col sm="9">
                  <b-form-input v-model="flight.wing" placeholder="Nom de l'aile"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="3">
                  <label>Heure de début</label>
                </b-col>
                <b-col sm="9">
                  <b-form-input
                    v-model="flight.start_flight_time"
                    placeholder="Début du vol"
                    type="time"
                  ></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="3">
                  <label>Heure de fin</label>
                </b-col>
                <b-col sm="9">
                  <b-form-input
                    v-model="flight.end_flight_time"
                    placeholder="Fin du vol"
                    type="time"
                  ></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="3">
                  <label>Altitude de départ</label>
                </b-col>
                <b-col sm="9">
                  <b-form-input
                    v-model="flight.start_height"
                    placeholder="Altitude départ"
                    type="number"
                  ></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="3">
                  <label>Altitude de fin</label>
                </b-col>
                <b-col sm="9">
                  <b-form-input
                    v-model="flight.end_height"
                    placeholder="Altitude fin"
                    type="number"
                  ></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="3">
                  <label>Altitude mini</label>
                </b-col>
                <b-col sm="9">
                  <b-form-input
                    v-model="flight.min_height"
                    placeholder="Altitude mini"
                    type="number"
                  ></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="3">
                  <label>Altitude maxi</label>
                </b-col>
                <b-col sm="9">
                  <b-form-input
                    v-model="flight.max_height"
                    placeholder="Altitude maxi"
                    type="number"
                  ></b-form-input>
                </b-col>
              </b-row>
            </div>
            <b-row class="my-1">
              <b-col sm="3">
                <label>Site</label>
              </b-col>
              <b-col sm="9">
                <b-form-select
                  v-model="flight.site_id"
                  :options="sites"
                  value-field="id"
                  text-field="lib"
                ></b-form-select>
              </b-col>
            </b-row>
            <b-row class="my-1">
              <b-col sm="3">
                <label>Commentaires</label>
              </b-col>
              <b-col sm="9">
                <b-form-textarea id="comment" v-model="flight.comment"></b-form-textarea>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
        <div class="clearfix"></div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  name: "Flightform",
  props: {
    show: { type: Boolean, default: false },
    flight: { type: Object, default: null }
  },
  components: {},
  data: function() {
    return {};
  },
  watch: {
    show: function(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.showModal();
      }
    }
  },
  computed: {
    ...mapGetters(["sites"])
  },
  methods: {
    showModal: function() {
      this.$bvModal.show("modal-flight");
    },
    // eslint-disable-next-line no-unused-vars
    doSave: function(bvModalEvt) {
      let self = this;
      if (
        this.flight.site_id == undefined &&
        this.flight.comment == undefined
      ) {
        bvModalEvt.preventDefault();
        return;
      }
      let ff = {};
      if (!this.flight.filename) {
        ff = {
          id: this.flight.id,
          site_id: this.flight.site_id ? this.flight.site_id : null,
          flightDate: this.flight.flight_date ? this.flight.flight_date : "",
          pilot: this.flight.pilot ? this.flight.pilot : "",
          wing: this.flight.wing ? this.flight.wing : "",
          startFlightTime: this.flight.start_flight_time
            ? this.flight.start_flight_time
            : "",
          endFlightTime: this.flight.end_flight_time
            ? this.flight.end_flight_time
            : "",
          startHeight: this.flight.start_height ? this.flight.start_height : "",
          endHeight: this.flight.end_height ? this.flight.end_height : 0,
          minHeight: this.flight.min_height ? this.flight.min_height : 0,
          maxHeight: this.flight.max_height ? this.flight.max_height : 0,
          startLat: 0,
          startLon: 0,
          endLat: 0,
          endLon: 0,
          comment: this.flight.comment ? this.flight.comment : ""
        };
      } else {
        ff = {
          id: this.flight.id,
          site_id: this.flight.site_id,
          comment: this.flight.comment ? this.flight.comment : ""
        };
      }
      store.dispatch("saveFlight", ff).then(
        // eslint-disable-next-line no-unused-vars
        response => {
          self.show = false;
          store.dispatch("loadBddFlights", { 'reload': true });
          this.$bvModal.hide("modal-flight");
        },
        // eslint-disable-next-line
        error => {
          self.$bvToast.toast(`Echec de la sauvegarde du vol.`, {
            title: "Carnet",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger"
          });
        }
      );
    },
    doCancel: function() {
      //   store.dispatch("loadConfigWeb");
    },
    doHidden: function() {
      this.$emit("flightClosed");
    }
  },
  mounted() {},
  beforeDestroy() {}
};
</script>

<style scoped>
</style>