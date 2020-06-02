 <template>
  <div>
    <flightform
      :show="showPopupFlight"
      @flightClosed="showPopupFlight=false"
      :flight="currentFlight"
    ></flightform>
    <visu
      :show="showPopupVisu"
      @visuClosed="showPopupVisu=false"
      :igc="currentIgc"
      :flight="currentFlight"
    ></visu>
    <div v-if="bddflights">
      <b-card-group deck>
        <b-card
          bg-variant="primary"
          text-variant="outline-primary"
          header="Vols"
          header-tag="h3"
          class="text-center"
        >
          <b-card-text class="topstat">{{ bddflights.all.nb_flights }} vols</b-card-text>
        </b-card>

        <b-card
          bg-variant="secondary"
          text-variant="outline-secondary"
          header="Durée cumulée"
          header-tag="h3"
          class="text-center"
        >
          <b-card-text class="topstat">{{ bddflights.all.duration }}</b-card-text>
        </b-card>

        <b-card
          bg-variant="primary"
          text-variant="outline-primary"
          header="Sites"
          header-tag="h3"
          class="text-center"
        >
          <b-card-text class="topstat">{{ bddflights.all.sites_id.length }}</b-card-text>
        </b-card>
      </b-card-group>
      <!-- {{bddflights.data}} -->
      <div class="row">
        <div class="col-md-12">
          <b-card>
            <b-card-header header-tag="header" class="p-1" role="tab">
              Mes vols du carnet
              <div class="float-right">
                <button
                  class="btn btn-primary btn-xs"
                  @click="addFlightFree()"
                >Ajouter un vol (hors IGC)</button>
              </div>
              <div class="clearfix"></div>
            </b-card-header>
            <div class="bg-default">
              <div role="tablist">
                <b-card
                  no-body
                  class="mb-1"
                  v-for="(data, idxyear) in bddflights.data"
                  :key="data.year"
                >
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block href="#" v-b-toggle="'' + data.year" variant="outline-primary">
                      <span class="when-opened float-left">
                        <i class="fa fa-chevron-down"></i>
                      </span>
                      <span class="when-closed float-left">
                        <i class="fa fa-chevron-right"></i>
                      </span>
                      <strong>{{ data.year }}</strong>
                      ({{ data.nb_flights }} {{ $t('flights.FLIGHTS') | pluralize( data.nb_flights)}}, {{ data.duration }}, {{data.sites_id.length }} {{"site"| pluralize( data.sites_id.length)}} )
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
                        style="margin-left: 10px;"
                      >
                        <b-button block href="#" v-b-toggle="datamonth.month" variant="primary">
                          <span class="when-opened float-left">
                            <i class="fa fa-chevron-down"></i>
                          </span>
                          <span class="when-closed float-left">
                            <i class="fa fa-chevron-right"></i>
                          </span>
                          <strong>{{ [datamonth.month + data.year, "MMYYYY"]| moment('MMMM YYYY') }}</strong>
                          ({{ datamonth.nb_flights }} {{ $t('flights.FLIGHTS') | pluralize( datamonth.nb_flights)}}, {{ datamonth.duration }}, {{datamonth.sites_id.length }} {{"site"| pluralize( datamonth.sites_id.length)}})
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
                          class="mb-1"
                          v-for="dataday in datamonth.days"
                          :key="dataday.day"
                        >
                          <b-card-header
                            header-tag="header"
                            class="p-1"
                            role="tab"
                            style="margin-left: 20px;"
                          >
                            <b-button block href="#" v-b-toggle="dataday.day" variant="info">
                              <span class="when-opened float-left">
                                <i class="fa fa-chevron-down"></i>
                              </span>
                              <span class="when-closed float-left">
                                <i class="fa fa-chevron-right"></i>
                              </span>
                              <strong>{{dataday.day | moment('dddd D MMMM')}}</strong>
                              ({{ dataday.nb_flights }} {{ $t('flights.FLIGHTS') | pluralize( dataday.nb_flights)}}, {{ dataday.duration }}, {{dataday.sites_id.length }} {{"site"| pluralize( dataday.sites_id.length)}} )
                            </b-button>
                          </b-card-header>
                          <b-collapse
                            :id="dataday.day"
                            zaccordion="my-accordion-day"
                            role="tabpanel"
                            :visible="true"
                          >
                            <b-card-body>
                              <div class="un-vol bg-light" v-for="f in dataday.flights" :key="f.id">
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
                                              class="btn btn-sm btn-primary"
                                              @click="edit(f)"
                                              v-b-tooltip.hover="{delay:  { show: 1000, hide: 50 } }"
                                              title="Editer"
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
                                              v-b-tooltip.hover="{delay:  { show: 1000, hide: 50 } }"
                                              title="Info"
                                            >
                                              <i class="fa fa-info-circle"></i>
                                            </button>
                                            &nbsp;
                                            <click-confirm
                                              placement="bottom"
                                              button-size="sm"
                                              yes-class="btn btn-success"
                                              no-class="btn btn-danger"
                                              :messages="{title: 'Êtes-vous sûr?', yes: 'Oui', no: 'Non'}"
                                            >
                                              <button
                                                class="btn btn-sm btn-danger"
                                                @click="deleteFromBDD(f)"
                                                v-b-tooltip.hover="{delay: { show: 1000, hide: 50 }}"
                                                title="Supprimer"
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
                                              <td>Site</td>
                                              <th>{{ f.site_lib }}</th>
                                            </tr>
                                            <tr>
                                              <td>Pilote</td>
                                              <th>{{ f.pilot }}</th>
                                            </tr>
                                            <tr>
                                              <td>Voile</td>
                                              <th>{{ f.wing }}</th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <div class="col-md-4">
                                        <table class="table table-sm">
                                          <tbody>
                                            <tr>
                                              <td>Heure de début</td>
                                              <th>{{ f.start_flight_time }}</th>
                                            </tr>
                                            <tr>
                                              <td>Heure de fin</td>
                                              <th>{{ f.end_flight_time }}</th>
                                            </tr>
                                            <tr>
                                              <td>Durée</td>
                                              <th>{{ f.duration }}</th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <div class="col-md-4">
                                        <table class="table table-sm">
                                          <tbody>
                                            <tr>
                                              <td>Alt. départ / Alt. fin</td>
                                              <th>{{ f.start_height }}m / {{ f.end_height }}m</th>
                                            </tr>
                                            <tr>
                                              <td>Altitude mini</td>
                                              <th>{{ f.min_height }}m</th>
                                            </tr>
                                            <tr>
                                              <td>Altitude maxi</td>
                                              <th>{{ f.max_height }}m</th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="comments">
                                      <pre>{{ f.comment }}</pre>
                                    </div>
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
// eslint-disable-next-line no-unused-vars
import store from "@/store";

export default {
  name: "Carnet",
  components: { Flightform, Visu },
  props: {},
  data: function() {
    return {
      currentFlight: {},
      showPopupFlight: false,
      showPopupVisu: false,
      currentIgc: null
    };
  },

  computed: {
    ...mapGetters(["bddflights"])
  },
  methods: {
    edit: function(flight) {
      this.currentFlight = Object.assign({}, flight);
      this.showPopupFlight = true;
    },
    flightInfo: function(flight) {
      if (!flight.filename) {
        self.$bvToast.toast("Pas de trace pour ce vol", {
          title: "Mon carnet",
          toaster: "b-toaster-top-right",
          solid: true,
          variant: "danger"
        });
      }
      let self = this;
      store.dispatch("infoFlightParsed", flight.filename).then(
        response => {
          self.showPopupVisu = true;
          self.currentIgc = response;
          self.currentFlight = flight;
        },
        error => {
          self.showPopupVisu = false;
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
    addFlightFree: function() {
      this.currentFlight = {};
      this.showPopupFlight = true;
    },
    deleteFromBDD: function(flight) {
      let self = this;
      store.dispatch("deleteFlightParsed", flight).then(
        // eslint-disable-next-line no-unused-vars
        response => {
          store.dispatch("loadBddFlights");
        },
        error => {
          let msg = error.message;
          self.$bvToast.toast(`Echec de la suppression du vol. ${msg}`, {
            title: "Mon vol",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger"
          });
        }
      );
    }
  },
  mounted: function() {
    let self = this;
    store.dispatch("loadBddFlights").catch(error => {
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
}
</style>