 <template>
  <div>
    <flightform
      :show="showPopupFlight"
      @flightClosed="closePopupFlight"
      :flight="currentFlight"
    ></flightform>

    <visu
      :show="showPopupVisu"
      @visuClosed="closePopupFlightVisu"
      :igc="currentIgc"
      :flight="currentFlight"
    ></visu>
    <div v-if="totalFlightNumber > 0">
      <log-book-header></log-book-header>
      <div class="row">
        <div class="col-md-12">
          <b-card>
            <b-card-header header-tag="header" class="p-1" role="tab">
              <div class="float-right">
                <button class="btn btn-primary btn-xs" @click="addFlightFree()">
                  {{ $t("carnet.add_flight") }}</button
                >&nbsp;&nbsp;
                <!-- <button class="btn btn-primary btn-xs" @click="print()">
                  <i class="fa fa-print"></i>
                </button>
                &nbsp;&nbsp; -->
              </div>
              <h3>{{ $t("flights.MY_LOGBOOK") }}</h3>
            </b-card-header>
            <log-book-year> </log-book-year>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import LogBookHeader from "./LogBookHeader";
import LogBookYear from "./LogBookYear";
import Visu from "../Visu";
import Flightform from "../Flightform";
// import PortalPrint from "./PortalPrint";

export default {
  name: "LogBook",
  components: {
    LogBookHeader,
    LogBookYear,
    Visu,
    Flightform,
  },
  props: {},
  data: function () {
    return {};
  },
  computed: {
    ...mapState("logbook", {
      bddflightsshortM: "bddflightsshortM",
      bddflightsM: "bddflightsM",
      showPopupVisu: "showPopupVisu",
      currentIgc: "currentIgc",
      currentFlight: "currentFlight",
      showPopupFlight: "showPopupFlight",
    }),
    ...mapGetters("logbook", {
      totalFlightNumber: "totalFlightNumber",
      maxYear: "maxYear",
    }),
  },
  methods: {
    addFlightFree: function () {
      this.$store.commit("logbook/setCurrentFlight", {});
      this.$store.commit("logbook/setShowPopupFlight", true);
    },
    closePopupFlight: function () {
      this.$store.commit("logbook/setCurrentFlight", {});
      this.$store.commit("logbook/setShowPopupFlight", false);
    },
    closePopupFlightVisu: function () {
      this.$store.commit("logbook/setCurrentFlight", {});
      this.$store.commit("logbook/setCurrentIgc", null);
      this.$store.commit("logbook/setShowPopupVisu", false);
    },
  },
  mounted: function () {
    this.$store
      .dispatch("logbook/loadFlightsBddShort", { mode: "Y", parcel: "" })
      .then(() => {
        this.$store
          .dispatch("logbook/loadFlightsBddShort", {
            mode: "M",
            parcel: this.maxYear,
          })
          .then(() => {
            this.$store
              .dispatch("logbook/collapseToggleY", {
                year: this.maxYear,
              })
              .then(() => {
                this.$root.$emit("bv::toggle::collapse", "Y-" + this.maxYear);
              });
          });
      });
  },
};
</script>

<style scoped>
</style>