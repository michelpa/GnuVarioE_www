<template>
  <div role="tablist">
    <b-card no-body class="mb-1" v-for="year in years" :key="year">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button
          block
          href="#"
          variant="outline-primary"
          @click="collapseClicked('Y-' + year)"
          :class="bddflightsshortY[year].collapseShown ? null : 'collapsed'"
        >
          <span class="when-opened float-left">
            <i class="fa fa-chevron-down"></i>
          </span>
          <span class="when-closed float-left">
            <i class="fa fa-chevron-right"></i>
          </span>
          <h4>
            <b-badge variant="info">{{ year }}</b-badge>
            ({{ bddflightsshortY[year].nf }}
            {{ $t("flights.FLIGHTS") | pluralize(bddflightsshortY[year].nf) }},
            {{ bddflightsshortY[year].du }}
            <!-- {{ data.sites_id.length }} -->
            <!-- {{ $t("carnet.site") | pluralize(data.sites_id.length) }} -->
            )
          </h4>
        </b-button>
      </b-card-header>
      <b-collapse
        v-if="bddflightsshortM[year]"
        :id="'Y-' + year"
        zaccordion="my-accordion-year"
        role="tabpanel"
        class="colll"
      >
        <log-book-month :year="year"></log-book-month>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { collapseMixin } from "./collapseMixin";
import LogBookMonth from "./LogBookMonth";

export default {
  name: "LogBookYear",
  components: { LogBookMonth },
  props: {},
  mixins: [collapseMixin],
  data: function () {
    return {};
  },
  computed: {
    ...mapState("logbook", {
      bddflightsshortY: "bddflightsshortY",
      bddflightsshortM: "bddflightsshortM",
    }),
    ...mapGetters("logbook", {
      totalFlightNumber: "totalFlightNumber",
      totalFlightTime: "totalFlightTime",
      years: "years",
    }),
  },
  methods: {},
  mounted: function () {},
};
</script>

<style scoped>
.when-opened,
.when-closed {
  padding-top: 7px;
}
</style>