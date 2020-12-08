 <template>
  <div>
    <div v-if="!flights">{{ $t("flights.FLIGHTS_WAIT") }}</div>
    <div v-else class="row">
      <div class="col-md-12">
        <h1>{{ $t("flights.FLIGHTS_LIST") }}</h1>
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
              <b-tab :title="$t('flights.MY_unconfirmed_tracks')" active>
                <div
                  v-if="
                    flightsMonth && Object.entries(flightsMonth).length !== 0
                  "
                >
                  <div class="row">
                    <div class="col-md-12">
                      <div class="alert alert-info">
                        {{ $t("mesvols.MESVOL_WARNING") }}
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div
                      class
                      :class="[
                        igc == null ? 'col-md-6 offset-md-3' : 'col-md-4',
                      ]"
                    >
                      <b-card
                        :header="$t('flights.FLIGHTS_FILES')"
                        header-tag="header"
                      >
                        <div class="bg-default">
                          <div role="tablist">
                            <b-card
                              no-body
                              class="mb-1"
                              v-for="(datamonth, month) in flightsMonth"
                              :key="month"
                            >
                              <b-card-header
                                header-tag="header"
                                class="p-1"
                                role="tab"
                              >
                                <b-button
                                  block
                                  v-b-toggle="string2classname(month)"
                                  variant="primary"
                                  >{{ month }} ({{
                                    getNbFlightForMonth(datamonth)
                                  }}
                                  {{
                                    $t("flights.FLIGHTS")
                                      | pluralize(
                                        getNbFlightForMonth(datamonth)
                                      )
                                  }})</b-button
                                >
                              </b-card-header>
                              <b-collapse
                                :id="month | string2classname"
                                accordion="my-accordion-month"
                                role="tabpanel"
                              >
                                <b-card
                                  no-body
                                  class="mb-1"
                                  v-for="(data, day) in datamonth.days"
                                  :key="day"
                                >
                                  <b-card-header
                                    header-tag="header"
                                    class="p-1"
                                    role="tab"
                                  >
                                    <b-button
                                      block
                                      v-b-toggle="string2classname(day)"
                                      variant="info"
                                      >{{ day }} ({{ data.flights.length }}
                                      {{
                                        $t("flights.FLIGHTS")
                                          | pluralize(data.flights.length)
                                      }})</b-button
                                    >
                                  </b-card-header>
                                  <b-collapse
                                    :id="day | string2classname"
                                    accordion="my-accordion-day"
                                    role="tabpanel"
                                  >
                                    <b-card-body>
                                      <table
                                        class="table table-bordered table-striped table-hover"
                                      >
                                        <thead>
                                          <tr>
                                            <th>
                                              {{
                                                $t("flights.FLIGHTS_FILENAME")
                                              }}
                                            </th>
                                            <th class="act">
                                              {{ $t("flights.FLIGHTS_ACTION") }}
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr
                                            v-for="f in data.flights"
                                            :key="f.name"
                                          >
                                            <td>
                                              {{ f.name }} &nbsp;
                                              <em>
                                                <small>({{ f.size }})</small>
                                              </em>
                                            </td>
                                            <td class="btns">
                                              <button
                                                v-if="pgenabled"
                                                class="btn btn-sm btn-primary"
                                                @click="
                                                  flightToParagliding(f.name)
                                                "
                                                v-b-tooltip.hover="{
                                                  delay: {
                                                    show: 1000,
                                                    hide: 50,
                                                  },
                                                }"
                                                title="Téléversement vers paraglidinglogbook.com"
                                              >
                                                <i
                                                  class="fa fa-book"
                                                ></i></button
                                              >&nbsp;
                                              <button
                                                class="btn btn-sm btn-primary"
                                                @click="flightToBook(f.name)"
                                                v-b-tooltip.hover="{
                                                  delay: {
                                                    show: 1000,
                                                    hide: 50,
                                                  },
                                                }"
                                                :title="
                                                  $t('actions.TO_LOGBOOK')
                                                "
                                              >
                                                <i
                                                  class="fa fa-book-open"
                                                ></i></button
                                              >&nbsp;
                                              <button
                                                class="btn btn-sm btn-success"
                                                @click="downloadFromSD(f.name)"
                                                v-b-tooltip.hover="{
                                                  delay: {
                                                    show: 1000,
                                                    hide: 50,
                                                  },
                                                }"
                                                :title="$t('actions.download')"
                                              >
                                                <i
                                                  class="fa fa-arrow-alt-circle-down"
                                                ></i></button
                                              >&nbsp;
                                              <click-confirm
                                                placement="bottom"
                                                button-size="sm"
                                                yes-class="btn btn-success"
                                                no-class="btn btn-danger"
                                                :messages="{
                                                  title: $t(
                                                    'actions.del_message'
                                                  ),
                                                  yes: $t('actions.yes'),
                                                  no: $t('actions.no'),
                                                }"
                                              >
                                                <button
                                                  class="btn btn-sm btn-danger"
                                                  @click="deleteFromSD(f.name)"
                                                  v-b-tooltip.hover="{
                                                    delay: {
                                                      show: 1000,
                                                      hide: 50,
                                                    },
                                                  }"
                                                  :title="$t('actions.delete')"
                                                >
                                                  <i
                                                    class="fa fa-trash-alt"
                                                  ></i>
                                                </button> </click-confirm
                                              >&nbsp;
                                              <button
                                                class="btn btn-sm btn-info"
                                                @click="flightInfo(f.name)"
                                                v-b-tooltip.hover="{
                                                  delay: {
                                                    show: 1000,
                                                    hide: 50,
                                                  },
                                                }"
                                                :title="$t('actions.info')"
                                              >
                                                <i
                                                  class="fa fa-info-circle"
                                                ></i>
                                                <i
                                                  class="fa fa-arrow-right"
                                                  v-show="currentF == f.name"
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
                    <div
                      id="infozone"
                      class="col-md-8 animated fadeIn"
                      v-if="igc != null"
                    >
                      <div class="alert alert-info">
                        <button
                          class="btn btn-sm btn-info close-info"
                          @click="closeInfo"
                        >
                          <i class="fa fa-window-close"></i>
                        </button>
                        <ma-carte
                          :igc="igc"
                          :altMax="altMax"
                          :altMin="altMin"
                        ></ma-carte>
                        <div class="row">
                          <div class="col-md-5">                                      
                            <table class="table table-sm text-left">
                              <tbody>
                                <tr>
                                  <td>{{ $t("flights.FLIGHT_OF") }}</td>
                                  <th>{{ flightDate }}</th>
                                </tr>
                                <tr>
                                  <td>{{ $t("flights.FLIGHT_START") }}:</td>
                                  <th>{{ flightStart }}</th>
                                </tr>
                                <tr>
                                  <td>{{ $t("flights.FLIGHT_END") }}:</td>
                                  <th>{{ flightStop }}</th>
                                </tr>
                                <tr>
                                  <td>{{ $t("flights.FLIGHT_DURATION") }}:</td>
                                  <th>{{ flightDuration }}</th>
                                </tr>                                            
                              </tbody>
                            </table>
                          </div>                                      
                          <div class="col-md-4">                                      
                            <table class="table table-sm text-left">
                              <tbody>
                                <tr>
                                  <td>_</td>
                                  <th></th>
                                </tr>                                            
                                <tr>
                                  <td>{{ $t("flights.FLIGHT_ALT_START") }}:</td>
                                  <th>{{ altStart }} m</th>
                                </tr>
                                <tr>
                                  <td>{{ $t("flights.FLIGHT_ALT_END") }}:</td>
                                  <th>{{ altStop }} m</th>
                                </tr>
                                <tr>
                                  <td>{{ $t("flights.FLIGHT_ALT_MAX") }}:</td>
                                  <th>{{ altMax }} m</th>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>                                    
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="alert alert-success">
                        {{ $t("flights.FLIGHT_NOFLIGHT") }}
                      </div>
                    </div>
                  </div>
                </div>
              </b-tab>
              <b-tab :title="$t('flights.MY_LOGBOOK')">
                <carnet ref="carnet"></carnet>
              </b-tab>
              <b-tab :title="$t('flights.MY_SITES')">
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
    msg: String,
  },
  data: function () {
    return {
      titre: "Le titre",
      env: process.env,
      traceFiles: [],
      currentF: null,
      igc: null,
      days: {},
    };
  },
  methods: {
    toggleDay: function (day) {
      this.flightsPerDays = day;
    },
    downloadFromSD: function (f) {
      let self = this;
      store.dispatch("downloadFlight", { filename: f }).then(
        (response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", f);
          document.body.appendChild(link);
          link.click();
        },
        // eslint-disable-next-line
        (error) => {
          self.$bvToast.toast(this.$i18n.t("actions.download_failed"), {
            title: this.$i18n.t("mesvols.TITLE_MSG_modal"),
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger",
          });
        }
      );
    },
    deleteFromSD: function (f) {
      //confirmation
      let self = this;
      store.dispatch("deleteFlight", f).then(
        // eslint-disable-next-line
        (response) => {
          store.dispatch("loadFlights");
          self.$bvToast.toast(
            this.$i18n.t("actions.del_positive1") +
              f +
              this.$i18n.t("actions.del_positive2"),
            {
              title: this.$i18n.t("mesvols.TITLE_MSG_modal"),
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "success",
            }
          );
        },
        // eslint-disable-next-line
        (error) => {
          self.$bvToast.toast(this.$i18n.t("actions.del_failed"), {
            title: this.$i18n.t("mesvols.TITLE_MSG_modal"),
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger",
          });
        }
      );
    },
    flightToBook: function (f) {
      this.$bvToast.toast(this.$i18n.t("actions.be_patient"), {
        title: this.$i18n.t("mesvols.TITLE_MSG_modal"),
        toaster: "b-toaster-top-full",
        solid: true,
        variant: "info",
        "auto-hide-delay": 2000,
        "auto-hide": true,
      });
      let self = this;
      store.dispatch("flightToBook", f).then(
        // eslint-disable-next-line no-unused-vars
        (response) => {
          self.closeInfo();
          store.dispatch("loadFlights");
        },
        // eslint-disable-next-line
        (error) => {
          let msg = error.message;
          self.$bvToast.toast(
            this.$i18n.t("actions.to_logbook_failed") + ` ${msg}`,
            {
              title: this.$i18n.t("mesvols.TITLE_MSG_modal"),
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "danger",
            }
          );
        }
      );
    },
    flightToParagliding: function (f) {
      // let self = this;
      store.dispatch("uploadIgcToParagliding", { filename: f }).then(
        // eslint-disable-next-line no-unused-vars
        (response) => {},
        // eslint-disable-next-line
        (error) => {}
      );
    },
    flightInfo: function (f) {
      this.igc = null;
      this.currentF = null;
      let self = this;
      store.dispatch("infoFlight", f).then(
        (response) => {
          this.currentF = f;
          this.igc = response;
          var options = {
            // container: "#container",
            easing: "ease-in",
            offset: -60,
            force: false,
            cancelable: true,
            x: false,
            y: true,
          };
          window.setTimeout(function () {
            VueScrollTo.scrollTo("#infozone", 200, options);
          }, 1000);
        },
        // eslint-disable-next-line
        (error) => {
          let msg = error.message;
          self.$bvToast.toast(
            this.$i18n.t("actions.download_failed") + ` ${msg}`,
            {
              title: this.$i18n.t("mesvols.TITLE_MSG_modal"),
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "danger",
            }
          );
        }
      );
    },
    closeInfo: function () {
      this.igc = null;
      this.currentF = null;
    },
    getNbFlightForMonth: function (datamonth) {
      let nb = 0;
      const values = Object.values(datamonth.days);
      for (var i = 0; i < values.length; i++) {
        nb += values[i].flights.length;
      }
      return nb;
    },
    // eslint-disable-next-line no-unused-vars
    tabChanged: function (newTabIndex, prevTabIndex, bvEvent) {
      switch (newTabIndex) {
        case 0:
          store.dispatch("loadFlights");
          break;
        case 1:
          this.$refs.carnet.reset();
          break;
        case 2:
          this.$refs.sitelist.redrawMap();
          break;
      }
    },
    string2classname: function (name) {
      return name.replace(/[^a-z0-9]/g, function (s) {
        var c = s.charCodeAt(0);
        if (c == 32) return "-";
        if (c >= 65 && c <= 90) return "_" + s.toLowerCase();
        return "__" + ("000" + c.toString(16)).slice(-4);
      });
    },
  },
  computed: {
    ...mapGetters(["flights", "isLoading", "pg"]),

    flightsPerDays: function () {
      let lDays = {};
      Object.values(this.flights).forEach(function (f) {
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
    flightsMonth: function () {
      let lMonth = {};
      Object.values(this.flights).forEach(function (f) {
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
    flightDuration: function () {
      if (!this.igc) {
        return null;
      }

      var start = moment(this.igc.recordTime[0]); //todays date
      var end = moment(this.igc.recordTime.slice(-1).pop()); // another date

      let f = moment.utc(end.diff(start)).format("HH:mm:ss");
      return f;
    },
    flightStart: function () {
      var start = moment(this.igc.recordTime[0]);
      return start.format("HH:mm:ss");
    },
    flightStop: function () {
      var end = moment(this.igc.recordTime.slice(-1).pop());
      return end.format("HH:mm:ss");
    },
    flightDate: function () {
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
    altStart: function () {
      return this.igc.pressureAltitude[0];
    },
    altStop: function () {
      return this.igc.pressureAltitude.slice(-1).pop();
    },
    altMax: function () {
      return Math.max.apply(null, this.igc.pressureAltitude);
    },
    altMin: function () {
      return Math.min.apply(null, this.igc.pressureAltitude);
    },
    pgenabled: function () {
      return this.pg.enable && this.pg.login != "" && this.pg.password != "";
    },
  },
  mounted: function () {
    let self = this;

    store.dispatch("loadFlights").catch((error) => {
      self.$bvToast.toast(`Impossible de charger les vols. (` + error + ")", {
        title: "Mon vol",
        toaster: "b-toaster-top-right",
        solid: true,
        variant: "danger",
      });
    });
  },
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
