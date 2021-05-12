<template>
  <div role="tablist">
    <b-card
      no-body
      class="mb-1 card-day"
      v-for="(data, key) in days"
      :key="key"
    >
      <b-card-header
        header-tag="header"
        class="p-1"
        role="tab"
        style="margin-left: 10px"
      >
        <b-button block href="#" variant="info" v-b-toggle="'D-' + data.day">
          <!-- @click="collapseClicked('D-' + data.day)"
          :class="month.collapseShown ? null : 'collapsed'" -->
          <span class="when-opened float-left">
            <i class="fa fa-chevron-down"></i>
          </span>
          <span class="when-closed float-left">
            <i class="fa fa-chevron-right"></i>
          </span>
          <strong>{{ data.day | moment("dddd D MMMM") }}</strong>
          <!-- {{data}} -->
          ({{ data.nb_flights }}
          {{ $t("flights.FLIGHTS") | pluralize(data.nb_flights) }},
          {{ data.duration }},
          {{ data.sites_id.length }}
          {{ $t("carnet.site") | pluralize(data.sites_id.length) }}
          )
          <!-- ({{ month.nf }}
          {{ $t("flights.FLIGHTS") | pluralize(month.nf_flights) }},
          {{ month.du }}) -->
        </b-button>
      </b-card-header>
      <b-collapse
        :id="'D-' + data.day"
        accordion="my-accordion-day"
        role="tabpanel"
        :visible="true"
      >
        <b-card-body>
          <div class="un-vol bg-light" v-for="f in data.flights" :key="f.id">
            <log-book-flight :f="f"></log-book-flight>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { collapseMixin } from "./collapseMixin";
import LogBookFlight from "./LogBookFlight";
export default {
  name: "LogBookDay",
  components: { LogBookFlight },
  props: {
    month: String,
  },
  mixins: [collapseMixin],
  data: function () {
    return {};
  },
  computed: {
    ...mapState("logbook", {
      bddflightsshortY: "bddflightsshortY",
      bddflightsshortM: "bddflightsshortM",
      bddflightsM: "bddflightsM",
    }),
    ...mapGetters(["isdropboxenabled"]),
    ...mapGetters("logbook", {
      totalFlightNumber: "totalFlightNumber",
      totalFlightTime: "totalFlightTime",
      maxYear: "maxYear",
      years: "years",
      daysForMonth: "daysForMonth",
    }),
    days: function () {
      return this.daysForMonth(this.month);
    },
  },
  methods: {},
  mounted: function () {},
};
</script>

<style scoped>
.card-day {
  border-left: 4px solid var(--cyan);
}
</style>