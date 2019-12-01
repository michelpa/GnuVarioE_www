<template>
  <div>
    <div v-if="!flights">Le chargement des vols n'est pas terminé!</div>
    <div v-else class="row">
      <div class="col-md-12">
        <h1>{{ $t('flights.FLIGHTS_LIST') }}</h1>
        <br />
        <div class="row">
          <div class="col-md-6" :class="{'offset-md-3': (igc == null)}">
            <b-card :header="$t('flights.FLIGHTS_FILES')" header-tag="header">
              <div class="bg-default">
                <table class="table table-bordered table-striped table-hover">
                  <thead>
                    <tr>
                      <th>{{ $t('flights.FLIGHTS_FILENAME') }}</th>
                      <th class="act">{{ $t('flights.FLIGHTS_ACTION') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="f in flights" :key="f">
                      <td>
                        {{ f.name }} &nbsp;
                        <em>
                          <small>({{ f.size }})</small>
                        </em>
                      </td>
                      <td class="btns">
                        <button
                          class="btn btn-sm btn-success"
                          @click="downloadFromSD(f.name)"
                          v-b-tooltip.hover="{delay: { show: 1000, hide: 50 }}"
                          title="Télécharger"
                        >
                          <i class="fa fa-arrow-alt-circle-down"></i>
                        </button>&nbsp;
                        <click-confirm
                          placement="bottom"
                          button-size="sm"
                          yes-class="btn btn-success"
                          no-class="btn btn-danger"
                          :messages="{title: 'Êtes-vous sûr?', yes: 'Oui', no: 'Non'}"
                        >
                          <button
                            class="btn btn-sm btn-danger"
                            @click="deleteFromSD(f.name)"
                            v-b-tooltip.hover="{delay: { show: 1000, hide: 50 }}"
                            title="Supprimer"
                          >
                            <i class="fa fa-trash-alt"></i>
                          </button>
                        </click-confirm>&nbsp;
                        <button
                          class="btn btn-sm btn-info"
                          @click="flightInfo(f.name)"
                          v-b-tooltip.hover="{delay:  { show: 1000, hide: 50 } }"
                          title="Info"
                        >
                          <i class="fa fa-info-circle"></i>
                          <i class="fa fa-arrow-right" v-show="(currentF == f.name)"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-card>
          </div>
          <div id="infozone" class="col-md-6 animated fadeIn" v-if="igc != null">
            <div class="alert alert-info">
              <button class="btn btn-sm btn-info close-info" @click="closeInfo">
                <i class="fa fa-window-close"></i>
              </button>
              <ma-carte :igc="igc"></ma-carte>
              <table class="table table-striped table-sm table-responsive text-left">
                <tr>
                  <th>Vol du {{flightDate}}</th>
                  <td>Début du vol: {{flightStart}}</td>
                  <td>Altitude de départ: {{altStart}}m</td>
                  <td>Altitude max: {{altMax}}m</td>
                </tr>
                <tr>
                  <td>Durée du vol: {{flightDuration}}</td>
                  <td>Fin du vol: {{flightStop}}</td>
                  <td>Altitude de fin: {{altStop}}m</td>
                  <td>&nbsp;</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import MaCarte from "./MaCarte";

export default {
  name: "MesVols",
  components: { MaCarte },
  props: {
    msg: String
  },
  data: function() {
    return {
      titre: "Le titre",
      env: process.env,
      traceFiles: [],
      currentF: null,
      igc: null
    };
  },
  methods: {
    downloadFromSD: function(f) {
      let self = this;
      store.dispatch("downloadFlight", f).then(
        response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", f);
          document.body.appendChild(link);
          link.click();
        },
        // eslint-disable-next-line
        error => {
          self.$bvToast.toast(`Echec du téléchargement du fichier.`, {
            title: "Mon vol",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger"
          });
        }
      );
    },
    deleteFromSD: function(f) {
      //confirmation
      let self = this;
      store.dispatch("deleteFlight", f).then(
        // eslint-disable-next-line
        response => {
          store.dispatch("loadFlights");
          self.$bvToast.toast("Fichier " + f + " supprimée de la carte SD.", {
            title: "Mon vol",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "success"
          });
        },
        // eslint-disable-next-line
        error => {
          self.$bvToast.toast(`Echec de la suppression du fichier.`, {
            title: "Mon vol",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger"
          });
        }
      );
    },
    flightInfo: function(f) {
      this.igc = null;
      this.currentF = null;
      let self = this;
      store.dispatch("infoFlight", f).then(
        response => {
          this.currentF = f;
          this.igc = response;
          var options = {
            // container: "#container",
            easing: "ease-in",
            offset: -60,
            force: false,
            cancelable: true,
            x: false,
            y: true
          };
          window.setTimeout(function() {
            VueScrollTo.scrollTo("#infozone", 200, options);
          }, 1000);
        },
        // eslint-disable-next-line
        error => {
          self.$bvToast.toast(`Echec du téléchargement du fichier.`, {
            title: "Mon vol",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger"
          });
        }
      );
    },
    closeInfo: function() {
      this.igc = null;
      this.currentF = null;
    }
  },
  computed: {
    ...mapGetters(["flights", "isLoading"]),
    flightDuration: function() {
      if (!this.igc) {
        return null;
      }

      var start = moment(this.igc.recordTime[0]); //todays date
      var end = moment(this.igc.recordTime.slice(-1).pop()); // another date

      let f = moment.utc(end.diff(start)).format("HH:mm:ss");
      return f;
    },
    flightStart: function() {
      var start = moment(this.igc.recordTime[0]);
      return start.format("HH:mm:ss");
    },
    flightStop: function() {
      var end = moment(this.igc.recordTime.slice(-1).pop());
      return end.format("HH:mm:ss");
    },
    flightDate: function() {
      var start = moment(this.igc.recordTime[0]);
      switch (this.$i18n.locale) {
        case "fr":
          return start.format("DD/MM/YYYY");
          // eslint-disable-next-line
          break;
        case "en":
          return start.format("YYYY-MM-DD");
          // eslint-disable-next-line
          break;
        default:
          return start.format("DD/MM/YYYY");
      }
    },
    altStart: function() {
      return this.igc.gpsAltitude[0];
    },
    altStop: function() {
      return this.igc.gpsAltitude.slice(-1).pop();
    },
    altMax: function() {
      return Math.max.apply(null, this.igc.gpsAltitude);
    }
  },
  mounted: function() {
    store.dispatch("loadFlights");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
th.act {
  width: 250px;
}

td.btns div {
  display: inline;
}

.close-info {
  position: absolute;
  z-index: 1000;
  top: 0px;
  right: 0px;
}

.row [class*="col-"] {
  transition: all 0.5s ease-in-out;
}

#infozone {
  animation-delay: 0.6s;
  animation-duration: 0.3s;
}
</style>
