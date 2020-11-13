<template>
  <div>
    <b-modal
      id="modal-theme"
      @cancel="doCancel"
      @ok="doSave"
      @hidden="doHidden"
      ref="modal"
      title="Préférences"
    >
      <div>
        <b-tabs content-class="mt-3">
          <b-tab title="Interface" active>
            <b-card>
              <b-form @submit.prevent>
                <b-form-group
                  id="input-group-1"
                  label="Thème:"
                  label-for="input-2"
                >
                  <b-form-select
                    v-model="themeSelected"
                    :options="themesLibs"
                    @input="changeTheme"
                  ></b-form-select>
                </b-form-group>
                <b-form-group
                  id="input-group-2"
                  label="Variant:"
                  label-for="input-2"
                >
                  <b-form-select
                    v-model="variantSelected"
                    :options="tabVariant"
                    @input="changeVariant"
                  ></b-form-select>
                </b-form-group>
                <b-form-group
                  id="input-group-3"
                  label="Type:"
                  label-for="input-2"
                >
                  <b-form-select
                    v-model="typeSelected"
                    :options="tabType"
                    @input="changeType"
                  ></b-form-select>
                </b-form-group>
              </b-form>
            </b-card>
          </b-tab>
          <b-tab title="Langue">
            <b-card>
              <b-form-group
                id="input-group-lang"
                label="Langue:"
                label-for="input-3"
              >
                <b-form-select
                  v-model="langSelected"
                  :options="langs"
                  @input="changeLocale"
                ></b-form-select>
              </b-form-group>
            </b-card>
          </b-tab>
          <b-tab title="Paraglidinglogbook.com">
            <b-card>
              <b-form-group
                id="input-group-lang"
                label="Activé:"
                label-for="input-3"
              >
                <b-form-checkbox
                  v-model="pgenabled"
                  @input="changePg"
                ></b-form-checkbox>
              </b-form-group>
              <b-form-group
                id="input-group-lang"
                label="Login:"
                label-for="input-3"
              >
                <b-form-input
                  v-model="pglogin"
                  @input="changePg"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="input-group-lang"
                label="Mot de passe:"
                label-for="input-3"
              >
                <b-form-input
                  v-model="pgpass"
                  type="password"
                  @input="changePg"
                ></b-form-input>
              </b-form-group>
            </b-card>
          </b-tab>
        </b-tabs>
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
  name: "Pref",
  props: {
    show: { type: Boolean, default: false },
    themeHelper: { type: Object, default: null },
  },
  data: function () {
    return {
      themeSelected: "",
      variantSelected: "",
      typeSelected: "",
      tabVariant: this.themeHelper.themesVariantLst,
      tabType: this.themeHelper.themesTypeLst,
      themes: this.themeHelper.themesLst,
      langs: { fr: "FR", en: "EN", ru: "RU" },
      langSelected: "",
      pgenabled: false,
      pglogin: "",
      pgpass: "",
    };
  },
  watch: {
    show: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.showModal();
      }
    },
  },
  computed: {
    ...mapGetters(["themeName", "themeVariant", "themeType", "lang", "pg"]),
    themesLibs: function () {
      return Object.keys(this.themes);
    },
  },
  methods: {
    changeTheme: function () {
      // eslint-disable-next-line no-unused-vars
      let added = this.themeHelper.addNewTheme(this.themeSelected).then(
        // eslint-disable-next-line no-unused-vars
        (sheets) => {
          this.loading = false;
          this.themeHelper.theme = this.themeSelected;
          store.commit("updateConfigWeb", {
            property: "theme.name",
            with: this.themeSelected,
          });
        },
        // eslint-disable-next-line no-unused-vars
        (reject) => {
          return;
        }
      );
    },
    changeVariant: function () {
      store.commit("updateConfigWeb", {
        property: "theme.variant",
        with: this.variantSelected,
      });
    },
    changeType: function () {
      store.commit("updateConfigWeb", {
        property: "theme.type",
        with: this.typeSelected,
      });
    },
    changeLocale: function () {
      this.$i18n.locale = this.langSelected;
      moment.locale(this.langSelected);
      store.commit("updateConfigWeb", {
        property: "language",
        with: this.langSelected,
      });
    },
    changePg: function () {
      store.commit("updateConfigWeb", {
        property: "paraglidinglogbook.enable",
        with: this.pgenabled,
      });
      store.commit("updateConfigWeb", {
        property: "paraglidinglogbook.login",
        with: this.pglogin,
      });
      store.commit("updateConfigWeb", {
        property: "paraglidinglogbook.password",
        with: this.pgpass,
      });
    },
    showModal: function () {
      this.themeSelected = this.themeName;
      this.variantSelected = this.themeVariant;
      this.typeSelected = this.themeType;
      this.langSelected = this.lang;
      this.pgenabled = this.pg.enable;
      this.pglogin = this.pg.login;
      this.pgpass = this.pg.password;
      this.$bvModal.show("modal-theme");
    },
    doSave: function () {
      let self = this;
      store.dispatch("saveConfigWeb").then(
        // eslint-disable-next-line
        (response) => {
          store.dispatch("loadConfigWeb");
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
    doCancel: function () {
      store.dispatch("loadConfigWeb");
    },
    doHidden: function () {
      this.$emit("themeClosed");
    },
  },
};
</script>

<style scoped>
</style>