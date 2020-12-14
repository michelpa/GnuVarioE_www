<template>
  <div>
    <div class="info-firmware alert alert-warning" v-if="majencours">
      <h3>
        <br />
        <br />
        <br />{{ $t("params.ota.WARNING1") }}
        <br />
        <br />{{ $t("params.ota.WARNING2") }}
      </h3>
    </div>
    <div class="row">
      <div class="col-md-12">
        <section class="jumbotron text-center">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <p class="lead text-muted">
                  <!-- The open source and open hardware variometer.
                  <br />-->
                  <em class="small" v-if="firmwareVersion">
                    {{ $t("about.CURRENT") }}: {{ versionFull }}
                    <br />
                    Type: {{ firmwareVersion.Firmware.type }}
                  </em>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 d-flex">
        <b-card
          class="flex-fill"
          :header="$t('params.ota.H_FROM_INET')"
          header-tag="header"
        >
          <div class="bg-default">
            <div class="row">
              <div class="col-md-6">
                <div v-if="firmwareVersion[keyBeta]">
                  <em class
                    >{{ $t("params.ota.VERSION_BETA") }}
                    {{
                      firmwareVersion[keyBeta].version +
                      "." +
                      firmwareVersion[keyBeta].subversion +
                      "b" +
                      firmwareVersion[keyBeta].betaversion
                    }}</em
                  >
                  <br />
                  <br />
                  <b-button variant="warning" type="button" @click="maj(1)"
                    >{{ $t("params.ota.UPDATE") }}</b-button
                  >
                </div>
                <em class v-else> <br />{{ $t("params.ota.NO_VERSION_BETA") }}</em>
              </div>
              <div class="col-md-6">
                <div v-if="firmwareVersion[keyStable]">
                  <em class
                    >{{ $t("params.ota.VERSION_STABLE") }}
                    {{
                      firmwareVersion[keyStable].version +
                      "." +
                      firmwareVersion[keyStable].subversion
                    }}</em
                  >
                  <br />
                  <br />
                  <b-button variant="success" type="button" @click="maj(1)"
                    >{{ $t("params.ota.UPDATE") }}</b-button
                  >
                </div>
                <em class v-else> <br />{{ $t("params.ota.NO_VERSION_STABLE") }}</em>
              </div>
            </div>
          </div>
        </b-card>
      </div>
      <div class="col-md-6">
        <b-card
          class="flex-fill"
          :header="$t('params.ota.H_FROM_LOCAL')"
          header-tag="header"
        >
          <div class="bg-default">
            <b-form @submit.prevent="onSubmitFirmware" @reset="onResetFirmware">
              <b-form-group
                id="input-group-firmware"
                label-cols-sm="12"
                :label="$t('params.ota.MESSAGE1')"
                label-for="input-firmware"
                :description="$t('params.ota.MESSAGE2')"
              >
                <b-form-file
                  id="input-firmware"
                  v-model="file"
                  :state="Boolean(file)"
                  plain
                ></b-form-file>
                <b-form-invalid-feedback id="input-file-feedback" v-show="error"
                  >{{ $t("params.ota.UPDATE_ERR1") }}</b-form-invalid-feedback
                >
                <br />
                <b-progress
                  v-show="uploading"
                  :value="percentCompleted"
                  :max="100"
                  show-progress
                  animated
                ></b-progress>
              </b-form-group>

              <b-button variant="primary" type="submit">{{ $t("params.ota.UPDATE") }}</b-button>
            </b-form>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  name: "OTA",
  props: {
    msg: String,
  },
  data: function () {
    return {
      file: null,
      percentCompleted: 0,
      uploading: false,
      error: false,
      majencours: false,
    };
  },

  methods: {
    onSubmitFirmware: function () {
      if (!this.file) {
        this.error = true;
        return;
      }
      this.error = false;

      let formData = new FormData();
      formData.append("data", this.file, "update.bin");

      let self = this;
      var config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function (progressEvent) {
          self.percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        },
      };

      this.uploading = true;

      axios
        .post("/fupdate", formData, config)
        .then(function () {
          self.uploading = false;
          self.$bvToast.toast(this.$i18n.t("params.ota.MESSAGE3"),
            {
              title: this.$i18n.t("params.ota.H_OTA"),
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "success",
            }
          );
        })
        .catch(function () {
          self.uploading = false;
          self.$bvToast.toast(this.$i18n.t("params.ota.UPDATE_ERR2"),
            {
              title: this.$i18n.t("params.ota.H_OTA"),
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "danger",
            }
          );
        });
      return;
    },
    onResetFirmware: function () {
      this.file = null;
      return;
    },
    maj: function (beta) {
      this.majencours = true;
      store.dispatch("upgradeFirmware", beta).then(
        // eslint-disable-next-line
        (response) => {},
        // eslint-disable-next-line
        (error) => {
          self.$bvToast.toast(this.$i18n.t("params.ota.UPDATE_ERR3"), {
            title: this.$i18n.t("about.ABOUT"),
            toaster: "b-toaster-top-right",
            solid: true,
            variant: "danger",
          });
        }
      );
    },
  },
  computed: {
    ...mapGetters(["config", "firmwareVersion"]),
    versionFull: function () {
      let v = "";
      if (this.firmwareVersion && this.firmwareVersion.Firmware) {
        v =
          this.firmwareVersion.Firmware.version +
          "." +
          this.firmwareVersion.Firmware.subversion +
          (this.firmwareVersion.Firmware.betaversion > 0
            ? "b" + this.firmwareVersion.Firmware.betaversion
            : "");
      }
      return v;
    },
    keyBeta: function () {
      let v = "";
      if (
        this.firmwareVersion &&
        this.firmwareVersion.Firmware &&
        this.firmwareVersion.Firmware.type
      ) {
        v = "Gnuvario" + this.firmwareVersion.Firmware.type + "b";
      }
      return v;
    },
    keyStable: function () {
      let v = "";
      if (
        this.firmwareVersion &&
        this.firmwareVersion.Firmware &&
        this.firmwareVersion.Firmware.type
      ) {
        v = "Gnuvario" + this.firmwareVersion.Firmware.type;
      }
      return v;
    },
  },
  mounted: function () {
    store.dispatch("loadFirmwareVersion");
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#input-firmware {
  margin: auto;
  width: auto;
}
.info-firmware {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
}
</style>
