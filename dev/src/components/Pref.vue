<template>
  <div>
    <b-modal
      id="modal-theme"
      @cancel="doCancel"
      @ok="doSave"
      @hidden="doHidden"
      ref="modal"
      :title="$t('pref.Preferences')"
      size="xl"
    >
      <div>
        <b-tabs content-class="mt-3">
          <b-tab :title="$t('pref.Interface')" active>
            <b-card>
              <b-form @submit.prevent>
                <b-form-group
                  id="input-group-1"
                  :label="$t('pref.Theme') + ':'"
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
                  :label="$t('pref.Variant') + ':'"
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
                  :label="$t('pref.Type') + ':'"
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
          <b-tab :title="$t('pref.Language')">
            <b-card>
              <b-form-group
                id="input-group-lang"
                :label="$t('pref.Language') + ':'"
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
                id="input-group-pg1"
                :label="$t('pref.pgactive') + ':'"
                label-for="input-3"
              >
                <b-form-checkbox
                  v-model="pgenabled"
                  @input="changePg"
                ></b-form-checkbox>
              </b-form-group>
              <b-form-group
                id="input-group-pg2"
                :label="$t('pref.pglogin') + ':'"
                label-for="input-3"
              >
                <b-form-input
                  v-model="pglogin"
                  @input="changePg"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="input-group-pg3"
                :label="$t('pref.pgpassword') + ':'"
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
          <b-tab title="Dropbox">
            <b-card>
              <b-form-group
                id="input-group-db1"
                :label="$t('pref.dropboxactive') + ':'"
                label-for="input-3"
              >
                <b-form-checkbox
                  v-model="dropboxenabled"
                  @input="changeDropbox"
                ></b-form-checkbox>
              </b-form-group>
              <b-form-group
                id="input-group-db2"
                :label="$t('pref.dropboxtoken') + ':'"
                label-for="input-3"
              >
                <b-form-input
                  v-model="dropboxtoken"
                  @input="changeDropbox"
                ></b-form-input>
              </b-form-group>
              <div class="row">
                <div class="col-md-12">
                  <hr />
                  <h4>{{ $t("pref.dropbox_header") }}</h4>
                  <p>
                    {{ $t("pref.dropbox_info1") }}
                  </p>
                  <p>
                    {{ $t("pref.dropbox_info2") }}
                  </p>
                  <p>
                    {{ $t("pref.dropbox_info3") }}
                  </p>
                  <p>
                    {{ $t("pref.dropbox_info4") }}
                  </p>
                  <p>
                    {{ $t("pref.dropbox_info5") }}
                  </p>
                  <p>
                    {{ $t("pref.dropbox_info6") }}
                  </p>
                </div>
              </div>
              <div class="float-right">
                <button
                  class="btn btn-primary"
                  @click="dropboxAuthenticate"
                  v-if="!showSaisieCode"
                >
                  {{ $t("pref.button_get_code") }}
                </button>
                <div v-if="showSaisieCode">
                  <b-form-group
                    id="input-group-db2"
                    label="Code Dropbox"
                    label-for="input-3"
                  >
                    <b-form-input v-model="dropboxCode"></b-form-input>
                  </b-form-group>
                  <button class="btn btn-primary" @click="dropboxGetToken">
                    {{ $t("pref.button_get_token") }}
                  </button>
                </div>
              </div>
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
      langs: [
        { value: "fr", text: "FR" },
        { value: "en", text: "EN" },
        { value: "ru", text: "RU" },
      ],
      langSelected: "",
      pgenabled: false,
      pglogin: "",
      pgpass: "",
      dropboxenabled: false,
      dropboxtoken: "",
      showSaisieCode: false,
      dropboxCode: "",
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
    ...mapGetters([
      "themeName",
      "themeVariant",
      "themeType",
      "lang",
      "pg",
      "dropboxpref",
      "getAuthUrl",
    ]),
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
          this.$store.commit("updateConfigWeb", {
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
      this.$store.commit("updateConfigWeb", {
        property: "theme.variant",
        with: this.variantSelected,
      });
    },
    changeType: function () {
      this.$store.commit("updateConfigWeb", {
        property: "theme.type",
        with: this.typeSelected,
      });
    },
    changeLocale: function () {
      // this.$i18n.locale = this.langSelected;
      // this.$moment.locale(this.langSelected);
      this.$store.commit("updateConfigWeb", {
        property: "language",
        with: this.langSelected,
      });
    },
    changePg: function () {
      this.$store.commit("updateConfigWeb", {
        property: "paraglidinglogbook.enable",
        with: this.pgenabled,
      });
      this.$store.commit("updateConfigWeb", {
        property: "paraglidinglogbook.login",
        with: this.pglogin,
      });
      this.$store.commit("updateConfigWeb", {
        property: "paraglidinglogbook.password",
        with: this.pgpass,
      });
    },
    changeDropbox: function () {
      this.$store.commit("updateConfigWeb", {
        property: "dropbox.enable",
        with: this.dropboxenabled,
      });
      this.$store.commit("updateConfigWeb", {
        property: "dropbox.token",
        with: this.dropboxtoken,
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
      this.dropboxenabled = this.dropboxpref.enable;
      this.dropboxtoken = this.dropboxpref.token;
      this.$bvModal.show("modal-theme");
    },
    doSave: function () {
      let self = this;
      this.$store.dispatch("saveConfigWeb").then(
        // eslint-disable-next-line
        (response) => {
          self.$store.dispatch("loadConfigWeb");
          self.$bvToast.toast(this.$i18n.t("pref.Save_settings"), {
            title: this.$i18n.t("pref.Preferences"),
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "success",
          });
        },
        // eslint-disable-next-line
        (error) => {
          self.$bvToast.toast(this.$i18n.t("pref.Failed_save_settings"), {
            title: this.$i18n.t("pref.Preferences"),
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger",
          });
        }
      );
      return;
    },
    doCancel: function () {
      this.$store.dispatch("loadConfigWeb");
    },
    doHidden: function () {
      this.$emit("themeClosed");
    },
    dropboxAuthenticate: function () {
      this.$store.dispatch("getAuthUrl").then(
        (response) => {
          window.open(response, "_blank");
          this.showSaisieCode = true;
        },
        // eslint-disable-next-line
        (error) => {
          alert(error);
        }
      );
    },

    dropboxGetToken: function () {
      let self = this;
      if (this.dropboxCode) {
        this.$store
          .dispatch("getDropboxToken", { dropboxCode: this.dropboxCode })
          .then(
            (response) => {
              if (response.access_token) {
                self.dropboxtoken = response.access_token;
                self.dropboxenabled = true;
                self.changeDropbox();
                self.showSaisieCode = false;
              }
            },
            // eslint-disable-next-line
            (error) => {
              alert(error);
            }
          );
      }
    },
  },
};
</script>

<style scoped>
</style>