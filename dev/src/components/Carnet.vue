 <template>
  <div>
    <div v-if="parsedData.length > 0">
      <portal-print v-model="openpapier" :bddflights="parsedData">
        <!-- I appear in a new window! -->
      </portal-print>
    </div>
    <flightform
      :show="showPopupFlight"
      @flightClosed="showPopupFlight = false"
      :flight="currentFlight"
    ></flightform>
    <visu
      :show="showPopupVisu"
      @visuClosed="showPopupVisu = false"
      :igc="currentIgc"
      :flight="currentFlight"
    ></visu>
    <div v-if="nbFlights > 0">
      <b-card-group deck>
        <b-card
          bg-variant="primary"
          text-variant="white"
          :header="$t('carnet.VOLS')"
          header-tag="h3"
          class="text-center"
        >
          <b-card-text class="topstat"
            >{{ nbFlights }} {{ $t("flights.FLIGHTS") | pluralize(nbFlights) }}
          </b-card-text>
          <b-card-text>
            <em
              >{{ $t("carnet.after_date") }}
              {{ minDate | moment("DD/MM/YYYY") }}</em
            >
          </b-card-text>
        </b-card>

        <b-card
          bg-variant="secondary"
          text-variant="outline-secondary"
          :header="$t('carnet.total_duration')"
          header-tag="h3"
          class="text-center"
        >
          <b-card-text class="topstat">{{ totalDuration }}</b-card-text>
          <b-card-text>
            <em
              >{{ $t("carnet.after_date") }}
              {{ minDate | moment("DD/MM/YYYY") }}</em
            >
          </b-card-text>
        </b-card>

        <b-card
          bg-variant="primary"
          text-variant="white"
          :header="$t('carnet.sites')"
          header-tag="h3"
          class="text-center"
        >
          <b-card-text class="topstat">{{ sitesIds.length }}</b-card-text>
          <b-card-text>
            <em
              >{{ $t("carnet.after_date") }}
              {{ minDate | moment("DD/MM/YYYY") }}</em
            >
          </b-card-text>
        </b-card>
      </b-card-group>
      <!-- {{bddflights.data}} -->
      <div class="row">
        <div class="col-md-12">
          <b-card>
            <b-card-header header-tag="header" class="p-1" role="tab">
              <div class="float-right">
                <button class="btn btn-primary btn-xs" @click="addFlightFree()">
                  {{ $t("carnet.add_flight") }}</button
                >&nbsp;&nbsp;
                <button class="btn btn-primary btn-xs" @click="print()">
                  <i class="fa fa-print"></i>
                </button>
                &nbsp;&nbsp;
                <button
                  class="btn btn-primary btn-xs"
                  @click="loadMore()"
                  v-if="isLoadMore"
                >
                  Charger plus
                  <i class="fa fa-plus"></i>
                </button>
              </div>
              <h3>{{ $t("flights.MY_LOGBOOK") }}</h3>
            </b-card-header>
            <div class="bg-default" v-if="parsedData.length > 0">
              <div role="tablist">
                <b-card
                  no-body
                  class="mb-1"
                  v-for="(data, idxyear) in parsedData"
                  :key="data.year"
                >
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button
                      block
                      href="#"
                      v-b-toggle="'' + data.year"
                      variant="outline-primary"
                    >
                      <span class="when-opened float-left">
                        <i class="fa fa-chevron-down"></i>
                      </span>
                      <span class="when-closed float-left">
                        <i class="fa fa-chevron-right"></i>
                      </span>
                      <strong>{{ data.year }}</strong>
                      ({{ data.nb_flights }}
                      {{ $t("flights.FLIGHTS") | pluralize(data.nb_flights) }},
                      {{ data.duration }}, {{ data.sites_id.length }}
                      {{ $t("carnet.site") | pluralize(data.sites_id.length) }}
                      )
                    </b-button>
                  </b-card-header>
                  <b-collapse
                    :id="'' + data.year"
                    zaccordion="my-accordion-year"
                    role="tabpanel"
                    :visible="idxyear === 0"
                  >
                    <b-card
                      no-body
                      class="mb-1"
                      v-for="(datamonth, idxmonth) in data.months"
                      :key="datamonth.month"
                    >
                      <b-card-header
                        header-tag="header"
                        class="p-1"
                        role="tab"
                        style="margin-left: 10px"
                      >
                        <b-button
                          block
                          href="#"
                          v-b-toggle="datamonth.month"
                          variant="primary"
                        >
                          <span class="when-opened float-left">
                            <i class="fa fa-chevron-down"></i>
                          </span>
                          <span class="when-closed float-left">
                            <i class="fa fa-chevron-right"></i>
                          </span>
                          <strong>{{
                            [datamonth.month, "YYYY-MM"] | moment("MMMM YYYY")
                          }}</strong>
                          ({{ datamonth.nb_flights }}
                          {{
                            $t("flights.FLIGHTS")
                              | pluralize(datamonth.nb_flights)
                          }}, {{ datamonth.duration }},
                          {{ datamonth.sites_id.length }}
                          {{
                            $t("carnet.site")
                              | pluralize(datamonth.sites_id.length)
                          }})
                        </b-button>
                      </b-card-header>
                      <b-collapse
                        :id="'' + datamonth.month"
                        zaccordion="my-accordion-month"
                        role="tabpanel"
                        :visible="idxmonth === 0"
                      >
                        <b-card
                          no-body
                          class="mb-1 card-day"
                          v-for="dataday in datamonth.days"
                          :key="dataday.day"
                        >
                          <b-card-header
                            header-tag="header"
                            class="p-1"
                            role="tab"
                            style="margin-left: 20px"
                          >
                            <b-button
                              block
                              href="#"
                              v-b-toggle="dataday.day"
                              variant="info"
                            >
                              <span class="when-opened float-left">
                                <i class="fa fa-chevron-down"></i>
                              </span>
                              <span class="when-closed float-left">
                                <i class="fa fa-chevron-right"></i>
                              </span>
                              <strong>{{
                                dataday.day | moment("dddd D MMMM")
                              }}</strong>
                              ({{ dataday.nb_flights }}
                              {{
                                $t("flights.FLIGHTS")
                                  | pluralize(dataday.nb_flights)
                              }}, {{ dataday.duration }},
                              {{ dataday.sites_id.length }}
                              {{
                                $t("carnet.site")
                                  | pluralize(dataday.sites_id.length)
                              }}
                              )
                            </b-button>
                          </b-card-header>
                          <b-collapse
                            :id="dataday.day"
                            zaccordion="my-accordion-day"
                            role="tabpanel"
                            :visible="true"
                          >
                            <b-card-body>
                              <div
                                class="un-vol bg-light"
                                v-for="f in dataday.flights"
                                :key="f.id"
                              >
                                <div class="row">
                                  <!-- <div class="col-md-3 miniature">
                                    <img
                                      v-if="f.filename"
                                      src="https://via.placeholder.com/320x240"
                                      alt="trace"
                                      class="img-thumbnail"
                                    />
                                  </div>-->
                                  <div class="col-md-9">
                                    <div class="row">
                                      <div class="col-md-12">
                                        <div class="float-right">
                                          <div class="btns">
                                            <button
                                              v-if="pgenabled"
                                              class="btn btn-sm btn-primary"
                                              @click="
                                                flightToParagliding(f.filename)
                                              "
                                              v-b-tooltip.hover="{
                                                delay: {
                                                  show: 1000,
                                                  hide: 50,
                                                },
                                              }"
                                              title="Téléversement vers paraglidinglogbook.com"
                                            >
                                              <i class="fa fa-book"></i></button
                                            >&nbsp;
                                            <button
                                              class="btn btn-sm btn-primary"
                                              @click="edit(f)"
                                              v-b-tooltip.hover="{
                                                delay: { show: 1000, hide: 50 },
                                              }"
                                              :title="$t('actions.edit')"
                                            >
                                              <i class="fa fa-pen"></i>
                                            </button>
                                            &nbsp;
                                            <!-- <button
                                              class="btn btn-sm btn-primary"
                                              @click="flightToBook(f.name)"
                                              v-b-tooltip.hover="{delay:  { show: 1000, hide: 50 } }"
                                              title="Placer dans mon carnet"
                                            >
                                              <i class="fa fa-book-open"></i>
                                            </button>
                                            &nbsp;-->

                                            <button
                                              v-if="f.filename"
                                              class="btn btn-sm btn-info"
                                              @click="flightInfo(f)"
                                              v-b-tooltip.hover="{
                                                delay: { show: 1000, hide: 50 },
                                              }"
                                              :title="$t('actions.info')"
                                            >
                                              <i class="fa fa-info-circle"></i>
                                            </button>
                                            &nbsp;
                                            <button
                                              v-if="f.filename"
                                              class="btn btn-sm btn-success"
                                              @click="downloadFromSD(f)"
                                              v-b-tooltip.hover="{
                                                delay: { show: 1000, hide: 50 },
                                              }"
                                              :title="$t('actions.download')"
                                            >
                                              <i
                                                class="fa fa-arrow-alt-circle-down"
                                              ></i>
                                            </button>
                                            &nbsp;
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
                                                @click="deleteFromBDD(f)"
                                                v-b-tooltip.hover="{
                                                  delay: {
                                                    show: 1000,
                                                    hide: 50,
                                                  },
                                                }"
                                                :title="$t('actions.delete')"
                                              >
                                                <i class="fa fa-trash-alt"></i>
                                              </button>
                                            </click-confirm>
                                          </div>
                                        </div>
                                        <h5>{{ f.filename }}</h5>
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col-md-4">
                                        <table class="table table-sm">
                                          <tbody>
                                            <tr>
                                              <td>{{ $t("carnet.Site") }}</td>
                                              <th>{{ f.site_lib }}</th>
                                            </tr>
                                            <tr>
                                              <td>{{ $t("carnet.Pilote") }}</td>
                                              <th>{{ f.pilot }}</th>
                                            </tr>
                                            <tr>
                                              <td>{{ $t("carnet.Voile") }}</td>
                                              <th>{{ f.wing }}</th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <div class="col-md-4">
                                        <table class="table table-sm">
                                          <tbody>
                                            <tr>
                                              <td>
                                                {{ $t("carnet.Start_time") }}
                                              </td>
                                              <th>{{ f.start_flight_time }}</th>
                                            </tr>
                                            <tr>
                                              <td>
                                                {{ $t("carnet.End_time") }}
                                              </td>
                                              <th>{{ f.end_flight_time }}</th>
                                            </tr>
                                            <tr>
                                              <td>
                                                {{ $t("carnet.Duration") }}
                                              </td>
                                              <th>{{ f.duration }}</th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <div class="col-md-4">
                                        <table class="table table-sm">
                                          <tbody>
                                            <tr>
                                              <td>{{ $t("carnet.Alt") }}</td>
                                              <th>
                                                {{ f.start_height }}m /
                                                {{ f.end_height }}m
                                              </th>
                                            </tr>
                                            <tr>
                                              <td>
                                                {{ $t("carnet.Alt_min") }}
                                              </td>
                                              <th>{{ f.min_height }}m</th>
                                            </tr>
                                            <tr>
                                              <td>
                                                {{ $t("carnet.Alt_max") }}
                                              </td>
                                              <th>{{ f.max_height }}m</th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div
                                      class="comments"
                                      v-html="$options.filters.nl2br(f.comment)"
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </b-card-body>
                          </b-collapse>
                        </b-card>
                      </b-collapse>
                    </b-card>
                  </b-collapse>
                </b-card>
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapGetters } from "vuex";
import Flightform from "./Flightform";
import Visu from "./Visu";
import PortalPrint from "./PortalPrint";
// eslint-disable-next-line no-unused-vars
import store from "@/store";

export default {
  name: "Carnet",
  components: { Flightform, Visu, PortalPrint },
  props: {},
  data: function () {
    return {
      currentFlight: {},
      showPopupFlight: false,
      showPopupVisu: false,
      currentIgc: null,
      openpapier: false,
    };
  },

  computed: {
    ...mapGetters([
      "bddflights",
      "isLoadMore",
      "pg",
      "nbFlights",
      "minDate",
      "totalDuration",
      "sitesIds",
      "parsedData",
    ]),
    pgenabled: function () {
      return this.pg.enable && this.pg.login != "" && this.pg.password != "";
    },
  },
  methods: {
    edit: function (flight) {
      this.currentFlight = Object.assign({}, flight);
      this.showPopupFlight = true;
    },
    flightInfo: function (flight) {
      if (!flight.filename) {
        self.$bvToast.toast(this.$i18n.t("carnet.no_trace"), {
          title: this.$i18n.t("flights.MY_LOGBOOK"),
          toaster: "b-toaster-top-right",
          solid: true,
          variant: "danger",
        });
      }
      let self = this;
      store.dispatch("infoFlightParsed", flight.filename).then(
        (response) => {
          self.showPopupVisu = true;
          self.currentIgc = response;
          self.currentFlight = flight;
        },
        (error) => {
          self.showPopupVisu = false;
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
    downloadFromSD: function (flight) {
      let self = this;
      store
        .dispatch("downloadFlight", { filename: flight.filename, parsed: true })
        .then(
          (response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", flight.filename);
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
    addFlightFree: function () {
      this.currentFlight = {};
      this.showPopupFlight = true;
    },
    deleteFromBDD: function (flight) {
      let self = this;
      store.dispatch("deleteFlightParsed", flight).then(
        // eslint-disable-next-line no-unused-vars
        (response) => {
          store.dispatch("loadBddFlights", { reload: true });
        },
        (error) => {
          let msg = error.message;
          self.$bvToast.toast(
            this.$i18n.t("actions.del_failed_fly") + ` ${msg}`,
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
    print: function () {
      this.openpapier = true;
    },
    loadMore: function () {
      store.dispatch("loadBddFlights", {});
    },
    reset: function () {
      store.dispatch("loadBddFlights", { reload: true });
    },
    flightToParagliding: function (f) {
      // let self = this;
      store
        .dispatch("uploadIgcToParagliding", { filename: f, parsed: true })
        .then(
          // eslint-disable-next-line no-unused-vars
          (response) => {},
          // eslint-disable-next-line
          (error) => {}
        );
    },
  },
  mounted: function () {
    // let self = this;
    // store.dispatch("loadBddFlights").catch(error => {
    //   self.$bvToast.toast(`Impossible de charger les vols. (` + error + ")", {
    //     title: "Mon vol",
    //     toaster: "b-toaster-top-right",
    //     solid: true,
    //     variant: "danger"
    //   });
    // });
  },
};
</script>

<style scoped>
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}

.topstat {
  font-size: 1.5em;
  font-weight: bold;
}

.un-vol {
  padding: 5px 0;
  margin-bottom: 10px;
}
.miniature {
  margin-top: auto;
  margin-bottom: auto;
}
.btns div {
  display: inline;
}
.comments {
  border: 1px solid #ccc;
  padding: 5px;
  min-height: 100%;
  text-align: left;
}
.card-day {
  border-left: 4px solid var(--cyan);
}
</style>