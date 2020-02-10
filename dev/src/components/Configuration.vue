<template>
  <div>
    <div v-if="!config">La configuration n'est pas encore chargée!</div>
    <div v-else class="configpage">
      <div class="row">
        <div class="col-md-12">
          <div class="float-right">
            <b-form-checkbox
              id="checkbox-1"
              v-model="mode"
              name="checkbox-1"
              value="expert"
              unchecked-value="normal"
            >Mode expert</b-form-checkbox>
          </div>
          <h3>Paramétrage</h3>

          <b-card no-body>
            <b-tabs
              card
              content-class="mt-3"
              fill
              active-nav-item-class="font-weight-bold text-uppercase text-info"
            >
              <b-tab title="Général">
                <b-card header="Paramètres Généraux" header-tag="header" title>
                  <b-form @submit="onSaveConfig">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="float-right">
                          <b-button
                            v-if="!confVoile"
                            variant="info"
                            type="button"
                            size="sm"
                            @click="confVoile=!confVoile"
                          >Configurer mes voiles</b-button>
                        </div>
                        <div class="clearfix"></div>
                        <br />
                        <config-field
                          v-if="!confVoile"
                          v-model="localConfig.general.PILOT_NAME"
                          :label="$t('params.general.PILOT_NAME.label')"
                          :help="$t('params.general.PILOT_NAME.help')"
                          input-type="text"
                        ></config-field>

                        <config-field
                          v-if="!confVoile"
                          v-model="localConfig.general.GLIDER.GLIDER_SELECT"
                          :label="$t('params.general.GLIDER_SELECT.label')"
                          :help="$t('params.general.GLIDER_SELECT.help')"
                          kind="select"
                          :options="gliders"
                        ></config-field>

                        <config-field
                          v-if="confVoile"
                          v-model="localConfig.general.GLIDER.GLIDER_NAME1"
                          :label="$t('params.general.GLIDER_NAME1.label')"
                          :help="$t('params.general.GLIDER_NAME1.help')"
                          input-type="text"
                        ></config-field>
                        <config-field
                          v-if="confVoile"
                          v-model="localConfig.general.GLIDER.GLIDER_NAME2"
                          :label="$t('params.general.GLIDER_NAME2.label')"
                          :help="$t('params.general.GLIDER_NAME2.help')"
                          input-type="text"
                        ></config-field>
                        <config-field
                          v-if="confVoile"
                          v-model="localConfig.general.GLIDER.GLIDER_NAME3"
                          :label="$t('params.general.GLIDER_NAME3.label')"
                          :help="$t('params.general.GLIDER_NAME3.help')"
                          input-type="text"
                        ></config-field>
                        <config-field
                          v-if="confVoile"
                          v-model="localConfig.general.GLIDER.GLIDER_NAME4"
                          :label="$t('params.general.GLIDER_NAME4.label')"
                          :help="$t('params.general.GLIDER_NAME4.help')"
                          input-type="text"
                        ></config-field>
                        <config-field
                          v-if="!confVoile"
                          v-model="localConfig.general.TIME_ZONE"
                          :label="$t('params.general.TIME_ZONE.label')"
                          :help="$t('params.general.TIME_ZONE.help')"
                          kind="select"
                          :options="fuseaux"
                        ></config-field>
                      </div>
                      <b-button variant="success" block type="submit">Sauver</b-button>
                    </div>
                  </b-form>
                </b-card>
                <!-- <p>{{config.general}}</p> -->
              </b-tab>
              <b-tab title="Vario">
                <b-card header="Paramètres Vario" header-tag="header" title>
                  <b-form @submit="onSaveConfig">
                    <div class="row">
                      <div class="col-md-4">
                        <config-field
                          v-model="localConfig.vario.SINKING_THRESHOLD"
                          :label="$t('params.vario.SINKING_THRESHOLD.label')"
                          :help="$t('params.vario.SINKING_THRESHOLD.help')"
                          input-type="range"
                          :min="-10"
                          :max="0"
                          :step="0.1"
                        ></config-field>
                        <config-field
                          v-model="localConfig.vario.CLIMBING_THRESHOLD"
                          :label="$t('params.vario.CLIMBING_THRESHOLD.label')"
                          :help="$t('params.vario.CLIMBING_THRESHOLD.help')"
                          input-type="range"
                          :min="0"
                          :max="10"
                          :step="0.1"
                        ></config-field>
                        <config-field
                          v-model="localConfig.vario.NEAR_CLIMBING_SENSITIVITY"
                          :label="$t('params.vario.NEAR_CLIMBING_SENSITIVITY.label')"
                          :help="$t('params.vario.NEAR_CLIMBING_SENSITIVITY.help')"
                          input-type="range"
                          :min="0"
                          :max="1"
                          :step="0.1"
                        ></config-field>
                      </div>
                      <div class="col-md-4">
                        <config-field
                          v-model="localConfig.vario.ENABLE_NEAR_CLIMBING_ALARM"
                          :label="$t('params.vario.ENABLE_NEAR_CLIMBING_ALARM.label')"
                          :help="$t('params.vario.ENABLE_NEAR_CLIMBING_ALARM.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.vario.ENABLE_NEAR_CLIMBING_BEEP"
                          :label="$t('params.vario.ENABLE_NEAR_CLIMBING_BEEP.label')"
                          :help="$t('params.vario.ENABLE_NEAR_CLIMBING_BEEP.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.vario.DISPLAY_INTEGRATED_CLIMB_RATE"
                          :label="$t('params.vario.DISPLAY_INTEGRATED_CLIMB_RATE.label')"
                          :help="$t('params.vario.DISPLAY_INTEGRATED_CLIMB_RATE.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.vario.RATIO_CLIMB_RATE"
                          :label="$t('params.vario.RATIO_CLIMB_RATE.label')"
                          :help="$t('params.vario.RATIO_CLIMB_RATE.help')"
                          kind="select"
                          :options="[{value: '1', text: 'Affichage de la finesse'}, { value: '2', text: 'Affichage du taux de chute moyen' }, { value: '3', text: 'Affichage des 2 informations en alternance dans la zone à droite de l’affiche du vario' }]"
                        ></config-field>
                      </div>
                      <div class="col-md-4">
                        <config-field
                          v-if="mode == 'expert'"
                          v-model="localConfig.vario.CLIMB_PERIOD_COUNT"
                          :label="$t('params.vario.CLIMB_PERIOD_COUNT.label')"
                          :help="$t('params.vario.CLIMB_PERIOD_COUNT.help')"
                          input-type="number"
                        ></config-field>
                        <config-field
                          v-if="mode == 'expert'"
                          v-model="localConfig.vario.SETTINGS_GLIDE_RATIO_PERIOD_COUNT"
                          :label="$t('params.vario.SETTINGS_GLIDE_RATIO_PERIOD_COUNT.label')"
                          :help="$t('params.vario.SETTINGS_GLIDE_RATIO_PERIOD_COUNT.help')"
                          input-type="number"
                        ></config-field>
                        <config-field
                          v-if="mode == 'expert'"
                          v-model="localConfig.vario.RATIO_MAX_VALUE"
                          :label="$t('params.vario.RATIO_MAX_VALUE.label')"
                          :help="$t('params.vario.RATIO_MAX_VALUE.help')"
                          input-type="number"
                        ></config-field>
                        <config-field
                          v-if="mode == 'expert'"
                          v-model="localConfig.vario.RATIO_MIN_SPEED"
                          :label="$t('params.vario.RATIO_MIN_SPEED.label')"
                          :help="$t('params.vario.RATIO_MIN_SPEED.help')"
                          input-type="number"
                        ></config-field>

                        <config-field
                          v-if="mode == 'expert'"
                          v-model="localConfig.vario.SENT_LXNAV_SENTENCE"
                          :label="$t('params.vario.SENT_LXNAV_SENTENCE.label')"
                          :help="$t('params.vario.SENT_LXNAV_SENTENCE.help')"
                          kind="select"
                          :options="[{value: '0', text: 'LK8000'}, { value: '1', text: 'LXNAV' }]"
                        ></config-field>
                      </div>
                      <b-button variant="success" block type="submit">Sauver</b-button>
                    </div>
                  </b-form>
                </b-card>
                <!-- <p>{{config.vario}}</p> -->
              </b-tab>
              <b-tab title="Début du vol">
                <b-card header="Paramètres Départ Vol" header-tag="header" title>
                  <b-form @submit="onSaveConfig">
                    <div class="row">
                      <div class="col-md-12">
                        <config-field
                          v-if="mode == 'expert'"
                          v-model="localConfig.flightstart.FLIGHT_START_MIN_TIMESTAMP"
                          :label="$t('params.vol.FLIGHT_START_MIN_TIMESTAMP.label')"
                          :help="$t('params.vol.FLIGHT_START_MIN_TIMESTAMP.help')"
                          input-type="number"
                          :step="0.1"
                        ></config-field>
                        <config-field
                          v-model="localConfig.flightstart.FLIGHT_START_VARIO_LOW_THRESHOLD"
                          :label="$t('params.vol.FLIGHT_START_VARIO_LOW_THRESHOLD.label')"
                          :help="$t('params.vol.FLIGHT_START_VARIO_LOW_THRESHOLD.help')"
                          input-type="number"
                          :step="0.1"
                        ></config-field>
                        <config-field
                          v-model="localConfig.flightstart.FLIGHT_START_VARIO_HIGH_THRESHOLD"
                          :label="$t('params.vol.FLIGHT_START_VARIO_HIGH_THRESHOLD.label')"
                          :help="$t('params.vol.FLIGHT_START_VARIO_HIGH_THRESHOLD.help')"
                          input-type="number"
                          :step="0.1"
                        ></config-field>
                        <config-field
                          v-model="localConfig.flightstart.FLIGHT_START_MIN_SPEED"
                          :label="$t('params.vol.FLIGHT_START_MIN_SPEED.label')"
                          :help="$t('params.vol.FLIGHT_START_MIN_SPEED.help')"
                          input-type="number"
                          :step="0.1"
                        ></config-field>
                        <config-field
                          v-model="localConfig.flightstart.RECORD_WHEN_FLIGHT_START"
                          :label="$t('params.vol.VARIOMETER_RECORD_WHEN_FLIGHT_START.label')"
                          :help="$t('params.vol.VARIOMETER_RECORD_WHEN_FLIGHT_START.help')"
                          kind="checkbox"
                        ></config-field>
                      </div>
                      <b-button variant="success" block type="submit">Sauver</b-button>
                    </div>
                  </b-form>
                </b-card>
                <!-- <p>{{config.flightstart}}</p> -->
              </b-tab>
              <b-tab title="Système">
                <b-card header="Paramètres Système" header-tag="header" title>
                  <b-form @submit="onSaveConfig">
                    <div class="row">
                      <div class="col-md-4">
                        <config-field
                          v-model="localConfig.systeme.BEEP_FLYBEGIN"
                          :label="$t('params.systeme.BEEP_FLYBEGIN.label')"
                          :help="$t('params.systeme.BEEP_FLYBEGIN.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.BT_ENABLE"
                          :label="$t('params.systeme.BT_ENABLE.label')"
                          :help="$t('params.systeme.BT_ENABLE.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.NO_RECORD"
                          :label="$t('params.systeme.NO_RECORD.label')"
                          :help="$t('params.systeme.NO_RECORD.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.ALARM_SDCARD"
                          :label="$t('params.systeme.ALARM_SDCARD.label')"
                          :help="$t('params.systeme.ALARM_SDCARD.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.BEEP_GPSFIX"
                          :label="$t('params.systeme.BEEP_GPSFIX.label')"
                          :help="$t('params.systeme.BEEP_GPSFIX.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.BEEP_VARIOBEGIN"
                          :label="$t('params.systeme.BEEP_VARIOBEGIN.label')"
                          :help="$t('params.systeme.BEEP_VARIOBEGIN.help')"
                          kind="checkbox"
                        ></config-field>
                      </div>
                      <div class="col-md-4">
                        <config-field
                          v-model="localConfig.systeme.COMPENSATION_TEMP"
                          :label="$t('params.systeme.COMPENSATION_TEMP.label')"
                          :help="$t('params.systeme.COMPENSATION_TEMP.help')"
                          input-type="number"
                          :step="0.1"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.COMPENSATION_GPSALTI"
                          :label="$t('params.systeme.COMPENSATION_GPSALTI.label')"
                          :help="$t('params.systeme.COMPENSATION_GPSALTI.help')"
                          input-type="number"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.URL_UPDATE"
                          :label="$t('params.systeme.URL_UPDATE.label')"
                          :help="$t('params.systeme.URL_UPDATE.help')"
                          input-type="text"
                        ></config-field>
                      </div>
                      <div class="col-md-4">
                        <config-field
                          v-model="localConfig.systeme.DISPLAY_STAT_DURATION"
                          :label="$t('params.systeme.DISPLAY_STAT_DURATION.label')"
                          :help="$t('params.systeme.DISPLAY_STAT_DURATION.help')"
                          input-type="range"
                          :min="1"
                          :max="10"
                          :step="1"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.SLEEP_TIMEOUT_MINUTES"
                          :label="$t('params.systeme.SLEEP_TIMEOUT_MINUTES.label')"
                          :help="$t('params.systeme.SLEEP_TIMEOUT_MINUTES.help')"
                          input-type="number"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.SLEEP_THRESHOLD_CPS"
                          :label="$t('params.systeme.SLEEP_THRESHOLD_CPS.label')"
                          :help="$t('params.systeme.SLEEP_THRESHOLD_CPS.help')"
                          input-type="number"
                          :step="0.1"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.MULTIDISPLAY_DURATION"
                          :label="$t('params.systeme.MULTIDISPLAY_DURATION.label')"
                          :help="$t('params.systeme.MULTIDISPLAY_DURATION.help')"
                          input-type="number"
                        ></config-field>
                      </div>
                      <b-button variant="success" block type="submit">Sauver</b-button>
                    </div>
                  </b-form>
                  <!-- <p>{{config.systeme}}</p> -->
                </b-card>
              </b-tab>
              <!-- <b-tab title="TESTS">
                <p>{{config}}</p>
                <b-link :to="{ name: 'screen'}">Ecran</b-link>
              </b-tab>-->
              <template v-slot:tabs-end>
                <b-nav-item href="#" @click="reload">
                  <span class="text-success">
                    <i class="fa fa-sync-alt"></i>
                    Recharger
                  </span>
                </b-nav-item>
              </template>
            </b-tabs>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import store from "@/store";
import ConfigField from "./ConfigField";
export default {
  name: "Configuration",
  components: { ConfigField },
  props: {},
  data: function() {
    return {
      mode: "normal",
      confVoile: false,
      fuseaux: [
        { value: "-12", text: "-12" },
        { value: "-11", text: "-11" },
        { value: "-10", text: "-10" },
        { value: "-9", text: "-9" },
        { value: "-8", text: "-8" },
        { value: "-7", text: "-7" },
        { value: "-6", text: "-6" },
        { value: "-5", text: "-5" },
        { value: "-4", text: "-4" },
        { value: "-3", text: "-3" },
        { value: "-2", text: "-2" },
        { value: "-1", text: "-1" },
        { value: "0", text: "0" },
        { value: "1", text: "1" },
        { value: "2", text: "2" },
        { value: "3", text: "3" },
        { value: "4", text: "4" },
        { value: "5", text: "5" },
        { value: "6", text: "6" },
        { value: "7", text: "7" },
        { value: "8", text: "8" },
        { value: "9", text: "9" },
        { value: "10", text: "10" },
        { value: "11", text: "11" },
        { value: "12", text: "12" },
        { value: "13", text: "13" },
        { value: "14", text: "14" }
      ],
      volumes: [
        { value: "0", text: "0" },
        { value: "1", text: "1" },
        { value: "2", text: "2" },
        { value: "3", text: "3" },
        { value: "4", text: "4" },
        { value: "5", text: "5" },
        { value: "6", text: "6" },
        { value: "7", text: "7" },
        { value: "8", text: "8" },
        { value: "9", text: "9" },
        { value: "10", text: "10" }
      ]
    };
  },
  methods: {
    onSaveConfig: function() {
      this.confVoile = false;
      store.commit("setConfig", this.localConfig);
      let self = this;
      store.dispatch("saveConfig").then(
        // eslint-disable-next-line
        response => {
          store.dispatch("loadConfig");
          self.$bvToast.toast("Configuration sauvegardé sur la carte SD.", {
            title: "Config",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "success"
          });
        },
        // eslint-disable-next-line
        error => {
          self.$bvToast.toast(`Echec de la sauvegarde de la configuration.`, {
            title: "Config",
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger"
          });
        }
      );
      return;
    },
    reload: function() {
      let self = this;
      store.dispatch("loadConfig").then(function() {
        self.$forceUpdate();
      });
    }
  },
  computed: {
    ...mapGetters(["config"]),
    localConfig: function() {
      return JSON.parse(JSON.stringify(this.config));
    },
    gliders: function() {
      return [
        { value: 0, text: this.localConfig.general.GLIDER.GLIDER_NAME1 },
        { value: 1, text: this.localConfig.general.GLIDER.GLIDER_NAME2 },
        { value: 2, text: this.localConfig.general.GLIDER.GLIDER_NAME3 },
        { value: 3, text: this.localConfig.general.GLIDER.GLIDER_NAME4 }
      ];
    }
  },
  mounted: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.configpage {
  padding: 1.5rem;
}
</style>
