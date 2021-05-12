<template>
  <b-card-group deck>
    <b-card
      bg-variant="secondary"
      :header="$t('carnet.VOLS')"
      header-tag="h3"
      class="text-center"
    >
      <b-card-text class="topstat">
        {{ totalFlightNumber }}
        {{ $t("flights.FLIGHTS") | pluralize(totalFlightNumber) }}
      </b-card-text>
      <b-card-text>
        <apexchart
          v-if="bddflightsshortY"
          width="100%"
          height="100%"
          type="bar"
          :options="chartsOptionsFlight"
          :series="seriesFlights"
        ></apexchart>
      </b-card-text>
    </b-card>

    <b-card
      bg-variant="secondary"
      :header="$t('carnet.total_duration')"
      header-tag="h3"
      class="text-center"
    >
      <b-card-text class="topstat">{{ totalFlightTime }}</b-card-text>
      <b-card-text v-if="bddflightsshortY">
        <apexchart
          width="100%"
          height="200px"
          type="pie"
          :options="chartsOptionsTimes"
          :series="seriesTimes"
        ></apexchart>
      </b-card-text>
    </b-card>
  </b-card-group>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "LogBookHeader",
  components: {},
  props: {},
  data: function () {
    return {
      seriesFlights: [
        {
          type: "column",
          name: "nbf",
          data: [],
        },
      ],
      chartsOptionsFlight: {
        chart: {
          id: "vuechart-nby",
          type: "column",
        },
        tooltip: {
          enabled: false,
        },
        xaxis: {
          categories: [],
        },
        // colors: ["#ccc"],
        // fill: {
        //   type: "solid",
        //   opacity: [1],
        // },
      },
      seriesTimes: [],
      chartsOptionsTimes: {
        chart: {
          //    id: "vuechart-time",
          type: "pie",
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: (value) => {
              return new Date(value * 1000)
                .toUTCString()
                .match(/(\d\d:\d\d:\d\d)/)[0];
            },
          },
        },
        labels: [],
        // xaxis: {
        //   categories: [],
        // },
        // colors: ["#ccc"],
        // fill: {
        //   type: "solid",
        //   opacity: [1],
        // },
      },
    };
  },
  watch: {
    bddflightsshortY: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue != oldValue) {
          this.chartsOptionsFlight.xaxis.categories = Object.values(
            newValue
          ).map((e) => e.gr);
          this.seriesFlights = [
            {
              data: Object.values(newValue).map((e) => e.nf),
            },
          ];

          this.chartsOptionsTimes.labels = Object.values(newValue).map(
            (e) => e.gr
          );
          this.seriesTimes = Object.values(newValue).map((e) =>
            moment.duration(e.du).asSeconds()
          );
        }
      },
    },
  },
  computed: {
    ...mapState("logbook", {
      bddflightsshortY: "bddflightsshortY",
    }),
    ...mapGetters("logbook", {
      totalFlightNumber: "totalFlightNumber",
      totalFlightTime: "totalFlightTime",
    }),
  },
};
</script>

<style scoped>
.topstat {
  font-size: 1.5em;
  font-weight: bold;
}
</style>