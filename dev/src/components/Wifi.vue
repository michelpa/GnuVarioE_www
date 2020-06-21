<template>
  <div>
    <div v-if="!conf">La configuration n'est pas encore chargée!</div>
    <div v-else class="configpage">
      <h3>{{ $t('wifi.CONF_LIB') }}</h3>
      <div class="row">
        <div class="col-md-12">
          <b-card :header="$t('wifi.AP')" header-tag="header" title>
            <b-form @submit="onSaveConfig">
              <div class="row">
                <div class="col-md-6">
                  <b-form-group
                    label-cols-sm="6"
                    label-cols-lg="6"
                    :label="$t('params.wifi.SSID_1.label')"
                    label-for="SSID_1"
                    :description="$t('params.wifi.SSID_1.help')"
                  >
                    <b-form-input id="SSID_1" v-model="conf.SSID_1" type="text"></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label-cols-sm="6"
                    label-cols-lg="6"
                    :label="$t('params.wifi.SSID_2.label')"
                    label-for="SSID_2"
                    :description="$t('params.wifi.SSID_2.help')"
                  >
                    <b-form-input id="SSID_2" v-model="conf.SSID_2" type="text"></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label-cols-sm="6"
                    label-cols-lg="6"
                    :label="$t('params.wifi.SSID_3.label')"
                    label-for="SSID_3"
                    :description="$t('params.wifi.SSID_3.help')"
                  >
                    <b-form-input id="SSID_3" v-model="conf.SSID_3" type="text"></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label-cols-sm="6"
                    label-cols-lg="6"
                    :label="$t('params.wifi.SSID_4.label')"
                    label-for="SSID_4"
                    :description="$t('params.wifi.SSID_4.help')"
                  >
                    <b-form-input id="SSID_4" v-model="conf.SSID_4" type="text"></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-6">
                  <b-form-group
                    label-cols-sm="6"
                    label-cols-lg="6"
                    :label="$t('params.wifi.PASSWORD_1.label')"
                    label-for="PASSWORD_1"
                    :description="$t('params.wifi.PASSWORD_1.help')"
                  >
                    <b-form-input id="PASSWORD_1" v-model="conf.PASSWORD_1" type="password"></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label-cols-sm="6"
                    label-cols-lg="6"
                    :label="$t('params.wifi.PASSWORD_2.label')"
                    label-for="PASSWORD_2"
                    :description="$t('params.wifi.PASSWORD_2.help')"
                  >
                    <b-form-input id="PASSWORD_2" v-model="conf.PASSWORD_2" type="password"></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label-cols-sm="6"
                    label-cols-lg="6"
                    :label="$t('params.wifi.PASSWORD_3.label')"
                    label-for="PASSWORD_3"
                    :description="$t('params.wifi.PASSWORD_3.help')"
                  >
                    <b-form-input id="PASSWORD_3" v-model="conf.PASSWORD_3" type="password"></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label-cols-sm="6"
                    label-cols-lg="6"
                    :label="$t('params.wifi.PASSWORD_4.label')"
                    label-for="PASSWORD_4"
                    :description="$t('params.wifi.PASSWORD_4.help')"
                  >
                    <b-form-input id="PASSWORD_4" v-model="conf.PASSWORD_4" type="password"></b-form-input>
                  </b-form-group>
                </div>
              </div>
              <b-button variant="success" block type="submit">{{ $t('global.save') }}</b-button>
            </b-form>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  name: "Wifi",
  props: {
    msg: String
  },
  data: function() {
    return {
      env: process.env,
      conf: "",
      params: {}
    };
  },
  methods: {
    parseConfig: function() {
      let self = this;
      var keys = [
        "SSID_1",
        "SSID_2",
        "SSID_3",
        "SSID_4",
        "PASSWORD_1",
        "PASSWORD_2",
        "PASSWORD_3",
        "PASSWORD_4"
      ];
      var res = {};
      keys.forEach(function(key) {
        var r = "\\[" + key + "=(.*)\\]";
        var re = new RegExp(r);
        var match = re.exec(self.configWifi);
        self.conf = Object.assign(res, { [key]: match[1] });
      });
    },
    onSaveConfig: function(evt) {
      evt.preventDefault();
      //recomposition du fichier
      var f = `
[SSID_1=${this.conf.SSID_1}]
[PASSWORD_1=${this.conf.PASSWORD_1}]

[SSID_2=${this.conf.SSID_2}]
[PASSWORD_2=${this.conf.PASSWORD_2}]

[SSID_3=${this.conf.SSID_3}]
[PASSWORD_3=${this.conf.PASSWORD_3}]

[SSID_4=${this.conf.SSID_4}]
[PASSWORD_4=${this.conf.PASSWORD_4}]
`;

      store.commit("setconfigWifi", f);

      let self = this;
      store.dispatch("saveWifiConfig").then(
        // eslint-disable-next-line
        response => {
          store.dispatch("loadWifiConfig");
          self.$bvToast.toast(
            "Configuration WiFi sauvegardée sur la carte SD.",
            {
              title: "Config WiFi",
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "success"
            }
          );
        },
        // eslint-disable-next-line
        error => {
          self.$bvToast.toast(
            `Echec de la sauvegarde de la configuration WiFi.`,
            {
              title: "Config WiFi",
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "danger"
            }
          );
        }
      );
      return;
    }
  },
  computed: {
    ...mapGetters(["configWifi"])
  },
  mounted: function() {
    let self = this;
    store.dispatch("loadWifiConfig").then(function() {
      self.parseConfig();
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.configpage {
  padding: 1.5rem;
}
</style>
