<template>
  <div>
    <div v-if="!flights">{{ $t('flights.FLIGHTS_WAIT') }}</div>
    <div v-else class="row">
      <div class="col-md-12">
        <h1>{{ $t('flights.FLIGHTS_LIST') }}</h1>
        <br />
        <div class="row">
          <div class="col-md-12">
            <b-tabs
              card
              content-class="mt-3"
              fill
              active-nav-item-class="font-weight-bold text-uppercase text-info"
              @activate-tab="tabChanged"
            >
              <b-tab title="Mes traces en attente" active>
                <div v-if="flightsMonth != {}">
                  <div class="row">
                    <div class="col-md-12">
                      <div
                        class="alert alert-info"
                      >Cette zone doit être vide. Pour cela, supprimer les traces erronées et envoyer les traces valides dans votre carnet de vol.</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class :class="[(igc == null) ? 'col-md-6 offset-md-3': 'col-md-4']">
                      <b-card :header="$t('flights.FLIGHTS_FILES')" header-tag="header">
                        <div class="bg-default">
                          <div role="tablist">
                            <b-card
                              no-body
                              class="mb-1"
                              v-for="(datamonth, month) in flightsMonth"
                              :key="month"
                            >
                              <b-card-header header-tag="header" class="p-1" role="tab">
                                <b-button
                                  block
                                  v-b-toggle="string2classname(month)"
                                  variant="primary"
                                >{{ month }} ({{ getNbFlightForMonth(datamonth) }} {{ $t('flights.FLIGHTS') | pluralize(getNbFlightForMonth(datamonth))}})</b-button>
                              </b-card-header>
                              <b-collapse
                                :id="month|string2classname"
                                accordion="my-accordion-month"
                                role="tabpanel"
                              >
                                <b-card
                                  no-body
                                  class="mb-1"
                                  v-for="(data , day) in datamonth.days"
                                  :key="day"
                                >
                                  <b-card-header header-tag="header" class="p-1" role="tab">
                                    <b-button
                                      block
                                      v-b-toggle="string2classname(day)"
                                      variant="info"
                                    >{{ day }} ({{data.flights.length}} {{ $t('flights.FLIGHTS') | pluralize(data.flights.length)}})</b-button>
                                  </b-card-header>
                                  <b-collapse
                                    :id="day|string2classname"
                                    accordion="my-accordion-day"
                                    role="tabpanel"
                                  >
                                    <b-card-body>
                                      <table class="table table-bordered table-striped table-hover">
                                        <thead>
                                          <tr>
                                            <th>{{ $t('flights.FLIGHTS_FILENAME') }}</th>
                                            <th class="act">{{ $t('flights.FLIGHTS_ACTION') }}</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr v-for="f in data.flights" :key="f.name">
                                            <td>
                                              {{ f.name }} &nbsp;
                                              <em>
                                                <small>({{ f.size }})</small>
                                              </em>
                                            </td>
                                            <td class="btns">
                                              <button
                                                class="btn btn-sm btn-primary"
                                                @click="flightToBook(f.name)"
                                                v-b-tooltip.hover="{delay:  { show: 1000, hide: 50 } }"
                                                title="Placer dans mon carnet"
                                              >
                                                <i class="fa fa-book-open"></i>
                                              </button>&nbsp;
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
                                                <i
                                                  class="fa fa-arrow-right"
                                                  v-show="(currentF == f.name)"
                                                ></i>
                                              </button>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </b-card-body>
                                  </b-collapse>
                                </b-card>
                              </b-collapse>
                            </b-card>
                          </div>
                        </div>
                      </b-card>
                    </div>
                    <div id="infozone" class="col-md-8 animated fadeIn" v-if="igc != null">
                      <div class="alert alert-info">
                        <button class="btn btn-sm btn-info close-info" @click="closeInfo">
                          <i class="fa fa-window-close"></i>
                        </button>
                        <ma-carte :igc="igc" :altMax="altMax" :altMin="altMin"></ma-carte>
                        <table class="table table-striped table-sm table-responsive text-left">
                          <tr>
                            <th>{{ $t('flights.FLIGHT_OF') }} {{flightDate}}</th>
                            <td>{{ $t('flights.FLIGHT_START') }}: {{flightStart}}</td>
                            <td>{{ $t('flights.FLIGHT_ALT_START') }}: {{altStart}}m</td>
                            <td>{{ $t('flights.FLIGHT_ALT_MAX') }}: {{altMax}}m</td>
                          </tr>
                          <tr>
                            <td>{{ $t('flights.FLIGHT_DURATION') }}: {{flightDuration}}</td>
                            <td>{{ $t('flights.FLIGHT_END') }}: {{flightStop}}</td>
                            <td>{{ $t('flights.FLIGHT_ALT_END') }}: {{altStop}}m</td>
                            <td>&nbsp;</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="alert alert-success">Aucune trace en attente.</div>
                    </div>
                  </div>
                </div>
              </b-tab>
              <b-tab title="Mon carnet de vols">
                <carnet ref="carnet"></carnet>
              </b-tab>
              <b-tab title="Mes sites de vols">
                <sitelist ref="sitelist"></sitelist>
              </b-tab>

              <!-- <b-tab title="Disabled" disabled>
                <p>I'm a disabled tab!</p>
              </b-tab>-->
            </b-tabs>
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
import Sitelist from "./Sitelist";
import Carnet from "./Carnet";

export default {
  name: "MesVols",
  components: { MaCarte, Sitelist, Carnet },
  props: {
    msg: String
  },
  data: function() {
    return {
      titre: "Le titre",
      env: process.env,
      traceFiles: [],
      currentF: null,
      igc: null,
      days: {}
    };
  },
  methods: {
    toggleDay: function(day) {
      this.flightsPerDays = day;
    },
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
    flightToBook: function(f) {
      let self = this;
      store.dispatch("flightToBook", f).then(
        // eslint-disable-next-line no-unused-vars
        response => {
          self.closeInfo();
          store.dispatch("loadFlights");
        },
        // eslint-disable-next-line
        error => {
          let msg = error.message;
          self.$bvToast.toast(`Echec de déplacement du vol. ${msg}`, {
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
          let msg = error.message;
          self.$bvToast.toast(`Echec du téléchargement du fichier. ${msg}`, {
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
    },
    getNbFlightForMonth: function(datamonth) {
      let nb = 0;
      const values = Object.values(datamonth.days);
      for (var i = 0; i < values.length; i++) {
        nb += values[i].flights.length;
      }
      return nb;
    },
    // eslint-disable-next-line no-unused-vars
    tabChanged: function(newTabIndex, prevTabIndex, bvEvent) {
      if (newTabIndex == 2) {
        this.$refs.sitelist.redrawMap();
      }
      if (newTabIndex == 1) {
        this.$refs.carnet.reset();
      }
    },
    string2classname: function(name) {
      return name.replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return "-";
        if (c >= 65 && c <= 90) return "_" + s.toLowerCase();
        return "__" + ("000" + c.toString(16)).slice(-4);
      });
    }
  },
  computed: {
    ...mapGetters(["flights", "isLoading"]),
    flightsPerDays: function() {
      let lDays = {};
      Object.values(this.flights).forEach(function(f) {
        var day = f.name.substring(0, 6);
        let d = moment(day + "+0000", "YYMMDDZ")
          .utc()
          .format("dddd DD/MM/YYYY");
        if (!lDays[d]) {
          lDays[d] = { flights: [] };
        }

        lDays[d].flights.push(f);
      });

      return lDays;
    },
    flightsMonth: function() {
      let lMonth = {};
      Object.values(this.flights).forEach(function(f) {
        var day = f.name.substring(0, 6);
        let m = moment(day + "+0000", "YYMMDDZ").utc();
        m = m.format("MMMM YYYY");

        // console.log(m);
        if (!lMonth[m]) {
          lMonth[m] = { days: {} };
        }
        let currentsDays = lMonth[m].days;
        let d = moment(day + "+0000", "YYMMDDZ")
          .utc()
          .format("dddd DD/MM/YYYY");
        if (!currentsDays[d]) {
          currentsDays[d] = { flights: [] };
        }
        currentsDays[d].flights.push(f);
        lMonth[m].days = currentsDays;
      });

      return lMonth;
    },
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
      return this.igc.pressureAltitude[0];
    },
    altStop: function() {
      return this.igc.pressureAltitude.slice(-1).pop();
    },
    altMax: function() {
      return Math.max.apply(null, this.igc.pressureAltitude);
    },
    altMin: function() {
      return Math.min.apply(null, this.igc.pressureAltitude);
    }
  },
  mounted: function() {
    let self = this;
    store.dispatch("loadFlights").catch(error => {
      self.$bvToast.toast(`Impossible de charger les vols. (` + error + ")", {
        title: "Mon vol",
        toaster: "b-toaster-top-right",
        solid: true,
        variant: "danger"
      });
    });
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
