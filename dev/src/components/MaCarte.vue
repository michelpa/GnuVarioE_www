<template>
  <div>
    <div class="col-md-12">
      <div class="row">
        <div class="form-row form-group">
          <label class="col-sm-5 col-form-label">Couleur du tracé</label>
          <div class="col-sm-4">
            <color-picker :color="colorTrait" v-model="colorTrait" />
          </div>
        </div>
        <div class="form-row form-group">
          <label class="col-sm-5 col-form-label">Epaisseur du tracé</label>
          <div class="col-sm-4">
            <b-form-input v-model="epaisseurTrait" type="number" step="1"></b-form-input>
          </div>
        </div>
      </div>
    </div>
    <div id="mapid"></div>
    <div id="altchart">
      <apexchart width="100%" height="100%" type="area" :options="chartsOptions" :series="series"></apexchart>
    </div>
    {{markerLength}} / {{totalLength}} km
  </div>
</template>

<script>
import ColorPicker from "./ColorPicker";
const smooth = require("../lib/smooth.js");
export default {
  name: "MaCarte",
  components: { ColorPicker },
  props: {
    igc: Object,
    altMin: Number,
    altMax: Number
  },
  data: function() {
    return {
      env: process.env,
      macarte: null,
      currentF: null,
      midx: null,
      polyline: null,
      series: [],
      marker: null,
      colorTrait: "#138496",
      epaisseurTrait: 1,
      options: {
        chart: {
          id: "vuechart-example",
          type: "line"
        },
        fill: {
          type: "solid",
          opacity: [0.35, 1]
        },
        stroke: {
          show: true,
          curve: ["smooth", "smooth"],
          lineCap: "butt",
          colors: "#17A2B8",
          width: 2,
          dashArray: 0
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: "datetime",
          title: {
            text: "Heure"
          },
          axisTicks: {
            show: true,
            borderType: "solid",
            color: "#666",
            height: 10,
            offsetX: 0,
            offsetY: -5
          },

          labels: {
            show: true,
            // eslint-disable-next-line
            formatter: function(value, timestamp, index) {
              return moment(new Date(timestamp)).format("HH:mm:ss");
            }
          }
        },
        yaxis: [
          {
            forceNiceScale: true,
            min: this.altMin - 50,
            max: this.altMax + 50,
            labels: {
              show: true,
              // eslint-disable-next-line
              formatter: function(value, val, index) {
                return value + "m";
              }
            },
            title: {
              text: "Altitude"
            }
          },
          {
            opposite: true,
            labels: {
              show: true,
              // eslint-disable-next-line
              formatter: function(value, val, index) {
                return value + "km/h";
              }
            },
            title: {
              text: "Vitesse"
            }
          }
        ]
      }
    };
  },
  methods: {
    setMidx: function(idx) {
      this.midx = idx;
    },
    drawPolyline: function() {
      if (this.polyline) {
        this.polyline.remove();
      }
      this.polyline = L.polyline(this.igc.latLong, {
        color: this.colorTrait,
        weight: this.epaisseurTrait
      }).addTo(this.macarte);

      // this.polyline;
      // return p;
    }
  },
  computed: {
    chartsOptions: function() {
      let self = this;
      self.options.chart.events = {
        mouseMove: function(event, chartContext, config) {
          // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts.
          var index = config.dataPointIndex;
          self.setMidx(index);
        }
      };
      return this.options;
    },
    markerLength: function() {
      if (this.polyline) {
        var length = 0;
        var previousPoint;
        var t = this.polyline.getLatLngs();
        for (var i = 0; i < this.midx; i++) {
          if (previousPoint) {
            length += previousPoint.distanceTo(t[i]);
          }
          previousPoint = t[i];
        }
        return Math.round(length, 3) / 1000;
      } else {
        return 0;
      }
    },
    totalLength: function() {
      if (this.polyline) {
        var length = 0;
        var previousPoint;

        this.polyline.getLatLngs().forEach(function(latLng) {
          if (previousPoint) {
            length += previousPoint.distanceTo(latLng);
          }
          previousPoint = latLng;
        });
        return Math.round(length, 3) / 1000;
      } else {
        return 0;
      }
    }
  },
  watch: {
    midx: function(newidx, oldidx) {
      if (this.marker) {
        if (newidx != oldidx && newidx > 0) {
          this.marker.setLatLng(this.igc.latLong[newidx]);
        } else {
          this.marker.setLatLng(this.igc.latLong[0]);
        }
      }
    },
    colorTrait(val) {
      if (val) {
        this.drawPolyline();
      }
    },
    epaisseurTrait(val) {
      if (val) {
        this.drawPolyline();
      }
    },
  },
  mounted() {
    var OpenTopoMap = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 17,
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      }
    );

    var OpenStreetMap = L.tileLayer(
      "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
      {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution:
          'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
      }
    );

    var GeoportailFrance_orthos = L.tileLayer(
      "https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
      {
        attribution:
          '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
        bounds: [
          [-75, -180],
          [81, 180]
        ],
        minZoom: 2,
        maxZoom: 19,
        apikey: "choisirgeoportail",
        format: "image/jpeg",
        style: "normal"
      }
    );

    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    this.macarte = L.map("mapid", { layers: [OpenStreetMap] });

    var baseMaps = {
      OpenStreetMap: OpenStreetMap,
      OpenTopoMap: OpenTopoMap,
      GeoportailFrance: GeoportailFrance_orthos
    };

    L.control.layers(baseMaps).addTo(this.macarte);

    let self = this;

    //this.polyline =
    this.drawPolyline();

    //zoom the map to the polyline
    this.macarte.fitBounds(this.polyline.getBounds());

    this.marker = L.marker(this.igc.latLong[0]);
    this.marker.addTo(this.macarte);

    //les données pour le graph altitude
    let da = self.igc.gpsAltitude.map((a, i) => [
      self.igc.recordTime[i].getTime(),
      a
    ]);

    //les données pour le graph vitesse
    let nbVal = self.igc.latLong.length;
    let speed = [];
    for (var i = 1; i < nbVal; i++) {
      var dist = distance(
        self.igc.latLong[i - 1][0],
        self.igc.latLong[i - 1][1],
        self.igc.latLong[i][0],
        self.igc.latLong[i][1]
      );
      var temps =
        (self.igc.recordTime[i].getTime() -
          self.igc.recordTime[i - 1].getTime()) /
        1000 /
        3600;

      var sp = (dist / temps).toFixed(2);

      speed.push([self.igc.recordTime[i - 1].getTime(), sp]);
    }
    speed.push([self.igc.recordTime[nbVal - 1].getTime(), sp]);
    const windowSize = 2;
    const getter = item => parseFloat(item[1]);
    const setter = (item, itemSomoothed) => [item[0], itemSomoothed.toFixed(2)];
    const arrSmoothed = smooth(speed, windowSize, getter, setter);

    this.series = [
      {
        name: "altitude",
        data: da,
        type: "area"
      },
      {
        name: "vitesse",
        data: arrSmoothed
        //type: "line"
      }
    ];
  }
};
function distance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#mapid {
  width: 100%;
  padding-top: 56.25%;
  margin-bottom: 5px;
}

#altchart {
  width: 100%;
  height: 200px;
}
.form-row {
  color: #212529;
}
</style>