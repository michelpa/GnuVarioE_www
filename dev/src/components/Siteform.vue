<template>
  <div>
    <b-modal
      id="modal-site"
      @cancel="doCancel"
      @ok="doSave"
      @hidden="doHidden"
      ref="modal"
      :title="$t('siteform.title')"
    >
      <div>
        <b-card>
          <b-form @submit.prevent>
            <b-row class="my-1">
              <b-col sm="3">
                <label>{{ $t("sitelist.name") }}</label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="libelle"
                  type="text"
                  v-model="site.lib"
                  :required="true"
                ></b-form-input>
              </b-col>
            </b-row>
            <b-row class="my-1">
              <b-col sm="3">
                <label>{{ $t("siteform.description") }}</label>
              </b-col>
              <b-col sm="9">
                <b-form-textarea
                  id="description"
                  v-model="site.comment"
                ></b-form-textarea>
              </b-col>
            </b-row>
            <b-row class="my-1">
              <b-col sm="3">
                <label>{{ $t("siteform.latitude") }}</label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="latitude"
                  type="number"
                  v-model="site.lat"
                  step="0.000001"
                ></b-form-input>
              </b-col>
            </b-row>
            <b-row class="my-1">
              <b-col sm="3">
                <label>{{ $t("siteform.longitude") }}</label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="longitude"
                  type="number"
                  v-model="site.lon"
                  step="0.00000001"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form>
        </b-card>

        <div class="clearfix"></div>
      </div>
    </b-modal>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapGetters } from "vuex";
// eslint-disable-next-line no-unused-vars
import store from "@/store";
export default {
  name: "Siteform",
  props: {
    show: { type: Boolean, default: false },
    site: { type: Object, default: null },
  },
  data: function () {
    return {};
  },
  watch: {
    show: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.showModal();
      }
    },
  },
  computed: {
    ...mapGetters([]),
  },
  methods: {
    showModal: function () {
      this.$bvModal.show("modal-site");
    },
    doSave: function (bvModalEvt) {
      let self = this;
      if (this.site.lib == undefined) {
        bvModalEvt.preventDefault();
        return;
      }
      if (this.site.comment == undefined) {
        this.site.comment = "";
      }
      store.dispatch("saveSite", this.site).then(
        // eslint-disable-next-line no-unused-vars
        (response) => {
          self.show = false;
          store
            .dispatch("loadSites")
            .then(() => {
              self.$emit("redrawRequired");
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
          this.$bvModal.hide("modal-site");
        },
        // eslint-disable-next-line
        (error) => {
          self.$bvToast.toast(`Echec de la sauvegarde du site.`, {
            title: "Sites",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger",
          });
        }
      );
    },
    doCancel: function () {
      //   store.dispatch("loadConfigWeb");
    },
    doHidden: function () {
      this.$emit("siteClosed");
    },
  },
};
</script>

<style scoped>
</style>