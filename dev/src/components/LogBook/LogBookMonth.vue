<template>
  <div role="tablist">
    <b-card
      no-body
      class="mb-1"
      v-for="month in orderBy(dataMonth, 'gr', -1)"
      :key="month.gr"
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
          variant="primary"
          @click="collapseClicked('M-' + month.gr)"
          :class="month.collapseShown ? null : 'collapsed'"
        >
          <span class="when-opened float-left">
            <i class="fa fa-chevron-down"></i>
          </span>
          <span class="when-closed float-left">
            <i class="fa fa-chevron-right"></i>
          </span>
          <strong>{{ [month.gr, "YYYYMM"] | moment("MMMM YYYY") }}</strong>
          ({{ month.nf }}
          {{ $t("flights.FLIGHTS") | pluralize(month.nf_flights) }},
          {{ month.du }})
        </b-button>
      </b-card-header>
      <b-collapse
        v-if="bddflightsM[month.gr]"
        :id="'M-' + month.gr"
        zaccordion="my-accordion-month"
        role="tabpanel"
      >
        <log-book-day :month="month.gr"> </log-book-day>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { collapseMixin } from "./collapseMixin";
import LogBookDay from "./LogBookDay";
export default {
  name: "LogBookMonth",
  components: { LogBookDay },
  props: {
    year: String,
  },
  mixins: [collapseMixin, Vue2Filters.mixin],
  data: function () {
    return {};
  },
  computed: {
    ...mapState("logbook", {
      bddflightsshortY: "bddflightsshortY",
      bddflightsshortM: "bddflightsshortM",
      bddflightsM: "bddflightsM",
    }),
    ...mapGetters("logbook", {
      totalFlightNumber: "totalFlightNumber",
      totalFlightTime: "totalFlightTime",
      maxYear: "maxYear",
      years: "years",
    }),
    dataMonth: function () {
      return Object.values(this.bddflightsshortM[this.year]);
    },
  },
  methods: {},
  mounted: function () {},
};
</script>

<style scoped>
</style>