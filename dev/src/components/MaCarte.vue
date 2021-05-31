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
            <label class="col-sm-5 col-form-label">{{
              $t("flights.TRACE_COLOR")
            }}</label>
            <div class="col-sm-4">
              <color-picker :color="colorTrait" v-model="colorTrait" />
            </div>
          </div>
          <div class="form-row form-group">
            <label class="col-sm-5 col-form-label">
              {{ $t("flights.TRACE_WIDTH") }}
            </label>
            <div class="col-sm-4">
              <b-form-input
                v-model="epaisseurTrait"
                type="number"
                step="1"
              ></b-form-input>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <div id="mapidvol" ref="mapidvol"></div>
    <div id="altchart">
      <apexchart
        width="100%"
        height="100%"
        type="area"
        :options="chartsOptions"
        :series="series"
      ></apexchart>
    </div>
    {{ markerLength }} / {{ totalLength }} km
  </div>
</template>

<script>
import ColorPicker from "./ColorPicker";
import { mapGetters } from "vuex";
import { getChartOptions, getSeriesFromIgcData } from "./../lib/helperCharts";

export default {
  name: "MaCarte",
  components: { ColorPicker },
  props: {
    igc: Object,
    altMin: Number,
    altMax: Number,
  },
  data: function () {
    return {
      macarte: null,
      currentF: null,
      midx: null,
      polyline: null,
      series: [],
      marker: null,
    };
  },
  methods: {
    showModalReglage: function () {
      this.$bvModal.show("modal-reglage");
    },
    doSaveReglage: function () {
      let self = this;
      this.$store.dispatch("saveConfigWeb").then(
        // eslint-disable-next-line
        (response) => {
          this.$store.dispatch("loadConfigWeb");
          self.$bvToast.toast("Préférences sauvegardées sur la carte SD.", {
            title: "Préférences",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "success",
          });
        },
        // eslint-disable-next-line
        (error) => {
          self.$bvToast.toast(`Echec de la sauvegarde des préférences.`, {
            title: "Préférences",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger",
          });
        }
      );
      return;
    },
    setMidx: function (idx) {
      this.midx = idx;
    },
    drawPolyline: function () {
      if (this.polyline) {
        this.polyline.remove();
      }
      this.polyline = L.polyline(this.igc.latLong, {
        color: this.colorTrait,
        weight: this.epaisseurTrait,
      }).addTo(this.macarte);

      // this.polyline;
      // return p;
    },
  },
  computed: {
    ...mapGetters(["configWeb"]),
    epaisseurTrait: {
      get() {
        return this.configWeb.map.trace.epaisseur;
      },
      set(value) {
        this.$store.commit("updateConfigWeb", {
          property: "map.trace.epaisseur",
          with: value,
        });
        this.drawPolyline();
      },
    },
    colorTrait: {
      get() {
        return this.configWeb.map.trace.color;
      },
      set(value) {
        this.$store.commit("updateConfigWeb", {
          property: "map.trace.color",
          with: value,
        });
        this.drawPolyline();
      },
    },
    chartsOptions: function () {
      let options = getChartOptions(this.altMin, this.altMax, this.$i18n);
      let self = this;
      options.chart.events = {
        mouseMove: function (event, chartContext, config) {
          // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts.
          var index = config.dataPointIndex;
          self.setMidx(index);
        },
      };
      return options;
    },
    markerLength: function () {
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
    totalLength: function () {
      if (this.polyline) {
        var length = 0;
        var previousPoint;

        this.polyline.getLatLngs().forEach(function (latLng) {
          if (previousPoint) {
            length += previousPoint.distanceTo(latLng);
          }
          previousPoint = latLng;
        });
        return Math.round(length, 3) / 1000;
      } else {
        return 0;
      }
    },
  },
  watch: {
    midx: function (newidx, oldidx) {
      if (this.marker) {
        if (newidx != oldidx && newidx > 0) {
          this.marker.setLatLng(this.igc.latLong[newidx]);
        } else {
          this.marker.setLatLng(this.igc.latLong[0]);
        }
      }
    },
  },
  mounted() {
    var OpenTopoMap = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 17,
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      }
    );

    var OpenStreetMap = L.tileLayer(
      "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
      {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution:
          'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20,
      }
    );

    var GeoportailFrance_orthos = L.tileLayer(
      "https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
      {
        attribution:
          '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
        bounds: [
          [-75, -180],
          [81, 180],
        ],
        minZoom: 2,
        maxZoom: 19,
        apikey: "choisirgeoportail",
        format: "image/jpeg",
        style: "normal",
      }
    );

    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    if (this.macarte) {
      this.macarte.off();
      this.macarte.remove();
    }
    this.macarte = L.map("mapidvol", { layers: [GeoportailFrance_orthos] });

    var baseMaps = {
      OpenStreetMap: OpenStreetMap,
      OpenTopoMap: OpenTopoMap,
      GeoportailFrance: GeoportailFrance_orthos,
    };

    L.control.layers(baseMaps).addTo(this.macarte);

    let self = this;

    this.drawPolyline();

    //zoom the map to the polyline
    this.macarte.fitBounds(this.polyline.getBounds());

    this.marker = L.marker(this.igc.latLong[0]);
    this.marker.addTo(this.macarte);

    var MyCustomAction = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          html: '<i class="fas fa-cogs" style="color:#666"></i>',
          tooltip: "Réglages",
        },
      },

      addHooks: function () {
        self.showModalReglage();
      },
    });

    new L.Toolbar2.Control({
      position: "bottomleft",
      actions: [MyCustomAction],
    }).addTo(this.macarte);

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
      captionOffset: 5,
    };

    this.simpleMapScreenshoter = L.simpleMapScreenshoter(pluginOptions).addTo(
      this.macarte
    );
    // let format = "image"; // 'image' - return base64, 'canvas' - return canvas
    // let overridedPluginOptions = {
    //   mimeType: "image/png"
    // };

    // GeoportailFrance_orthos.on("load", function() {
    //   window.setTimeout(function() {
    //     self.simpleMapScreenshoter
    //       .takeScreen(format, overridedPluginOptions)
    //       // eslint-disable-next-line no-unused-vars
    //       .then(data => {
    //         // alert("done");
    //         // console.log(data);
    //         let w = 320;
    //         let h =
    //           self.$refs.mapidvol.clientHeight /
    //           (self.$refs.mapidvol.clientWidth / w);
    //         imageToDataUri(data, w, h);
    //         // FileSaver.saveAs(blob, 'screen.png')
    //       })
    //       .catch(e => {
    //         console.error(e);
    //       });
    //   }, 500);
    // });

    this.series = getSeriesFromIgcData(self.igc, this.$i18n);
  },
};

// eslint-disable-next-line no-unused-vars
function imageToDataUri(datas, wantedWidth, wantedHeight) {
  // We create an image to receive the Data URI
  var img = document.createElement("img");

  // When the event "onload" is triggered we can resize the image.
  img.onload = function () {
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
#mapidvol {
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
</style>