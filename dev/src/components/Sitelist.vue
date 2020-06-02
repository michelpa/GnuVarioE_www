 <template>
  <div>
    <siteform :show="showPopupSite" @siteClosed="showPopupSite=false" :site="currentSite"></siteform>
    <table class="table table-bordered table-striped table-hover">
      <thead>
        <tr>
          <th>Libellé</th>
          <th class="act">
            {{ $t('flights.FLIGHTS_ACTION') }}
            <button
              class="btn btn-sm btn-primary float-right"
              @click="addSite()"
              v-b-tooltip.hover="{delay: { show: 1000, hide: 50 }}"
              title="Ajouter"
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
              v-b-tooltip.hover="{delay: { show: 1000, hide: 50 }}"
              title="Editer"
            >
              <i class="fa fa-pen"></i>
            </button>&nbsp;
            <click-confirm
              placement="bottom"
              button-size="sm"
              yes-class="btn btn-success"
              no-class="btn btn-danger"
              :messages="{title: 'Êtes-vous sûr?', yes: 'Oui', no: 'Non'}"
            >
              <button
                class="btn btn-sm btn-danger"
                @click="deleteSite(site)"
                v-b-tooltip.hover="{delay: { show: 1000, hide: 50 }}"
                title="Supprimer"
              >
                <i class="fa fa-trash-alt"></i>
              </button>
            </click-confirm>&nbsp;
          </td>
        </tr>
      </tbody>
    </table>
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
  data: function() {
    return {
      currentSite: {},
      showPopupSite: false
    };
  },

  computed: {
    ...mapGetters(["sites"])
  },
  methods: {
    addSite: function() {
      this.currentSite = {};
      this.showPopupSite = true;
    },
    editSite: function(site) {
      this.currentSite = Object.assign({}, site);
      this.showPopupSite = true;
    },
    deleteSite: function(site) {
      let self = this;
      store.dispatch("deleteSite", site.id).then(
        // eslint-disable-next-line
        response => {
          store.dispatch("loadSites");
        },
        // eslint-disable-next-line
        error => {
          let msg = error.message;
          self.$bvToast.toast(`Echec de la suppression du site. ${msg}`, {
            title: "Site",
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
    store.dispatch("loadSites").catch(error => {
      self.$bvToast.toast(`Impossible de charger les sites. (` + error + ")", {
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
th.act {
  width: 250px;
}

td.btns div {
  display: inline;
}
</style>