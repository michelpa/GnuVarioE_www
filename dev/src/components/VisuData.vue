
<template>
  <div>
    <b-modal
      id="modal-reglage"
      @ok="doSaveReglage"
      ref="modal"
      :title="$t('flights.MAP_SETTINGS')"
      cancel-title="OK"
      cancel-variant="info"
      :ok-title="$t('global.save')"
    >
      <div class="col-md-12">
        <div class="row">
          <div class="form-row form-group">
            <label class="col-sm-5 col-form-label">{{ $t('flights.TRACE_COLOR') }}</label>
            <div class="col-sm-4">
              <color-picker :color="colorTrait" v-model="colorTrait" />
            </div>
          </div>
          <div class="form-row form-group">
            <label class="col-sm-5 col-form-label">{{ $t('flights.TRACE_WIDTH') }}</label>
            <div class="col-sm-4">
              <b-form-input v-model="epaisseurTrait" type="number" step="1"></b-form-input>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <div id="mapid" ref="mapElement"></div>
    <div id="altchart">
      <apexchart width="100%" height="100%" type="area" :options="chartsOptions" :series="series"></apexchart>
    </div>
    <div class="text-center mb-2">{{markerLength}} / {{totalLength}} km</div>
    <div class="clearfix"></div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapGetters } from "vuex";
import ColorPicker from "./ColorPicker";
import store from "@/store";
const smooth = require("../lib/smooth.js");
export default {
  /* eslint-disable no-unused-vars */
  name: "VisuData",
  components: { ColorPicker },
  props: {
    show: { type: Boolean, default: false },
    igc: { type: Object, default: null },
    flight: { type: Object, default: null }
  },
  data: function() {
    return {
      macarte: null,
      midx: null,
      polyline: null,
      series: [],
      marker: null,
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
            min: this.flight.min_height - 50,
            max: this.flight.max_height + 50,
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
    showModalReglage: function() {
      this.$bvModal.show("modal-reglage");
    },
    doSaveReglage: function() {
      let self = this;
      store.dispatch("saveConfigWeb").then(
        // eslint-disable-next-line
        response => {
          store.dispatch("loadConfigWeb");
          self.$bvToast.toast("Préférences sauvegardées sur la carte SD.", {
            title: "Préférences",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "success"
          });
        },
        // eslint-disable-next-line
        error => {
          self.$bvToast.toast(`Echec de la sauvegarde des préférences.`, {
            title: "Préférences",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger"
          });
        }
      );
      return;
    },
    setMidx: function(idx) {
      this.midx = idx;
    },
    showModal: function() {
      this.$bvModal.show("modal-visu");
    },
    doCancel: function() {
      //   store.dispatch("loadConfigWeb");
    },
    doHidden: function() {
      this.$emit("visuClosed");
    },
    drawPolyline: function() {
      if (this.polyline) {
        this.polyline.remove();
      }
      this.polyline = L.polyline(this.igc.latLong, {
        color: this.colorTrait,
        weight: this.epaisseurTrait
      }).addTo(this.macarte);
    }
  },
  computed: {
    ...mapGetters(["configWeb"]),
    epaisseurTrait: {
      get() {
        if (this.configWeb.map != undefined) {
          return this.configWeb.map.trace.epaisseur;
        } else {
          return 1;
        }
      },
      set(value) {
        store.commit("updateConfigWeb", {
          property: "map.trace.epaisseur",
          with: value
        });
        this.drawPolyline();
      }
    },
    colorTrait: {
      get() {
        if (this.configWeb.map != undefined) {
          return this.configWeb.map.trace.color;
        } else {
          return "#fff";
        }
      },
      set(value) {
        store.commit("updateConfigWeb", {
          property: "map.trace.color",
          with: value
        });
        this.drawPolyline();
      }
    },
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
        return Math.round(length / 10) / 100;
      } else {
        return 0;
      }
    }
  },
  watch: {
    show: function(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.showModal();
      }
    },
    midx: function(newidx, oldidx) {
      if (this.marker) {
        if (newidx != oldidx && newidx > 0) {
          this.marker.setLatLng(this.igc.latLong[newidx]);
        } else {
          this.marker.setLatLng(this.igc.latLong[0]);
        }
      }
    }
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

    //Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    if (this.macarte) {
      this.macarte.off();
      this.macarte.remove();
    }
    this.macarte = L.map("mapid", {
      layers: [GeoportailFrance_orthos]
    });

    var baseMaps = {
      OpenStreetMap: OpenStreetMap,
      OpenTopoMap: OpenTopoMap,
      GeoportailFrance: GeoportailFrance_orthos
    };
    L.control.layers(baseMaps).addTo(this.macarte);

    let self = this;

    this.$root.$on("bv::modal::shown", (bvEvent, modalId) => {
      if (modalId == "modal-visu") {
        //this.polyline =
        self.drawPolyline();

        //zoom the map to the polyline
        self.macarte.fitBounds(self.polyline.getBounds());
        self.marker = L.marker(self.igc.latLong[0]);
        self.marker.addTo(self.macarte);

        var MyCustomAction = L.Toolbar2.Action.extend({
          options: {
            toolbarIcon: {
              html: '<i class="fas fa-cogs" style="color:#666"></i>',
              tooltip: "Réglages"
            }
          },

          addHooks: function() {
            self.showModalReglage();
          }
        });

        new L.Toolbar2.Control({
          position: "bottomleft",
          actions: [MyCustomAction]
        }).addTo(self.macarte);

        let pluginOptions = {
          cropImageByInnerWH: true, // crop blank opacity from image borders
          hidden: false, // hide screen icon
          domtoimageOptions: { quality: 0.5 }, // see options for dom-to-image
          position: "topleft", // position of take screen icon
          screenName: "screen", // string or function
          //iconUrl: ICON_SVG_BASE64, // screen btn icon base64 or url
          hideElementsWithSelectors: [".leaflet-control-container"], // by default hide map controls All els must be child of _map._container
          mimeType: "image/png", // used if format == image,
          caption: null, // streeng or function, added caption to bottom of screen
          captionFontSize: 15,
          captionFont: "Arial",
          captionColor: "black",
          captionBgColor: "white",
          captionOffset: 5
        };

        self.simpleMapScreenshoter = L.simpleMapScreenshoter(
          pluginOptions
        ).addTo(self.macarte);
        let format = "image"; // 'image' - return base64, 'canvas' - return canvas
        let overridedPluginOptions = {
          mimeType: "image/png"
        };

        // GeoportailFrance_orthos.on("load", function() {
        //   window.setTimeout(function() {
        //     self.simpleMapScreenshoter
        //       .takeScreen(format, overridedPluginOptions)
        //       // eslint-disable-next-line no-unused-vars
        //       .then(data => {
        //         // alert("done");
        //         // console.log(data);
        //         imageToDataUri(data, 150, 150);
        //         // FileSaver.saveAs(blob, 'screen.png')
        //       })
        //       .catch(e => {
        //         console.error(e);
        //       });
        //   }, 20);
        // });

        //les données pour le graph altitude
        let da = self.igc.pressureAltitude.map((a, i) => [
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
        const setter = (item, itemSomoothed) => [
          item[0],
          itemSomoothed.toFixed(2)
        ];
        const arrSmoothed = smooth(speed, windowSize, getter, setter);

        self.series = [
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
    });
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
// eslint-disable-next-line no-unused-vars
function imageToDataUri(datas, wantedWidth, wantedHeight) {
  // We create an image to receive the Data URI
  var img = document.createElement("img");

  // When the event "onload" is triggered we can resize the image.
  img.onload = function() {
    // We create a canvas and get its context.
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    // We set the dimensions at the wanted size.
    canvas.width = wantedWidth;
    canvas.height = wantedHeight;

    // We resize the image with the canvas method drawImage();
    ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

    var dataURI = canvas.toDataURL();
    console.log(dataURI);
    /////////////////////////////////////////
    // Use and treat your Data URI here !! //
    /////////////////////////////////////////
  };

  // We put the Data URI in the image's src attribute
  img.src = datas;
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

<style >
.current-color {
  border: 1px solid #ccc;
}

.modal-full {
  max-width: 100% !important;
}
</style>