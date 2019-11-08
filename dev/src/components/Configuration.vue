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
                        <config-field 
                          v-model="localConfig.general.VARIOMETER_PILOT_NAME"
                          :label="$t('params.general.VARIOMETER_PILOT_NAME.label')"
                          :help="$t('params.general.VARIOMETER_PILOT_NAME.help')"
                          input-type="text"
                        ></config-field>
                        <config-field
                          v-model="localConfig.general.VARIOMETER_GLIDER_NAME"
                          :label="$t('params.general.VARIOMETER_GLIDER_NAME.label')"
                          :help="$t('params.general.VARIOMETER_GLIDER_NAME.help')"
                          input-type="text"
                        ></config-field>
                        <config-field
                          v-model="localConfig.general.VARIOMETER_TIME_ZONE"
                          :label="$t('params.general.VARIOMETER_TIME_ZONE.label')"
                          :help="$t('params.general.VARIOMETER_TIME_ZONE.help')"
                          kind="select"
                          :options="fuseaux"
                        ></config-field>
                        <config-field
                          v-model="localConfig.general.VARIOMETER_BEEP_VOLUME"
                          :label="$t('params.general.VARIOMETER_BEEP_VOLUME.label')"
                          :help="$t('params.general.VARIOMETER_BEEP_VOLUME.help')"
                          kind="select"
                          :options="volumes"
                        ></config-field>
                      </div>
                      <b-button variant="success" block type="submit">Sauver</b-button>
                    </div>
                  </b-form>
                </b-card>
                <p>{{config.general}}</p>
              </b-tab>
              <b-tab title="Vario">
                <b-card header="Paramètres Vario" header-tag="header" title>
                  <b-form @submit="onSaveConfig">
                    <div class="row">
                      <div class="col-md-4">
                        <config-field
                          v-model="localConfig.vario.VARIOMETER_SINKING_THRESHOLD"
                          :label="$t('params.vario.VARIOMETER_SINKING_THRESHOLD.label')"
                          :help="$t('params.vario.VARIOMETER_SINKING_THRESHOLD.help')"
                          input-type="range"
                          :min="-10"
                          :max="0"
                          :step="0.1"
                        ></config-field>
                        <config-field
                          v-model="localConfig.vario.VARIOMETER_CLIMBING_THRESHOLD"
                          :label="$t('params.vario.VARIOMETER_CLIMBING_THRESHOLD.label')"
                          :help="$t('params.vario.VARIOMETER_CLIMBING_THRESHOLD.help')"
                          input-type="range"
                          :min="0"
                          :max="10"
                          :step="0.1"
                        ></config-field>
                        <config-field
                          v-model="localConfig.vario.VARIOMETER_NEAR_CLIMBING_SENSITIVITY"
                          :label="$t('params.vario.VARIOMETER_NEAR_CLIMBING_SENSITIVITY.label')"
                          :help="$t('params.vario.VARIOMETER_NEAR_CLIMBING_SENSITIVITY.help')"
                          input-type="range"
                          :min="0"
                          :max="1"
                          :step="0.1"
                        ></config-field>
                      </div>
                      <div class="col-md-4">
                        <config-field
                          v-model="localConfig.vario.VARIOMETER_ENABLE_NEAR_CLIMBING_ALARM"
                          :label="$t('params.vario.VARIOMETER_ENABLE_NEAR_CLIMBING_ALARM.label')"
                          :help="$t('params.vario.VARIOMETER_ENABLE_NEAR_CLIMBING_ALARM.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.vario.VARIOMETER_ENABLE_NEAR_CLIMBING_BEEP"
                          :label="$t('params.vario.VARIOMETER_ENABLE_NEAR_CLIMBING_BEEP.label')"
                          :help="$t('params.vario.VARIOMETER_ENABLE_NEAR_CLIMBING_BEEP.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.vario.VARIOMETER_DISPLAY_INTEGRATED_CLIMB_RATE"
                          :label="$t('params.integration.VARIOMETER_DISPLAY_INTEGRATED_CLIMB_RATE.label')"
                          :help="$t('params.integration.VARIOMETER_DISPLAY_INTEGRATED_CLIMB_RATE.help')"
                          kind="checkbox"
                        ></config-field>
                      </div>
                      <div class="col-md-4">
                        <config-field  v-if="mode == 'expert'"
                          v-model="localConfig.vario.SETTINGS_CLIMB_PERIOD_COUNT"
                          :label="$t('params.integration.SETTINGS_CLIMB_PERIOD_COUNT.label')"
                          :help="$t('params.integration.SETTINGS_CLIMB_PERIOD_COUNT.help')"
                          input-type="number"
                        ></config-field>
                        <config-field  v-if="mode == 'expert'"
                          v-model="localConfig.vario.SETTINGS_GLIDE_RATIO_PERIOD_COUNT"
                          :label="$t('params.integration.SETTINGS_GLIDE_RATIO_PERIOD_COUNT.label')"
                          :help="$t('params.integration.SETTINGS_GLIDE_RATIO_PERIOD_COUNT.help')"
                          input-type="number"
                        ></config-field>
                        <config-field  v-if="mode == 'expert'"
                          v-model="localConfig.vario.RATIO_MAX_VALUE"
                          :label="$t('params.integration.RATIO_MAX_VALUE.label')"
                          :help="$t('params.integration.RATIO_MAX_VALUE.help')"
                          input-type="number"
                        ></config-field>
                        <config-field  v-if="mode == 'expert'"
                          v-model="localConfig.vario.RATIO_MIN_SPEED"
                          :label="$t('params.integration.RATIO_MIN_SPEED.label')"
                          :help="$t('params.integration.RATIO_MIN_SPEED.help')"
                          input-type="number"
                        ></config-field>
                      </div>
                      <b-button variant="success" block type="submit">Sauver</b-button>
                    </div>
                  </b-form>
                </b-card>
                <p>{{config.Vavariorio}}</p>
              </b-tab>
              <b-tab title="Début du vol">
                <b-card header="Paramètres Départ Vol" header-tag="header" title>
                  <b-form @submit="onSaveConfig">
                    <div class="row">
                      <div class="col-md-12">
                        <config-field  v-if="mode == 'expert'"
                          v-model="localConfig.flightstart.FLIGHT_START_MIN_TIMESTAMP"
                          :label="$t('params.vol.FLIGHT_START_MIN_TIMESTAMP.label')"
                          :help="$t('params.vol.FLIGHT_START_MIN_TIMESTAMP.help')"
                          input-type="number"
                        ></config-field>
                        <config-field
                          v-model="localConfig.flightstart.FLIGHT_START_VARIO_LOW_THRESHOLD"
                          :label="$t('params.vol.FLIGHT_START_VARIO_LOW_THRESHOLD.label')"
                          :help="$t('params.vol.FLIGHT_START_VARIO_LOW_THRESHOLD.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.flightstart.FLIGHT_START_VARIO_HIGH_THRESHOLD"
                          :label="$t('params.vol.FLIGHT_START_VARIO_HIGH_THRESHOLD.label')"
                          :help="$t('params.vol.FLIGHT_START_VARIO_HIGH_THRESHOLD.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.flightstart.FLIGHT_START_MIN_SPEED"
                          :label="$t('params.vol.FLIGHT_START_MIN_SPEED.label')"
                          :help="$t('params.vol.FLIGHT_START_MIN_SPEED.help')"
                          input-type="number"
                        ></config-field>
                        <config-field
                          v-model="localConfig.flightstart.VARIOMETER_RECORD_WHEN_FLIGHT_START"
                          :label="$t('params.vol.VARIOMETER_RECORD_WHEN_FLIGHT_START.label')"
                          :help="$t('params.vol.VARIOMETER_RECORD_WHEN_FLIGHT_START.help')"
                          kind="checkbox"
                        ></config-field>
                      </div>
                      <b-button variant="success" block type="submit">Sauver</b-button>
                    </div>
                  </b-form>
                </b-card>
                <p>{{config.flightstart}}</p>
              </b-tab>
              <b-tab title="Calibration" v-if="mode == 'expert'">
                <b-card header="Paramètres Calibration" header-tag="header" title>
                  <b-form @submit="onSaveConfig">
                    <div class="row">
                      <div class="col-md-4">
                        <h4>Gyroscope</h4>
                        <br />
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_00"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_00.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_00.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_01"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_01.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_01.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_02"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_02.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_02.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_03"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_03.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_03.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_04"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_04.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_04.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_05"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_05.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_05.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_06"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_06.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_06.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_07"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_07.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_07.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_08"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_08.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_08.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_09"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_09.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_09.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_10"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_10.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_10.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_GYRO_CAL_BIAS_11"
                          :label="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_11.label')"
                          :help="$t('params.calibration.VERTACCEL_GYRO_CAL_BIAS_11.help')"
                        ></config-field>
                      </div>
                      <div class="col-md-4">
                        <h4>Accéléromètre</h4>
                        <br />
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_ACCEL_CAL_BIAS_00"
                          :label="$t('params.calibration.VERTACCEL_ACCEL_CAL_BIAS_00.label')"
                          :help="$t('params.calibration.VERTACCEL_ACCEL_CAL_BIAS_00.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_ACCEL_CAL_BIAS_01"
                          :label="$t('params.calibration.VERTACCEL_ACCEL_CAL_BIAS_01.label')"
                          :help="$t('params.calibration.VERTACCEL_ACCEL_CAL_BIAS_01.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_ACCEL_CAL_BIAS_02"
                          :label="$t('params.calibration.VERTACCEL_ACCEL_CAL_BIAS_02.label')"
                          :help="$t('params.calibration.VERTACCEL_ACCEL_CAL_BIAS_02.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_ACCEL_CAL_SCALE"
                          :label="$t('params.calibration.VERTACCEL_ACCEL_CAL_SCALE.label')"
                          :help="$t('params.calibration.VERTACCEL_ACCEL_CAL_SCALE.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_ACCEL_CAL_BIAS_MULTIPLIER"
                          :label="$t('params.calibration.VERTACCEL_ACCEL_CAL_BIAS_MULTIPLIER.label')"
                          :help="$t('params.calibration.VERTACCEL_ACCEL_CAL_BIAS_MULTIPLIER.help')"
                        ></config-field>
                      </div>
                      <div class="col-md-4">
                        <h4>Magnétomètre</h4>
                        <br />
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_MAG_CAL_BIAS_MULTIPLIER"
                          :label="$t('params.calibration.VERTACCEL_MAG_CAL_BIAS_MULTIPLIER.label')"
                          :help="$t('params.calibration.VERTACCEL_MAG_CAL_BIAS_MULTIPLIER.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_MAG_CAL_BIAS_00"
                          :label="$t('params.calibration.VERTACCEL_MAG_CAL_BIAS_00.label')"
                          :help="$t('params.calibration.VERTACCEL_MAG_CAL_BIAS_00.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_MAG_CAL_BIAS_01"
                          :label="$t('params.calibration.VERTACCEL_MAG_CAL_BIAS_01.label')"
                          :help="$t('params.calibration.VERTACCEL_MAG_CAL_BIAS_01.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_MAG_CAL_BIAS_02"
                          :label="$t('params.calibration.VERTACCEL_MAG_CAL_BIAS_02.label')"
                          :help="$t('params.calibration.VERTACCEL_MAG_CAL_BIAS_02.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.calibration.VERTACCEL_MAG_CAL_PROJ_SCALE"
                          :label="$t('params.calibration.VERTACCEL_MAG_CAL_PROJ_SCALE.label')"
                          :help="$t('params.calibration.VERTACCEL_MAG_CAL_PROJ_SCALE.help')"
                        ></config-field>
                      </div>
                      <b-button variant="success" block type="submit">Sauver</b-button>
                    </div>
                  </b-form>
                </b-card>
                <p>{{config.calibration}}</p>
              </b-tab>
              <b-tab title="Système">
                <b-card header="Paramètres Système" header-tag="header" title>
                  <b-form @submit="onSaveConfig">
                    <div class="row">
                      <div class="col-md-4">
                        <config-field
                          v-model="localConfig.systeme.BT_ENABLE"
                          :label="$t('params.bluetooth.BT_ENABLE.label')"
                          :help="$t('params.bluetooth.BT_ENABLE.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.NO_RECORD"
                          :label="$t('params.vol.NO_RECORD.label')"
                          :help="$t('params.vol.NO_RECORD.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.RATIO_CLIMB_RATE"
                          :label="$t('params.integration.RATIO_CLIMB_RATE.label')"
                          :help="$t('params.integration.RATIO_CLIMB_RATE.help')"
                          kind="select"
                          :options="[{value: '1', text: 'Affichage de la finesse'}, { value: '2', text: 'Affichage du taux de chute moyen' }, { value: '3', text: 'Affichage des 2 informations en alternance dans la zone à droite de l’affiche du vario' }]"
                        ></config-field>
                      </div>
                      <div class="col-md-4">
                        <config-field  v-if="mode == 'expert'"
                          v-model="localConfig.systeme.VARIOMETER_SENT_LXNAV_SENTENCE"
                          :label="$t('params.bluetooth.VARIOMETER_SENT_LXNAV_SENTENCE.label')"
                          :help="$t('params.bluetooth.VARIOMETER_SENT_LXNAV_SENTENCE.help')"
                          kind="select"
                          :options="[{value: '0', text: 'LK8000'}, { value: '1', text: 'LXNAV' }]"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.ALARM_SDCARD"
                          :label="$t('params.alarme.ALARM_SDCARD.label')"
                          :help="$t('params.alarme.ALARM_SDCARD.help')"
                          kind="checkbox"
                        ></config-field>
                        <config-field
                          v-model="localConfig.systeme.ALARM_GPSFIX"
                          :label="$t('params.alarme.ALARM_GPSFIX.label')"
                          :help="$t('params.alarme.ALARM_GPSFIX.help')"
                          kind="checkbox"
                        ></config-field>
                      </div>
                      <div class="col-md-4">
                        <config-field
                          v-model="localConfig.systeme.ALARM_FLYBEGIN"
                          :label="$t('params.alarme.ALARM_FLYBEGIN.label')"
                          :help="$t('params.alarme.ALARM_FLYBEGIN.help')"
                          kind="checkbox"
                        ></config-field>
                      </div>
                      <b-button variant="success" block type="submit">Sauver</b-button>
                    </div>
                  </b-form>
                  <p>{{config.systeme}}</p>
                </b-card>
              </b-tab>
              <b-tab title="WiFi">
                <b-card header="Paramètres Wifi" header-tag="header" title>
                  <b-form @submit="onSaveConfig">
                    <div class="row">
                      <div class="col-md-3">
                        <h4>WIFI 1</h4>
                        <br />
                        <config-field
                          v-model="localConfig.wifi.wifi_1.SSID"
                          :label="$t('params.wifi.SSID_1.label')"
                          :help="$t('params.wifi.SSID_1.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.wifi.wifi_1.PASSWORD"
                          :label="$t('params.wifi.PASSWORD_1.label')"
                          :help="$t('params.wifi.PASSWORD_1.help')"
                        ></config-field>
                      </div>
                      <div class="col-md-3">
                        <h4>WIFI 2</h4>
                        <br />
                        <config-field
                          v-model="localConfig.wifi.wifi_2.SSID"
                          :label="$t('params.wifi.SSID_2.label')"
                          :help="$t('params.wifi.SSID_2.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.wifi.wifi_2.PASSWORD"
                          :label="$t('params.wifi.PASSWORD_2.label')"
                          :help="$t('params.wifi.PASSWORD_2.help')"
                        ></config-field>
                      </div>
                      <div class="col-md-3">
                        <h4>WIFI 3</h4>
                        <br />
                        <config-field
                          v-model="localConfig.wifi.wifi_3.SSID"
                          :label="$t('params.wifi.SSID_3.label')"
                          :help="$t('params.wifi.SSID_3.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.wifi.wifi_3.PASSWORD"
                          :label="$t('params.wifi.PASSWORD_3.label')"
                          :help="$t('params.wifi.PASSWORD_3.help')"
                        ></config-field>
                      </div>
                      <div class="col-md-3">
                        <h4>WIFI 4</h4>
                        <br />
                        <config-field
                          v-model="localConfig.wifi.wifi_4.SSID"
                          :label="$t('params.wifi.SSID_4.label')"
                          :help="$t('params.wifi.SSID_4.help')"
                        ></config-field>
                        <config-field
                          v-model="localConfig.wifi.wifi_4.PASSWORD"
                          :label="$t('params.wifi.PASSWORD_4.label')"
                          :help="$t('params.wifi.PASSWORD-4.help')"
                        ></config-field>
                      </div>

                      <b-button variant="success" block type="submit">Sauver</b-button>
                    </div>
                  </b-form>
                  <p>{{config.wifi}}</p>
                  <!-- <p>{{config}}</p> -->
                </b-card>
              </b-tab>
              <b-tab title="TESTS">
                <p>{{config}}</p>
                <b-link :to="{ name: 'screen'}">Ecran</b-link>
              </b-tab>
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
  props: {
    msg: String
  },
  data: function() {
    return {
      mode: "normal",
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
