 <template>
  <div>
    <siteform
      :show="showPopupSite"
      @siteClosed="showPopupSite = false"
      :site="currentSite"
      @redrawRequired="redrawMap"
    ></siteform>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>{{ $t("sitelist.name") }}</th>
              <th class="act">
                {{ $t("flights.FLIGHTS_ACTION") }}
                <button
                  class="btn btn-sm btn-primary float-right"
                  @click="addSite()"
                  v-b-tooltip.hover="{ delay: { show: 1000, hide: 50 } }"
                  :title="$t('actions.add')"
                >
                  <i class="fa fa-plus"></i>
                </button>
              </th>
            </tr>
          </thead>
          <tbody v-if="sites">
            <tr v-for="site in sites" :key="site.id">
              <td>{{ site.lib }}</td>
              <td class="btns">
                <button
                  class="btn btn-sm btn-primary"
                  @click="editSite(site)"
                  v-b-tooltip.hover="{ delay: { show: 1000, hide: 50 } }"
                  :title="$t('actions.edit')"
                >
                  <i class="fa fa-pen"></i></button
                >&nbsp;
                <click-confirm
                  placement="bottom"
                  button-size="sm"
                  yes-class="btn btn-success"
                  no-class="btn btn-danger"
                  :messages="{ title: $t('actions.del_message'), yes: $t('actions.yes'), no: $t('actions.no') }"
                >
                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteSite(site)"
                    v-b-tooltip.hover="{ delay: { show: 1000, hide: 50 } }"
                    :title="$t('actions.delete')"
                  >
                    <i class="fa fa-trash-alt"></i>
                  </button> </click-confirm
                >&nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div id="mapsiteid"></div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapGetters } from "vuex";
// eslint-disable-next-line no-unused-vars
import store from "@/store";
import Siteform from "./Siteform";
export default {
  name: "Sitelist",
  components: { Siteform },
  props: {},
  data: function () {
    return {
      currentSite: {},
      showPopupSite: false,
      macarte: null,
    };
  },

  computed: {
    ...mapGetters(["sites"]),
  },
  methods: {
    addSite: function () {
      this.currentSite = {};
      this.showPopupSite = true;
    },
    editSite: function (site) {
      this.currentSite = Object.assign({}, site);
      this.showPopupSite = true;
    },
    deleteSite: function (site) {
      let self = this;
      store.dispatch("deleteSite", site.id).then(
        // eslint-disable-next-line
        (response) => {
          store
            .dispatch("loadSites")
            .then(() => {
              self.redrawMap();
            })
            .catch((error) => {
              self.$bvToast.toast(
                `Impossible de charger les sites. (` + error + ")",
                {
                  title: "Mon vol",
                  toaster: "b-toaster-top-right",
                  solid: true,
                  variant: "danger",
                }
              );
            });
        },
        // eslint-disable-next-line
        (error) => {
          let msg = error.message;
          self.$bvToast.toast(`Echec de la suppression du site. ${msg}`, {
            title: "Site",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger",
          });
        }
      );
    },
    redrawMap: function () {
      var self = this;
      Vue.nextTick().then(function () {
        // DOM updated
        self.drawMap();
      });
    },
    drawMap: function () {
      var self = this;

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

      //Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
      if (this.macarte) {
        this.macarte.off();
        this.macarte.remove();
      }

      this.macarte = L.map("mapsiteid", {
        layers: [GeoportailFrance_orthos],
      });

      var baseMaps = {
        OpenStreetMap: OpenStreetMap,
        OpenTopoMap: OpenTopoMap,
        GeoportailFrance: GeoportailFrance_orthos,
      };
      L.control.layers(baseMaps).addTo(this.macarte);

      const markers = new L.FeatureGroup();

      for (let index = 0; index < this.sites.length; index++) {
        const site = this.sites[index];
        if (site.lat && site.lon) {
          const m = L.marker([site.lat, site.lon])
            .addTo(this.macarte)
            .bindPopup(
              "<h6>" +
                site.lib +
                "</h6><em>" +
                self.$options.filters.nl2br(site.comment) +
                "</em>"
            );
          markers.addLayer(m);
        }
      }

      //zoom the map to the markers
      markers.addTo(this.macarte);
      this.macarte.fitBounds(markers.getBounds());
    },
  },
  mounted: function () {
    let self = this;
    store
      .dispatch("loadSites")
      .then(() => {
        // self.drawMap();
      })
      .catch((error) => {
        self.$bvToast.toast(
          `Impossible de charger les sites. (` + error + ")",
          {
            title: "Mon vol",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger",
          }
        );
      });
  },
};
</script>

<style scoped>
th.act {
  width: 250px;
}

td.btns div {
  display: inline;
}
#mapsiteid {
  width: 100%;
  padding-top: 56.25%;
  margin-bottom: 5px;
}
</style>